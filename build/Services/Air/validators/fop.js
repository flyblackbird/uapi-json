'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

exports.default = params => {
  if (params.fop === undefined) {
    throw new _AirErrors.AirValidationError.FopMissing();
  }

  if (Object.prototype.toString.call(params.fop) !== '[object Object]' || params.fop.type !== 'Cash' && params.fop.type !== 'Card') {
    throw new _AirErrors.AirValidationError.FopTypeUnsupported();
  }
};

module.exports = exports['default'];