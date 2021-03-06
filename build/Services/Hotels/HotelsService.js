'use strict';

var _validateServiceSettings = require('../../utils/validate-service-settings');

var _validateServiceSettings2 = _interopRequireDefault(_validateServiceSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uApiRequest = require('../../Request/uapi-request');
const HotelsParser = require('./HotelsParser');
const HotelsValidator = require('./HotelsValidator');
const getConfig = require('../../config');
const templates = require('./templates');

module.exports = function (settings) {
  var _validateServiceSetti = (0, _validateServiceSettings2.default)(settings);

  const auth = _validateServiceSetti.auth,
        debug = _validateServiceSetti.debug,
        production = _validateServiceSetti.production,
        options = _validateServiceSetti.options;

  const config = getConfig(auth.region, production);
  return {
    search: uApiRequest(config.HotelsService.url, auth, templates.search, 'hotel:HotelSearchAvailabilityRsp', HotelsValidator.HOTELS_SEARCH_REQUEST, HotelsParser.HOTELS_ERROR, HotelsParser.HOTELS_SEARCH_REQUEST, debug, options),
    searchGalileo: uApiRequest(config.HotelsService.url, auth, templates.searchGalileo, 'hotel:HotelSearchAvailabilityRsp', HotelsValidator.HOTELS_SEARCH_REQUEST_GALILEO, HotelsParser.HOTELS_ERROR, HotelsParser.HOTELS_SEARCH_REQUEST_GALILEO, debug, options),
    rates: uApiRequest(config.HotelsService.url, auth, templates.rate, 'hotel:HotelDetailsRsp', HotelsValidator.HOTELS_RATE_REQUEST, HotelsParser.HOTELS_ERROR, HotelsParser.HOTELS_RATE_REQUEST, debug, options),
    book: uApiRequest(config.HotelsService.url, auth, templates.book, 'universal:HotelCreateReservationRsp', HotelsValidator.HOTELS_BOOK_REQUEST, HotelsParser.HOTELS_ERROR, HotelsParser.HOTELS_BOOK_REQUEST, debug, options),
    cancelBook: uApiRequest(config.UniversalRecord.url, auth, templates.universalRecordCancelUR, 'universal:UniversalRecordCancelRsp', HotelsValidator.HOTELS_CANCEL_BOOK_REQUEST, HotelsParser.HOTELS_ERROR, HotelsParser.HOTELS_CANCEL_BOOK_REQUEST, debug, options)
  };
};