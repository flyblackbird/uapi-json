'use strict';

function urls(region) {
  let production = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  const prefix = production ? '' : 'pp.';
  const timeout = production ? 100000 : 200000;
  const url = `https://${region}.universal-api.${prefix}travelport.com/B2BGateway/connect/uAPI`;
  return {
    timeout: timeout,
    HotelsService: {
      url: `${url}/HotelService`
    },
    AirService: {
      url: `${url}/AirService`
    },
    FlightService: {
      url: `${url}/FlightService`
    },
    UniversalRecord: {
      url: `${url}/UniversalRecordService`
    },
    CurrencyConversion: {
      url: `${url}/CurrencyConversionService`
    },
    GdsQueueService: {
      url: `${url}/GdsQueueService`
    },
    TerminalService: {
      url: `${url}/TerminalService`
    }
  };
}

module.exports = function () {
  let region = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'emea';
  let production = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return urls(region, production);
};