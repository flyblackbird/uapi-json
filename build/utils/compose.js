"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Simple compose function that takes two function with one params and
 * returns composition
 */
exports.default = (f, g) => params => g(f(params));

module.exports = exports["default"];