"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = string => {
  if (string === undefined || string === null) {
    return null;
  }
  return {
    currency: string.slice(0, 3),
    value: 1.0 * string.slice(3, string.length)
  };
};

module.exports = exports["default"];