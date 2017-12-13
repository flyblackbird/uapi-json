'use strict';

var _validateServiceSettings = require('../../utils/validate-service-settings');

var _validateServiceSettings2 = _interopRequireDefault(_validateServiceSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uApiRequest = require('../../Request/uapi-request');
const UtilsParser = require('./UtilsParser');
const UtilsValidator = require('./UtilsValidator');
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
    currencyConvert: uApiRequest(config.CurrencyConversion.url, auth, templates.currencyConversion, 'util:CurrencyConversionRsp', UtilsValidator.CURRENCY_CONVERSION, UtilsParser.UTILS_ERROR, UtilsParser.CURRENCY_CONVERSION, debug, options)
  };
};