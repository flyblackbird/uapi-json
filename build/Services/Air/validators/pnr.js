'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (params.pnr === undefined) {
    throw new _AirErrors.GdsValidationError.PnrMissing(params);
  }
};

module.exports = exports['default'];