'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (Object.prototype.toString.call(params.passengers) !== '[object Object]') {
    throw new _AirErrors.AirValidationError.PassengersHashMissing(params);
  }

  Object.keys(params.passengers).forEach(ageCategory => {
    const number = params.passengers[ageCategory];
    if (Object.prototype.toString.call(ageCategory) !== '[object String]' || ageCategory.length !== 3) {
      throw new _AirErrors.AirValidationError.PassengersCategoryInvalid(params);
    }

    if (Object.prototype.toString.call(number) !== '[object Number]') {
      throw new _AirErrors.AirValidationError.PassengersCountInvalid(params);
    }
  });
};

module.exports = exports['default'];