'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (!params.queue) {
    throw new _AirErrors.GdsValidationError.QueueMissing(params);
  }
};

module.exports = exports['default'];