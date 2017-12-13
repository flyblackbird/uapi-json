'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (params.pcc === undefined) {
    throw new _AirErrors.GdsValidationError.PccMissing(params);
  }
};

module.exports = exports['default'];