'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _errorTypes = require('../error-types');

var _errorTypes2 = _interopRequireDefault(_errorTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (object, fields) {
  let ErrorClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _errorTypes2.default.ValidationError;

  fields.forEach(field => {
    if (object[field] === undefined) {
      throw new ErrorClass({
        required: fields,
        missing: field
      });
    }
  });
};

module.exports = exports['default'];