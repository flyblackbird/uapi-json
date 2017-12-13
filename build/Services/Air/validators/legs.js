'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (!params || !params.legs) {
    throw new _AirErrors.AirValidationError.LegsMissing(params);
  }
  if (Object.prototype.toString.call(params.legs) !== '[object Array]') {
    throw new _AirErrors.AirValidationError.LegsInvalidType(params);
  }

  params.legs.forEach((leg, index) => {
    ['from', 'to', 'departureDate'].forEach(key => {
      if (!leg[key]) {
        throw new _AirErrors.AirValidationError.LegsInvalidStructure({ missing: key, index: index, leg: leg });
      }
    });
  });
};

module.exports = exports['default'];