'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (params.email) {
    if (Object.prototype.toString.call(params.email) !== '[object String]') {
      throw new _AirErrors.AirValidationError.IncorrectEmail(params);
    }
  }
};

module.exports = exports['default'];