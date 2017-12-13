'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = stringBuffer => new Promise((resolve, reject) => {
  const buf = new Buffer(stringBuffer, 'base64');
  _zlib2.default.inflate(buf, (err, result) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(result.toString());
  });
});

module.exports = exports['default'];