'use strict';

var _AIR_CREATE_RESERVATION_REQUEST = require('./AIR_CREATE_RESERVATION_REQUEST.handlebars');

var _AIR_CREATE_RESERVATION_REQUEST2 = _interopRequireDefault(_AIR_CREATE_RESERVATION_REQUEST);

var _AIR_EXCHANGE = require('./AIR_EXCHANGE.handlebars');

var _AIR_EXCHANGE2 = _interopRequireDefault(_AIR_EXCHANGE);

var _AIR_EXCHANGE_QUOTE = require('./AIR_EXCHANGE_QUOTE.handlebars');

var _AIR_EXCHANGE_QUOTE2 = _interopRequireDefault(_AIR_EXCHANGE_QUOTE);

var _AIR_FARE_RULES_REQUEST = require('./AIR_FARE_RULES_REQUEST.handlebars');

var _AIR_FARE_RULES_REQUEST2 = _interopRequireDefault(_AIR_FARE_RULES_REQUEST);

var _AIR_FLIGHT_INFORMATION_REQUEST = require('./AIR_FLIGHT_INFORMATION_REQUEST.handlebars');

var _AIR_FLIGHT_INFORMATION_REQUEST2 = _interopRequireDefault(_AIR_FLIGHT_INFORMATION_REQUEST);

var _AIR_LOW_FARE_SEARCH_REQUEST = require('./AIR_LOW_FARE_SEARCH_REQUEST.handlebars');

var _AIR_LOW_FARE_SEARCH_REQUEST2 = _interopRequireDefault(_AIR_LOW_FARE_SEARCH_REQUEST);

var _AIR_PRICE_REQ = require('./AIR_PRICE_REQ.handlebars');

var _AIR_PRICE_REQ2 = _interopRequireDefault(_AIR_PRICE_REQ);

var _AIR_TICKET_REQUEST = require('./AIR_TICKET_REQUEST.handlebars');

var _AIR_TICKET_REQUEST2 = _interopRequireDefault(_AIR_TICKET_REQUEST);

var _AirCancel = require('./AirCancel.handlebars');

var _AirCancel2 = _interopRequireDefault(_AirCancel);

var _AirRetrieveDocument = require('./AirRetrieveDocument.handlebars');

var _AirRetrieveDocument2 = _interopRequireDefault(_AirRetrieveDocument);

var _AirVoidDocument = require('./AirVoidDocument.handlebars');

var _AirVoidDocument2 = _interopRequireDefault(_AirVoidDocument);

var _GDS_QUEUE_PLACE = require('./GDS_QUEUE_PLACE.handlebars');

var _GDS_QUEUE_PLACE2 = _interopRequireDefault(_GDS_QUEUE_PLACE);

var _UNIVERSAL_RECORD_CANCEL_UR = require('./UNIVERSAL_RECORD_CANCEL_UR.handlebars');

var _UNIVERSAL_RECORD_CANCEL_UR2 = _interopRequireDefault(_UNIVERSAL_RECORD_CANCEL_UR);

var _UNIVERSAL_RECORD_FOID = require('./UNIVERSAL_RECORD_FOID.handlebars');

var _UNIVERSAL_RECORD_FOID2 = _interopRequireDefault(_UNIVERSAL_RECORD_FOID);

var _UNIVERSAL_RECORD_IMPORT_REQUEST = require('./UNIVERSAL_RECORD_IMPORT_REQUEST.handlebars');

var _UNIVERSAL_RECORD_IMPORT_REQUEST2 = _interopRequireDefault(_UNIVERSAL_RECORD_IMPORT_REQUEST);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  createReservation: _AIR_CREATE_RESERVATION_REQUEST2.default,
  exchange: _AIR_EXCHANGE2.default,
  exchangeQuote: _AIR_EXCHANGE_QUOTE2.default,
  fareRules: _AIR_FARE_RULES_REQUEST2.default,
  flightInformation: _AIR_FLIGHT_INFORMATION_REQUEST2.default,
  lowFareSearch: _AIR_LOW_FARE_SEARCH_REQUEST2.default,
  price: _AIR_PRICE_REQ2.default,
  ticket: _AIR_TICKET_REQUEST2.default,
  cancel: _AirCancel2.default,
  retrieveDocument: _AirRetrieveDocument2.default,
  voidDocument: _AirVoidDocument2.default,
  gdsQueuePlace: _GDS_QUEUE_PLACE2.default,
  universalRecordCancelUr: _UNIVERSAL_RECORD_CANCEL_UR2.default,
  universalRecordFoid: _UNIVERSAL_RECORD_FOID2.default,
  universalRecordImport: _UNIVERSAL_RECORD_IMPORT_REQUEST2.default
};