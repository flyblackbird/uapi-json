'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServiceError = undefined;

var _nodeErrorsHelpers = require('node-errors-helpers');

const ServiceError = exports.ServiceError = (0, _nodeErrorsHelpers.createErrorClass)('ServiceError', 'General service error');
Object.assign(ServiceError, (0, _nodeErrorsHelpers.createErrorsList)({
  ServiceParamsMissing: 'Service params are missing',
  ServiceParamsInvalid: 'Service params invalid',
  ServiceParamsAuthMissing: 'Service params.auth is missing',
  ServiceParamsAuthInvalid: 'Service params.auth is invalid'
}, ServiceError));

const errors = {
  RuntimeError: (0, _nodeErrorsHelpers.createErrorClass)('RuntimeError', 'Runtime error occured'),
  ValidationError: (0, _nodeErrorsHelpers.createErrorClass)('ValidationError', 'Validation error occured'),
  ParsingError: (0, _nodeErrorsHelpers.createErrorClass)('ParsingError', 'Parsing error occured'),
  SoapError: (0, _nodeErrorsHelpers.createErrorClass)('SoapError', 'Error occurred while executing SOAP call'),
  ServiceError: ServiceError
};

exports.default = errors;