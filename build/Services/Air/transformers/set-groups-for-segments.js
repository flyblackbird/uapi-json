"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = params => {
  params.segments = params.segments.map((segment, i, segments) => {
    const transfer = !!(segments[i + 1] && segments[i + 1].group === segment.group);
    return Object.assign(segment, { transfer: transfer });
  });
  return params;
};

module.exports = exports["default"];