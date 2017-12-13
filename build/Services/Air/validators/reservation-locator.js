'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (Object.prototype.toString.call(params.uapi_reservation_locator !== '[object String]')) {
    throw new _AirErrors.AirValidationError.ReservationLocator(params);
  }
};

module.exports = exports['default'];