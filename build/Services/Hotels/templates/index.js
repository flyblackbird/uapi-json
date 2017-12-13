'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HOTELS_BOOK_REQUEST = require('./HOTELS_BOOK_REQUEST.handlebars');

var _HOTELS_BOOK_REQUEST2 = _interopRequireDefault(_HOTELS_BOOK_REQUEST);

var _HOTELS_RATE_REQUEST = require('./HOTELS_RATE_REQUEST.handlebars');

var _HOTELS_RATE_REQUEST2 = _interopRequireDefault(_HOTELS_RATE_REQUEST);

var _HOTELS_SEARCH_GALILEO_REQUEST = require('./HOTELS_SEARCH_GALILEO_REQUEST.handlebars');

var _HOTELS_SEARCH_GALILEO_REQUEST2 = _interopRequireDefault(_HOTELS_SEARCH_GALILEO_REQUEST);

var _HOTELS_SEARCH_REQUEST = require('./HOTELS_SEARCH_REQUEST.handlebars');

var _HOTELS_SEARCH_REQUEST2 = _interopRequireDefault(_HOTELS_SEARCH_REQUEST);

var _UNIVERSAL_RECORD_CANCEL_UR = require('./UNIVERSAL_RECORD_CANCEL_UR.handlebars');

var _UNIVERSAL_RECORD_CANCEL_UR2 = _interopRequireDefault(_UNIVERSAL_RECORD_CANCEL_UR);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  book: _HOTELS_BOOK_REQUEST2.default,
  rate: _HOTELS_RATE_REQUEST2.default,
  searchGalielo: _HOTELS_SEARCH_GALILEO_REQUEST2.default,
  search: _HOTELS_SEARCH_REQUEST2.default,
  universalRecordCancelUR: _UNIVERSAL_RECORD_CANCEL_UR2.default
};
module.exports = exports['default'];