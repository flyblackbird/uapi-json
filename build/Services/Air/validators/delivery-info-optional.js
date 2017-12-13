'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

var _hasAllRequiredFields = require('../../../utils/has-all-required-fields');

var _hasAllRequiredFields2 = _interopRequireDefault(_hasAllRequiredFields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = params => {
  if (params.deliveryInformation) {
    const requiredFields = ['name', 'street', 'zip', 'country', 'city'];
    (0, _hasAllRequiredFields2.default)(params.deliveryInformation, requiredFields, _AirErrors.AirValidationError.DeliveryInformation);
  }
};

module.exports = exports['default'];