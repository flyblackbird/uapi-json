'use strict';

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _prettyData = require('pretty-data');

var _RequestErrors = require('./RequestErrors');

var _uapiParser = require('./uapi-parser');

var _prepareRequest = require('./prepare-request');

var _prepareRequest2 = _interopRequireDefault(_prepareRequest);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_handlebars2.default.registerHelper('equal', require('handlebars-helper-equal'));

/**
 * basic function for requests/responses
 * @param  {string} service          service url for current response (gateway)
 * @param  {object} auth             {username,password} - credentials
 * @param  {string} reqType          url to file with xml for current request
 * @param  {function} validateFunction function for validation
 * @param  {function} errorHandler    function that gets SOAP:Fault object and handle error
 * @param  {function} parseFunction    function for transforming json soap object to normal object
 * @param  {boolean} debugMode        true - log requests, false - dont
 * @return {Promise}                  returning promise for best error handling ever)
 */
module.exports = function uapiRequest(service, auth, reqType, rootObject, validateFunction, errorHandler, parseFunction) {
  let debugMode = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
  let options = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};

  const config = (0, _config2.default)(auth.region || 'emea');
  const log = options.logFunction || console.log;

  // Performing checks
  if (!service || service.length <= 0) {
    throw new _RequestErrors.RequestValidationError.ServiceUrlMissing();
  } else if (!auth || auth.username === undefined || auth.password === undefined) {
    throw new _RequestErrors.RequestValidationError.AuthDataMissing();
  } else if (reqType === undefined) {
    throw new _RequestErrors.RequestValidationError.RequestTypeUndefined();
  } else if (Object.prototype.toString.call(reqType) !== '[object String]') {
    throw new _RequestErrors.RequestRuntimeError.TemplateFileMissing();
  }

  return function serviceFunc(params) {
    let configOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (debugMode) {
      log('Input params ', _prettyData.pd.json(params));
    }

    // create a v36 uAPI parser with default params and request data in env
    const uParser = new _uapiParser.Parser(rootObject, 'v36_0', params, debugMode);

    const validateInput = () => Promise.resolve(params).then(validateFunction).then(validatedParams => {
      params = validatedParams;
      uParser.env = validatedParams;
      return reqType;
    });

    const sendRequest = function sendRequest(xml) {
      if (debugMode) {
        log('Request URL: ', service);
        log('Request XML: ', _prettyData.pd.xml(xml));
      }
      return _axios2.default.request({
        url: service,
        method: 'POST',
        timeout: config.timeout || 5000,
        auth: {
          username: auth.username,
          password: auth.password
        },
        headers: {
          'Accept-Encoding': 'gzip',
          'Content-Type': 'text/xml'
        },
        data: xml
      }).then(response => {
        if (debugMode > 1) {
          log('Response SOAP: ', _prettyData.pd.xml(response.data));
        }
        return response.data;
      }).catch(e => {
        const rsp = e.response;
        const error = {
          status: rsp.status,
          data: rsp.data
        };

        if (debugMode) {
          log('Error Response SOAP: ', _prettyData.pd.json(error));
        }

        return Promise.reject(new _RequestErrors.RequestSoapError.SoapRequestError(error));
      });
    };

    const parseResponse = function parseResponse(response) {
      // if there are web server or HTTP auth errors, uAPI returns a JSON
      let data = null;
      try {
        data = JSON.parse(response);
      } catch (err) {
        return uParser.parse(response);
      }

      // TODO parse JSON errors
      return Promise.reject(new _RequestErrors.RequestSoapError.SoapServerError(data));
    };

    const validateSOAP = function validateSOAP(parsedXML) {
      if (parsedXML['SOAP:Fault']) {
        if (debugMode > 2) {
          log('Parsed error response', _prettyData.pd.json(parsedXML));
        }
        // use a special uAPI parser configuration for errors, copy detected uAPI version
        const errParserConfig = (0, _uapiParser.errorsConfig)();
        const errParser = new _uapiParser.Parser(rootObject, uParser.uapi_version, params, debugMode, errParserConfig);
        const errData = errParser.mergeLeafRecursive(parsedXML['SOAP:Fault'][0]); // parse error data
        return errorHandler.call(errParser, errData);
      } else if (debugMode > 2) {
        log('Parsed response', _prettyData.pd.json(parsedXML));
      }

      return parsedXML;
    };

    const handleSuccess = function handleSuccess(result) {
      if (debugMode > 1) {
        if (typeof result === 'string') {
          log('Returning result', result);
        } else {
          log('Returning result', _prettyData.pd.json(result));
        }
      }
      return result;
    };

    // return XML response directly if specified
    if (configOptions.XML) {
      return validateInput().then(_handlebars2.default.compile).then(template => (0, _prepareRequest2.default)(template, auth, params)).then(sendRequest);
    }

    return validateInput().then(_handlebars2.default.compile).then(template => (0, _prepareRequest2.default)(template, auth, params)).then(sendRequest).then(parseResponse).then(validateSOAP).then(parseFunction.bind(uParser)) // TODO merge Hotels
    .then(handleSuccess);
  };
};