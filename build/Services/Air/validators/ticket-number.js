'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (!params.ticketNumber) {
    throw new _AirErrors.AirValidationError.TicketNumberMissing();
  }
  if (!String(params.ticketNumber).match(/^\d{13}/)) {
    throw new _AirErrors.AirValidationError.TicketNumberInvalid();
  }
};

module.exports = exports['default'];