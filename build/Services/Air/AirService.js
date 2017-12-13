'use strict';

var _uapiRequest = require('../../Request/uapi-request');

var _uapiRequest2 = _interopRequireDefault(_uapiRequest);

var _AirParser = require('./AirParser');

var _AirParser2 = _interopRequireDefault(_AirParser);

var _AirValidator = require('./AirValidator');

var _AirValidator2 = _interopRequireDefault(_AirValidator);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _templates = require('./templates');

var _templates2 = _interopRequireDefault(_templates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (settings) {
  const auth = settings.auth,
        debug = settings.debug,
        production = settings.production,
        options = settings.options;

  const config = (0, _config2.default)(auth.region, production);

  return {
    searchLowFares: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.lowFareSearch, 'air:LowFareSearchRsp', _AirValidator2.default.AIR_LOW_FARE_SEARCH_REQUEST, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_LOW_FARE_SEARCH_REQUEST, debug, options),
    lookupFareRules: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.price, 'air:AirPriceRsp', _AirValidator2.default.AIR_PRICE_FARE_RULES_REQUEST, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_PRICE_FARE_RULES_REQUEST, debug, options),
    airPricePricingSolutionXML: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.price, null, // intentionally, no parsing; we need raw XML
    _AirValidator2.default.AIR_PRICE, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_PRICE_REQUEST_PRICING_SOLUTION_XML, debug, options),
    createReservation: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.createReservation, 'universal:AirCreateReservationRsp', _AirValidator2.default.AIR_CREATE_RESERVATION_REQUEST, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_CREATE_RESERVATION_REQUEST, debug, options),
    ticket: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.ticket, 'air:AirTicketingRsp', _AirValidator2.default.AIR_TICKET, // checks for PNR
    _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_TICKET_REQUEST, debug, options),
    getUniversalRecordByPNR: (0, _uapiRequest2.default)(config.UniversalRecord.url, auth, _templates2.default.universalRecordImport, 'universal:UniversalRecordImportRsp', _AirValidator2.default.AIR_REQUEST_BY_PNR, // checks for PNR
    _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_IMPORT_REQUEST, debug, options),
    gdsQueue: (0, _uapiRequest2.default)(config.GdsQueueService.url, auth, _templates2.default.gdsQueuePlace, 'gdsQueue:GdsQueuePlaceRsp', // TODO rewrite into uAPI parser
    _AirValidator2.default.GDS_QUEUE_PLACE, _AirParser2.default.AIR_ERRORS, _AirParser2.default.GDS_QUEUE_PLACE_RESPONSE, debug, options),
    foid: (0, _uapiRequest2.default)(config.UniversalRecord.url, auth, _templates2.default.universalRecordFoid, 'universal:UniversalRecordModifyRsp', _AirValidator2.default.UNIVERSAL_RECORD_FOID, _AirParser2.default.AIR_ERRORS, _AirParser2.default.UNIVERSAL_RECORD_FOID, debug, options),
    cancelUR: (0, _uapiRequest2.default)(config.UniversalRecord.url, auth, _templates2.default.universalRecordCancelUr, null, // TODO rewrite into uAPI parser
    _AirValidator2.default.AIR_CANCEL_UR, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_CANCEL_UR, debug, options),
    flightInfo: (0, _uapiRequest2.default)(config.FlightService.url, auth, _templates2.default.flightInformation, 'air:FlightInformationRsp', _AirValidator2.default.AIR_FLIGHT_INFORMATION, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_FLIGHT_INFORMATION, debug, options),
    getTicket: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.retrieveDocument, 'air:AirRetrieveDocumentRsp', _AirValidator2.default.AIR_GET_TICKET, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_GET_TICKET, debug, options),
    cancelTicket: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.voidDocument, 'air:AirVoidDocumentRsp', _AirValidator2.default.AIR_CANCEL_TICKET, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_CANCEL_TICKET, debug, options),
    cancelPNR: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.cancel, 'universal:AirCancelRsp', _AirValidator2.default.AIR_CANCEL_PNR, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_CANCEL_PNR, debug, options),

    exchangeQuote: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.exchangeQuote, null, _AirValidator2.default.AIR_EXCHANGE_QUOTE, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_EXCHANGE_QUOTE, debug, options),

    exchangeBooking: (0, _uapiRequest2.default)(config.AirService.url, auth, _templates2.default.exchange, 'air:AirExchangeRsp', _AirValidator2.default.AIR_EXCHANGE, _AirParser2.default.AIR_ERRORS, _AirParser2.default.AIR_EXCHANGE, debug, options)
  };
};