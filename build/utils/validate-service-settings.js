'use strict';

var _errorTypes = require('../error-types');

module.exports = function validateServiceSettings(settings) {
  if (!settings) {
    throw new _errorTypes.ServiceError.ServiceParamsMissing();
  }
  if (Object.prototype.toString.call(settings) !== '[object Object]') {
    throw new _errorTypes.ServiceError.ServiceParamsInvalid(settings);
  }
  if (settings.auth === undefined) {
    throw new _errorTypes.ServiceError.ServiceParamsAuthMissing(settings);
  }
  if (Object.prototype.toString.call(settings.auth) !== '[object Object]' || Object.prototype.toString.call(settings.auth.username) !== '[object String]' || Object.prototype.toString.call(settings.auth.password) !== '[object String]' || Object.prototype.toString.call(settings.auth.targetBranch) !== '[object String]') {
    throw new _errorTypes.ServiceError.ServiceParamsAuthInvalid(settings);
  }
  return settings;
};