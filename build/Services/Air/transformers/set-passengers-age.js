'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = params => {
  params.passengers = params.passengers.map(passenger => {
    const birth = (0, _moment2.default)(passenger.birthDate.toUpperCase(), 'YYYY-MM-DD');
    passenger.Age = (0, _moment2.default)().diff(birth, 'years');
    return passenger;
  });
  return params;
};

module.exports = exports['default'];