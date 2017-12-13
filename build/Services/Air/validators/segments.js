'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

var _hasAllRequiredFields = require('../../../utils/has-all-required-fields');

var _hasAllRequiredFields2 = _interopRequireDefault(_hasAllRequiredFields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = params => {
  if (params.segments) {
    if (Object.prototype.toString.call(params.segments) !== '[object Array]') {
      throw new _AirErrors.AirValidationError.SegmentsMissing(params.segments);
    }

    params.segments.forEach(segment => {
      const requiredFields = ['arrival', 'departure', 'airline', 'from', 'to', 'flightNumber', 'plane'];
      (0, _hasAllRequiredFields2.default)(segment, requiredFields, _AirErrors.AirValidationError.SegmentsMissing);
    });
  }
};

module.exports = exports['default'];