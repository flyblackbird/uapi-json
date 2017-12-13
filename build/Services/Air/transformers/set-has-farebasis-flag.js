"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = params => {
  const firstBasis = params.segments && params.segments[0] && params.segments[0].fareBasisCode;

  params.hasFareBasis = firstBasis !== undefined && firstBasis !== null;
  return params;
};

module.exports = exports["default"];