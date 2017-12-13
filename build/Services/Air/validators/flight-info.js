'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateItem = validateItem;

var _AirErrors = require('../AirErrors');

function validateItem(item) {
  if (!item.airline) {
    throw new _AirErrors.AirFlightInfoValidationError.AirlineMissing(item);
  }

  if (!item.flightNumber) {
    throw new _AirErrors.AirFlightInfoValidationError.FlightNumberMissing(item);
  }

  if (!item.departure) {
    throw new _AirErrors.AirFlightInfoValidationError.DepartureMissing(item);
  }
}

exports.default = params => {
  if (Array.isArray(params.flightInfoCriteria)) {
    params.flightInfoCriteria.forEach(validateItem);
  } else {
    validateItem(params.flightInfoCriteria);
  }
};