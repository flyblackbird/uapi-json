"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Applies function one by one
 * @param functions Array<Function> multiple functions as params
 */
exports.default = function () {
  for (var _len = arguments.length, functions = Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }

  return params => {
    functions.forEach(func => func(params));
    return params;
  };
};

module.exports = exports["default"];