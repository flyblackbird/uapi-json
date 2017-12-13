'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _legs = require('./legs');

var _legs2 = _interopRequireDefault(_legs);

var _passengers = require('./passengers');

var _passengers2 = _interopRequireDefault(_passengers);

var _pricingSolutionXml = require('./pricing-solution-xml');

var _pricingSolutionXml2 = _interopRequireDefault(_pricingSolutionXml);

var _paramsIsObject = require('./params-is-object');

var _paramsIsObject2 = _interopRequireDefault(_paramsIsObject);

var _fop = require('./fop');

var _fop2 = _interopRequireDefault(_fop);

var _fopCreditCard = require('./fop-credit-card');

var _fopCreditCard2 = _interopRequireDefault(_fopCreditCard);

var _pnr = require('./pnr');

var _pnr2 = _interopRequireDefault(_pnr);

var _pcc = require('./pcc');

var _pcc2 = _interopRequireDefault(_pcc);

var _queue = require('./queue');

var _queue2 = _interopRequireDefault(_queue);

var _ticketNumber = require('./ticket-number');

var _ticketNumber2 = _interopRequireDefault(_ticketNumber);

var _flightInfo = require('./flight-info');

var _flightInfo2 = _interopRequireDefault(_flightInfo);

var _emailOptional = require('./email-optional');

var _emailOptional2 = _interopRequireDefault(_emailOptional);

var _phone = require('./phone');

var _phone2 = _interopRequireDefault(_phone);

var _deliveryInfoOptional = require('./delivery-info-optional');

var _deliveryInfoOptional2 = _interopRequireDefault(_deliveryInfoOptional);

var _segments = require('./segments');

var _segments2 = _interopRequireDefault(_segments);

var _reservationLocator = require('./reservation-locator');

var _reservationLocator2 = _interopRequireDefault(_reservationLocator);

var _exchangeToken = require('./exchange-token');

var _exchangeToken2 = _interopRequireDefault(_exchangeToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  legs: _legs2.default,
  passengers: _passengers2.default,
  pricingSolutionXml: _pricingSolutionXml2.default,
  paramsIsObject: _paramsIsObject2.default,
  fop: _fop2.default,
  fopCreditCard: _fopCreditCard2.default,
  pnr: _pnr2.default,
  pcc: _pcc2.default,
  queue: _queue2.default,
  ticketNumber: _ticketNumber2.default,
  flightInfo: _flightInfo2.default,
  emailOptional: _emailOptional2.default,
  phone: _phone2.default,
  deliveryInfoOptional: _deliveryInfoOptional2.default,
  segments: _segments2.default,
  reservationLocator: _reservationLocator2.default,
  exchangeToken: _exchangeToken2.default
};
module.exports = exports['default'];