'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TERMINAL_CLOSE_SESSION = require('./TERMINAL_CLOSE_SESSION.handlebars');

var _TERMINAL_CLOSE_SESSION2 = _interopRequireDefault(_TERMINAL_CLOSE_SESSION);

var _TERMINAL_CREATE_SESSION = require('./TERMINAL_CREATE_SESSION.handlebars');

var _TERMINAL_CREATE_SESSION2 = _interopRequireDefault(_TERMINAL_CREATE_SESSION);

var _TERMINAL_REQUEST = require('./TERMINAL_REQUEST.handlebars');

var _TERMINAL_REQUEST2 = _interopRequireDefault(_TERMINAL_REQUEST);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  closeSession: _TERMINAL_CLOSE_SESSION2.default,
  createSession: _TERMINAL_CREATE_SESSION2.default,
  request: _TERMINAL_REQUEST2.default
};
module.exports = exports['default'];