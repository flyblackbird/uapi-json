'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AirErrors = require('../AirErrors');

const Joi = require('joi');

exports.default = params => {
  if (params.fop.type === 'Card') {
    const schema = Joi.object().keys({
      number: Joi.string().min(14) // Diners Club cards are 14-digit
      .max(17) // JCB & Discover credit cards are 17-digit
      .creditCard().required(),
      name: Joi.string().max(50).required(),
      expDate: Joi.string().regex(/^[0-9]{2}\/[0-9]{2}$/).required(),
      cvv2: Joi.string().regex(/^[0-9]{3}$/).required(),
      type: Joi.string().valid(['CA', 'VI', 'AX', 'DC', 'JC']).optional()
    }).required();

    const result = Joi.validate(params.creditCard, schema);
    if (result.error) {
      // NOTE: doesn't leak CC data into exception
      throw new _AirErrors.AirValidationError.CreditCardMissing(result.error.toString());
    }
  }
};

module.exports = exports['default'];