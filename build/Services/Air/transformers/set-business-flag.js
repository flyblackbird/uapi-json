'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = params => {
  params.business = params.segments[0].serviceClass === 'Business';
  return params;
};

module.exports = exports['default'];