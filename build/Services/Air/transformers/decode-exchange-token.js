'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _AirErrors = require('../AirErrors');

var _utils = require('../../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = params => (0, _utils.inflate)(params.exchangeToken).then(JSON.parse).then(token => {
  const resultXml = {};
  Object.keys(token).forEach(root => {
    const builder = new _xml2js2.default.Builder({
      headless: true,
      rootName: root
    });

    const buildObject = {
      [root]: token[root]
    };

    const intResult = builder.buildObject(buildObject);
    // remove root object tags at first and last line
    const lines = intResult.split('\n');
    lines.splice(0, 1);
    lines.splice(-1, 1);

    // return
    resultXml[root + '_XML'] = lines.join('\n');
  });
  params.xml = resultXml;
  return params;
}).catch(e => Promise.reject(new _AirErrors.AirRuntimeError.ExchangeTokenIncorrect(params, e)));

module.exports = exports['default'];