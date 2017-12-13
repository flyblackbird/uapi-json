'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UtilsRuntimeError = exports.UtilsParsingError = exports.UtilsValidationError = undefined;

var _nodeErrorsHelpers = require('node-errors-helpers');

var _errorTypes = require('../../error-types');

var _errorTypes2 = _interopRequireDefault(_errorTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Validation errors
const UtilsValidationError = exports.UtilsValidationError = (0, _nodeErrorsHelpers.createErrorClass)('UtilsValidationError', 'Utils service validation error', _errorTypes2.default.ValidationError);
Object.assign(UtilsValidationError, (0, _nodeErrorsHelpers.createErrorsList)({
  CurrenciesMissing: 'Missing currencies'
}, UtilsValidationError));

// Parsing errors
const UtilsParsingError = exports.UtilsParsingError = (0, _nodeErrorsHelpers.createErrorClass)('UtilsParsingError', 'Utils service parsing error', _errorTypes2.default.ParsingError);

// Runtime errors
const UtilsRuntimeError = exports.UtilsRuntimeError = (0, _nodeErrorsHelpers.createErrorClass)('UtilsRuntimeError', 'Utils service runtime error', _errorTypes2.default.RuntimeError);

exports.default = {
  UtilsValidationError: UtilsValidationError,
  UtilsParsingError: UtilsParsingError,
  UtilsRuntimeError: UtilsRuntimeError
};