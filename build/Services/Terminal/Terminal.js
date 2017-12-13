'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TERMINAL_STATE_ERROR = exports.TERMINAL_STATE_CLOSED = exports.TERMINAL_STATE_READY = exports.TERMINAL_STATE_BUSY = exports.TERMINAL_STATE_NONE = undefined;

var _galileoScreen = require('galileo-screen');

var _galileoScreen2 = _interopRequireDefault(_galileoScreen);

var _TerminalErrors = require('./TerminalErrors');

var _TerminalService = require('./TerminalService');

var _TerminalService2 = _interopRequireDefault(_TerminalService);

var _validateServiceSettings = require('../../utils/validate-service-settings');

var _validateServiceSettings2 = _interopRequireDefault(_validateServiceSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TERMINAL_STATE_NONE = exports.TERMINAL_STATE_NONE = 'TERMINAL_STATE_NONE';
const TERMINAL_STATE_BUSY = exports.TERMINAL_STATE_BUSY = 'TERMINAL_STATE_BUSY';
const TERMINAL_STATE_READY = exports.TERMINAL_STATE_READY = 'TERMINAL_STATE_READY';
const TERMINAL_STATE_CLOSED = exports.TERMINAL_STATE_CLOSED = 'TERMINAL_STATE_CLOSED';
const TERMINAL_STATE_ERROR = exports.TERMINAL_STATE_ERROR = 'TERMINAL_STATE_ERROR';

const screenFunctions = (0, _galileoScreen2.default)({ cursor: '><' });

module.exports = function (settings) {
  const service = (0, _TerminalService2.default)((0, _validateServiceSettings2.default)(settings));
  const log = settings.options && settings.options.logFunction || console.log;
  const emulatePcc = settings.auth.emulatePcc || false;
  const timeout = settings.timeout || false;
  const debug = settings.debug || 0;
  const state = {
    terminalState: TERMINAL_STATE_NONE,
    sessionToken: null
  };
  // Processing response with MD commands
  const processResponse = function processResponse(response) {
    let previousResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    const processedResponse = previousResponse ? screenFunctions.mergeResponse(previousResponse, response.join('\n')) : response.join('\n');
    if (!screenFunctions.hasMore(processedResponse)) {
      return processedResponse;
    }
    return service.executeCommand({
      sessionToken: state.sessionToken,
      command: 'MD'
    }).then(mdResponse => processResponse(mdResponse, processedResponse));
  };
  // Getting session token
  const getSessionToken = () => new Promise((resolve, reject) => {
    if (state.terminalState === TERMINAL_STATE_BUSY) {
      reject(new _TerminalErrors.TerminalRuntimeError.TerminalIsBusy());
      return;
    }
    if (state.terminalState === TERMINAL_STATE_CLOSED) {
      reject(new _TerminalErrors.TerminalRuntimeError.TerminalIsClosed());
      return;
    }
    Object.assign(state, {
      terminalState: TERMINAL_STATE_BUSY
    });
    // Return token if already obtained
    if (state.sessionToken !== null) {
      resolve(state.sessionToken);
      return;
    }
    // Getting token
    service.getSessionToken({ timeout: timeout }).then(tokenData => {
      // Remember sesion token
      Object.assign(state, tokenData);
      // Return if no emulation needed
      if (!emulatePcc) {
        return tokenData.sessionToken;
      }
      // Emulate pcc
      return service.executeCommand({
        sessionToken: tokenData.sessionToken,
        command: `SEM/${emulatePcc}/AG`
      }).then(response => {
        if (!response[0].match(/^PROCEED/)) {
          return Promise.reject(new _TerminalErrors.TerminalRuntimeError.TerminalEmulationFailed(response));
        }
        return Promise.resolve(tokenData.sessionToken);
      });
    }).then(resolve).catch(reject);
  });

  const terminal = {
    executeCommand: command => Promise.resolve().then(() => {
      if (debug) {
        log(`Terminal request:\n${command}`);
      }
      return Promise.resolve();
    }).then(() => getSessionToken()).then(sessionToken => service.executeCommand({
      command: command,
      sessionToken: sessionToken
    })).then(processResponse).then(response => {
      if (debug) {
        log(`Terminal response:\n${response}`);
      }
      Object.assign(state, {
        terminalState: TERMINAL_STATE_READY
      });
      return response;
    }).catch(err => {
      Object.assign(state, {
        terminalState: TERMINAL_STATE_ERROR
      });
      throw err;
    }),
    closeSession: () => getSessionToken().then(sessionToken => service.closeSession({
      sessionToken: sessionToken
    })).then(response => {
      Object.assign(state, {
        terminalState: TERMINAL_STATE_CLOSED
      });
      return response;
    })
  };

  // Adding event handler on beforeExit and exit process events
  process.on('beforeExit', () => {
    switch (state.terminalState) {
      case TERMINAL_STATE_BUSY:
      case TERMINAL_STATE_READY:
      case TERMINAL_STATE_ERROR:
        if (state.terminalState === TERMINAL_STATE_BUSY) {
          log('UAPI-JSON WARNING: Process exited before completing TerminalService request');
        }
        if (state.sessionToken !== null) {
          log('UAPI-JSON WARNING: Process left TerminalService session open');
          log('UAPI-JSON WARNING: Session closing');
          terminal.closeSession().then(() => log('UAPI-JSON WARNING: Session closed')).catch(() => {
            throw new _TerminalErrors.TerminalRuntimeError.ErrorClosingSession();
          });
        }
        break;
      default:
        break;
    }
  });
  /* istanbul ignore next */
  process.on('exit', () => {
    switch (state.terminalState) {
      case TERMINAL_STATE_BUSY:
      case TERMINAL_STATE_READY:
      case TERMINAL_STATE_ERROR:
        if (state.terminalState === TERMINAL_STATE_BUSY) {
          log('UAPI-JSON WARNING: Process exited before completing TerminalService request');
        }
        if (state.sessionToken !== null) {
          log('UAPI-JSON WARNING: Process left TerminalService session open');
        }
        break;
      default:
        break;
    }
  });

  return terminal;
};