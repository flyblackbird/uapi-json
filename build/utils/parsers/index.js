'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bookingPnr = require('./booking-pnr');

var _bookingPnr2 = _interopRequireDefault(_bookingPnr);

var _searchPassengersList = require('./search-passengers-list');

var _searchPassengersList2 = _interopRequireDefault(_searchPassengersList);

var _serviceSegment = require('./service-segment');

var _serviceSegment2 = _interopRequireDefault(_serviceSegment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  bookingPnr: _bookingPnr2.default,
  searchPassengersList: _searchPassengersList2.default,
  serviceSegment: _serviceSegment2.default
};
module.exports = exports['default'];