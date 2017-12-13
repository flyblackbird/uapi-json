'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (!params) {
    throw new _AirErrors.AirValidationError.ParamsMissing(params);
  }
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    throw new _AirErrors.AirValidationError.ParamsInvalidType(params);
  }
};

module.exports = exports['default'];