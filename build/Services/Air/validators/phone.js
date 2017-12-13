'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

var _hasAllRequiredFields = require('../../../utils/has-all-required-fields');

var _hasAllRequiredFields2 = _interopRequireDefault(_hasAllRequiredFields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = params => {
  (0, _hasAllRequiredFields2.default)(params, ['phone'], _AirErrors.AirValidationError.PhoneMissing);
  const requiredFields = ['number', 'location', 'countryCode'];
  (0, _hasAllRequiredFields2.default)(params.phone, requiredFields, _AirErrors.AirValidationError.IncorrectPhoneFormat);
};

module.exports = exports['default'];