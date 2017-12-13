'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = string => new Promise((resolve, reject) => {
  _zlib2.default.deflate(string, (err, result) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(result.toString('base64'));
  });
});

module.exports = exports['default'];