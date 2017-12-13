'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestSoapError = exports.RequestRuntimeError = exports.RequestValidationError = undefined;

var _nodeErrorsHelpers = require('node-errors-helpers');

var _errorTypes = require('../error-types');

var _errorTypes2 = _interopRequireDefault(_errorTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Validation errors
const RequestValidationError = exports.RequestValidationError = (0, _nodeErrorsHelpers.createErrorClass)('RequestValidationError', 'Request validation error', _errorTypes2.default.ValidationError);
Object.assign(RequestValidationError, (0, _nodeErrorsHelpers.createErrorsList)({
  ServiceUrlMissing: 'Service URL is missing',
  AuthDataMissing: 'Auth data is missing',
  ParamsMissing: 'Params for function are missing',
  RequestTypeUndefined: 'Undefined request type'
}, RequestValidationError));

// Runtime errors
const RequestRuntimeError = exports.RequestRuntimeError = (0, _nodeErrorsHelpers.createErrorClass)('RequestRuntimeError', 'Request runtime error', _errorTypes2.default.RuntimeError);
Object.assign(RequestRuntimeError, (0, _nodeErrorsHelpers.createErrorsList)({
  TemplateFileMissing: 'XML template not found for request',
  VersionParsingError: 'Error during parsing version of uapi',
  UnhandledError: 'Error during request. Please try again later',
  ResultsMissing: 'Missing results in response'
}, RequestRuntimeError));

// Soap errors
const RequestSoapError = exports.RequestSoapError = (0, _nodeErrorsHelpers.createErrorClass)('RequestSoapError', 'Request SOAP error', _errorTypes2.default.SoapError);
Object.assign(RequestSoapError, (0, _nodeErrorsHelpers.createErrorsList)({
  SoapRequestError: 'Error during request to SOAP API. Check url validity',
  SoapParsingError: 'SOAP response parsing failed',
  SoapServerError: 'SOAP server error. Check auth and other data'
}, RequestSoapError));

exports.default = {
  RequestValidationError: RequestValidationError,
  RequestRuntimeError: RequestRuntimeError,
  RequestSoapError: RequestSoapError
};