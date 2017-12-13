'use strict';

var _TerminalErrors = require('./TerminalErrors');

function Validator(params) {
  this.params = params;
}

Validator.prototype.end = function () {
  return this.params;
};

Validator.prototype.paramsIsObject = function () {
  if (!this.params) {
    throw new _TerminalErrors.TerminalValidationError.ParamsMissing(this.params);
  }
  if (typeof this.params !== 'object') {
    throw new _TerminalErrors.TerminalValidationError.ParamsInvalidType(this.params);
  }
  return this;
};

Validator.prototype.command = function () {
  if (!this.params.command) {
    throw new _TerminalErrors.TerminalValidationError.CommandMissing(this.params);
  }
  if (typeof this.params.command !== 'string') {
    throw new _TerminalErrors.TerminalValidationError.CommandInvalid(this.params);
  }
  return this;
};

Validator.prototype.sessionToken = function () {
  if (!this.params.sessionToken) {
    throw new _TerminalErrors.TerminalValidationError.SessionTokenMissing(this.params);
  }
  if (typeof this.params.sessionToken !== 'string') {
    throw new _TerminalErrors.TerminalValidationError.SessionTokenInvalid(this.params);
  }
  return this;
};

Validator.prototype.timeout = function () {
  if (this.params.timeout !== false) {
    if (typeof this.params.timeout !== 'number') {
      throw new _TerminalErrors.TerminalValidationError.SessionTimeoutInvalid(this.params);
    }
    if (this.params.timeout <= 0) {
      throw new _TerminalErrors.TerminalValidationError.SessionTimeoutTooLow(this.params);
    }
  }
  return this;
};

module.exports = {
  CREATE_SESSION: function CREATE_SESSION(params) {
    return new Validator(params).paramsIsObject().timeout().end();
  },
  TERMINAL_REQUEST: function TERMINAL_REQUEST(params) {
    return new Validator(params).paramsIsObject().sessionToken().command().end();
  },
  CLOSE_SESSION: function CLOSE_SESSION(params) {
    return new Validator(params).paramsIsObject().sessionToken().end();
  }
};