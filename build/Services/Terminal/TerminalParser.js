'use strict';

var _TerminalErrors = require('./TerminalErrors');

function errorHandler(rsp) {
  if (rsp && rsp.detail) {
    const errorInfo = rsp.detail[`common_${this.uapi_version}:ErrorInfo`];
    const code = errorInfo[`common_${this.uapi_version}:Code`];
    const faultString = rsp.faultstring;
    switch (code) {
      case '345':
        throw new _TerminalErrors.TerminalRuntimeError.NoAgreement({
          screen: faultString,
          data: rsp
        });
      default:
        throw new _TerminalErrors.TerminalRuntimeError(rsp);
    }
  }

  throw new _TerminalErrors.TerminalRuntimeError(rsp);
}

function createSession(rsp) {
  if (!rsp[`common_${this.uapi_version}:HostToken`] || !rsp[`common_${this.uapi_version}:HostToken`]._) {
    throw new _TerminalErrors.TerminalParsingError.TerminalSessionTokenMissing();
  }
  return { sessionToken: rsp[`common_${this.uapi_version}:HostToken`]._ };
}

function terminalRequest(rsp) {
  if (!rsp['terminal:TerminalCommandResponse'] || !rsp['terminal:TerminalCommandResponse']['terminal:Text']) {
    throw new _TerminalErrors.TerminalParsingError.TerminalResponseMissing();
  }
  return rsp['terminal:TerminalCommandResponse']['terminal:Text'];
}

function closeSession(rsp) {
  if (!rsp[`common_${this.uapi_version}:ResponseMessage`] || !rsp[`common_${this.uapi_version}:ResponseMessage`][0] || !rsp[`common_${this.uapi_version}:ResponseMessage`][0]._ || !rsp[`common_${this.uapi_version}:ResponseMessage`][0]._.match(/Terminal End Session Successful/i)) {
    throw new _TerminalErrors.TerminalRuntimeError.TerminalCloseSessionFailed();
  }
  return true;
}

module.exports = {
  TERMINAL_ERROR: errorHandler,
  CREATE_SESSION: createSession,
  TERMINAL_REQUEST: terminalRequest,
  CLOSE_SESSION: closeSession
};