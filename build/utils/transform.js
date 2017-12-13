"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Apply all transformers to params
 * @param transformers Array<Function>
 */
exports.default = function () {
  for (var _len = arguments.length, transformers = Array(_len), _key = 0; _key < _len; _key++) {
    transformers[_key] = arguments[_key];
  }

  return params => {
    const cloned = JSON.parse(JSON.stringify(params));
    return transformers.reduce((acc, x) => acc.then(x), Promise.resolve(cloned));
  };
};

module.exports = exports["default"];