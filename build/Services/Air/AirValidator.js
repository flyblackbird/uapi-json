'use strict';

var _utils = require('../../utils');

var _validators = require('./validators');

var _validators2 = _interopRequireDefault(_validators);

var _transformers = require('./transformers');

var _transformers2 = _interopRequireDefault(_transformers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  AIR_LOW_FARE_SEARCH_REQUEST: (0, _utils.compose)((0, _utils.validate)(_validators2.default.passengers, _validators2.default.legs), (0, _utils.transform)(_transformers2.default.convertPassengersObjectToArray)),

  AIR_PRICE_FARE_RULES_REQUEST: (0, _utils.compose)((0, _utils.validate)(_validators2.default.segments, _validators2.default.passengers), (0, _utils.transform)(_transformers2.default.setBusinessFlag,
  // transformers.setGroupsForSegments, <air:Connection/> hack fails validation on pre-prod
  _transformers2.default.setHasFareBasisFlag, _transformers2.default.convertPassengersObjectToArray)),

  AIR_PRICE: (0, _utils.compose)((0, _utils.validate)(_validators2.default.segments), (0, _utils.transform)(_transformers2.default.setBusinessFlag, _transformers2.default.setPassengersAge, _transformers2.default.setGroupsForSegments, _transformers2.default.setHasFareBasisFlag)),

  AIR_CREATE_RESERVATION_REQUEST: (0, _utils.compose)((0, _utils.validate)(_validators2.default.emailOptional, _validators2.default.phone, _validators2.default.deliveryInfoOptional, _validators2.default.pricingSolutionXml), (0, _utils.transform)(_transformers2.default.setPassengersAge, _transformers2.default.addMetaPassengersBooking)),

  AIR_TICKET: (0, _utils.compose)((0, _utils.validate)(_validators2.default.paramsIsObject, _validators2.default.fop, _validators2.default.fopCreditCard, _validators2.default.pnr), (0, _utils.transform)(_transformers2.default.fixCardFop)),

  AIR_REQUEST_BY_PNR: (0, _utils.compose)((0, _utils.validate)(_validators2.default.pnr), (0, _utils.transform)()),

  GDS_QUEUE_PLACE: (0, _utils.compose)((0, _utils.validate)(_validators2.default.pnr, _validators2.default.pcc, _validators2.default.queue), (0, _utils.transform)()),

  AIR_CANCEL_UR: params => params,
  UNIVERSAL_RECORD_FOID: params => params,

  AIR_FLIGHT_INFORMATION: (0, _utils.compose)((0, _utils.validate)(_validators2.default.flightInfo), (0, _utils.transform)()),

  AIR_GET_TICKET: (0, _utils.compose)((0, _utils.validate)(_validators2.default.paramsIsObject, _validators2.default.ticketNumber), (0, _utils.transform)()),

  AIR_CANCEL_TICKET: (0, _utils.compose)((0, _utils.validate)(_validators2.default.paramsIsObject, _validators2.default.pnr, _validators2.default.ticketNumber), (0, _utils.transform)()),

  AIR_CANCEL_PNR: (0, _utils.compose)((0, _utils.validate)(_validators2.default.paramsIsObject, _validators2.default.pnr), (0, _utils.transform)()),

  AIR_EXCHANGE_QUOTE: (0, _utils.compose)((0, _utils.validate)(_validators2.default.segments, _validators2.default.pnr), (0, _utils.transform)()),

  AIR_EXCHANGE: (0, _utils.compose)((0, _utils.validate)(_validators2.default.pnr, _validators2.default.reservationLocator, _validators2.default.exchangeToken), (0, _utils.transform)(_transformers2.default.decodeExchangeToken))
};