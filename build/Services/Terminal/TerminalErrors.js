'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TerminalRuntimeError = exports.TerminalParsingError = exports.TerminalValidationError = undefined;

var _nodeErrorsHelpers = require('node-errors-helpers');

var _errorTypes = require('../../error-types');

var _errorTypes2 = _interopRequireDefault(_errorTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Validation errors
const TerminalValidationError = exports.TerminalValidationError = (0, _nodeErrorsHelpers.createErrorClass)('TerminalValidationError', 'Terminal service validation error', _errorTypes2.default.ValidationError);
Object.assign(TerminalValidationError, (0, _nodeErrorsHelpers.createErrorsList)({
  ParamsMissing: 'Params are missing',
  ParamsInvalidType: 'Params should be passed as object',
  CommandMissing: 'Command is missing',
  CommandInvalid: 'Command is invalid',
  SessionTokenMissing: 'Session token is missing',
  SessionTokenInvalid: 'Session token is invalid',
  SessionTimeoutInvalid: 'Session timeout value is invalid',
  SessionTimeoutTooLow: 'Timeout value must be positive integer'
}, TerminalValidationError));

// Parsing errors
const TerminalParsingError = exports.TerminalParsingError = (0, _nodeErrorsHelpers.createErrorClass)('TerminalParsingError', 'Terminal service parsing error', _errorTypes2.default.ParsingError);
Object.assign(TerminalParsingError, (0, _nodeErrorsHelpers.createErrorsList)({
  TerminalSessionTokenMissing: 'Terminal session token is missing in service response',
  TerminalResponseMissing: 'Terminal response is missing in service response'
}, TerminalParsingError));

// Runtime errors
const TerminalRuntimeError = exports.TerminalRuntimeError = (0, _nodeErrorsHelpers.createErrorClass)('TerminalRuntimeError', 'Terminal service runtime error', _errorTypes2.default.RuntimeError);
Object.assign(TerminalRuntimeError, (0, _nodeErrorsHelpers.createErrorsList)({
  TerminalEmulationFailed: 'Terminal emulation failed',
  TerminalCloseSessionFailed: 'Failed to close terminal session',
  TerminalIsBusy: 'Terminal is busy',
  TerminalIsClosed: 'Terminal is closed',
  ErrorClosingSession: 'Error closing session',
  NoAgreement: 'There is no agreement between current pcc and you trying to reach'
}, TerminalRuntimeError));

exports.default = {
  TerminalValidationError: TerminalValidationError,
  TerminalParsingError: TerminalParsingError,
  TerminalRuntimeError: TerminalRuntimeError
};