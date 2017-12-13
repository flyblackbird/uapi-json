'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  const solution = params['air:AirPricingSolution'];
  if (Object.prototype.toString.call(solution) !== '[object Object]') {
    throw new _AirErrors.AirValidationError.AirPricingSolutionInvalidType(params);
  }
};

module.exports = exports['default'];