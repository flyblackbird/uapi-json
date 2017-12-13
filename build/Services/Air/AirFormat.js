'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parsers = require('../../utils/parsers');

var _parsers2 = _interopRequireDefault(_parsers);

var _AirErrors = require('./AirErrors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getBaggage(baggageAllowance) {
  // Checking for allowance
  if (!baggageAllowance || !baggageAllowance['air:NumberOfPieces'] && !baggageAllowance['air:MaxWeight']) {
    console.warn('Baggage information is not number and is not weight!', JSON.stringify(baggageAllowance));
    return { units: 'piece', amount: 0 };
  }
  // Checking for max weight
  if (baggageAllowance['air:MaxWeight']) {
    return {
      units: baggageAllowance['air:MaxWeight'].Unit.toLowerCase(),
      amount: Number(baggageAllowance['air:MaxWeight'].Value)
    };
  }
  // Returning pieces
  return {
    units: 'piece',
    amount: Number(baggageAllowance['air:NumberOfPieces'])
  };
}

function formatSegment(segment) {
  return {
    from: segment.Origin,
    to: segment.Destination,
    group: Number(segment.Group),
    departure: segment.DepartureTime,
    arrival: segment.ArrivalTime,
    airline: segment.Carrier,
    flightNumber: segment.FlightNumber,
    serviceClass: segment.CabinClass,
    uapi_segment_ref: segment.Key
  };
}

function formatServiceSegment(segment, remark) {
  return _extends({}, _parsers2.default.serviceSegment(remark['passive:Text']), {
    carrier: segment.SupplierCode,
    airport: segment.Origin,
    date: segment.StartDate,
    index: segment.index
  });
}

function formatPrices(prices) {
  return {
    basePrice: prices.BasePrice,
    taxes: prices.Taxes,
    equivalentBasePrice: prices.EquivalentBasePrice,
    totalPrice: prices.TotalPrice
  };
}

function formatTrip(segment, flightDetails) {
  const flightInfo = Object.keys(flightDetails).map(detailsKey => flightDetails[detailsKey]);
  const plane = flightInfo.map(details => details.Equipment || 'Unknown');
  const duration = flightInfo.map(details => details.FlightTime || 0);
  const techStops = flightInfo.slice(1).map(details => details.Origin);
  return _extends({}, formatSegment(segment), {
    plane: plane,
    duration: duration,
    techStops: techStops
  });
}

function formatAirExchangeBundle(bundle) {
  return {
    addCollection: bundle.AddCollection,
    changeFee: bundle.ChangeFee,
    exchangeAmount: bundle.ExchangeAmount,
    refund: bundle.Refund
  };
}

function formatLowFaresSearch(searchRequest, searchResult) {
  const pricesList = searchResult['air:AirPricePointList'];
  const fareInfos = searchResult['air:FareInfoList'];
  const segments = searchResult['air:AirSegmentList'];
  const flightDetails = searchResult['air:FlightDetailsList'];

  // const legs = _.first(_.toArray(searchResult['air:RouteList']))['air:Leg'];

  // TODO filter pricesList by CompleteItinerary=true & ETicketability = Yes, etc

  const fares = [];

  _lodash2.default.forEach(pricesList, (price, fareKey) => {
    const firstKey = _lodash2.default.first(Object.keys(price['air:AirPricingInfo']));
    const thisFare = price['air:AirPricingInfo'][firstKey]; // get trips from first reservation
    if (!thisFare.PlatingCarrier) {
      return;
    }

    const directions = _lodash2.default.map(thisFare['air:FlightOptionsList'], direction => _lodash2.default.map(direction['air:Option'], option => {
      const trips = option['air:BookingInfo'].map(segmentInfo => {
        const fareInfo = fareInfos[segmentInfo.FareInfoRef];
        const segment = segments[segmentInfo.SegmentRef];
        const tripFlightDetails = segment['air:FlightDetailsRef'].map(flightDetailsRef => flightDetails[flightDetailsRef]);
        const seatsAvailable = segment['air:AirAvailInfo'] && segment['air:AirAvailInfo'].ProviderCode === '1G' ? Number(segment['air:AirAvailInfo']['air:BookingCodeInfo'].BookingCounts.match(new RegExp(`${segmentInfo.BookingCode}(\\d+)`))[1]) : null;
        return Object.assign(formatTrip(segment, tripFlightDetails), {
          serviceClass: segmentInfo.CabinClass,
          bookingClass: segmentInfo.BookingCode,
          baggage: [getBaggage(fareInfo['air:BaggageAllowance'])],
          fareBasisCode: fareInfo.FareBasis
        }, seatsAvailable ? { seatsAvailable: seatsAvailable } : null);
      });
      return {
        from: direction.Origin,
        to: direction.Destination,
        // duration
        // TODO get overnight stops, etc from connection
        platingCarrier: thisFare.PlatingCarrier,
        segments: trips
      };
    }));

    const passengerCounts = {};
    const passengerCategories = _lodash2.default.mapKeys(price['air:AirPricingInfo'], (passengerFare, key) => {
      let code = passengerFare['air:PassengerType'];

      if (_lodash2.default.isString(code)) {
        // air:PassengerType in fullCollapseList_obj ParserUapi param
        passengerCounts[code] = 1;

        // air:PassengerType in noCollapseList
      } else if (_lodash2.default.isArray(code) && code.constructor === Array) {
        // ParserUapi param
        const count = code.length;
        const list = _lodash2.default.uniq(_lodash2.default.map(code, item => {
          if (_lodash2.default.isString(item)) {
            return item;
          } else if (_lodash2.default.isObject(item) && item.Code) {
            // air:PassengerType in fullCollapseList_obj like above,
            // but there is Age or other info, except Code
            return item.Code;
          }
          throw new _AirErrors.AirParsingError.PTCIsNotSet();
        }));

        code = list[0];
        if (!list[0] || list.length !== 1) {
          // TODO throw error
          console.log('Warning: different categories ' + list.join() + ' in single fare calculation ' + key + ' in fare ' + fareKey);
        }
        passengerCounts[code] = count;
      } else {
        throw new _AirErrors.AirParsingError.PTCTypeInvalid();
      }

      return code;
    });

    if (_lodash2.default.size(passengerCategories) !== _lodash2.default.size(price['air:AirPricingInfo'])) {
      console.log('Warning: duplicate categories in passengerCategories map for fare ' + fareKey);
    }

    const passengerFares = Object.keys(passengerCategories).reduce((memo, ptc) => Object.assign(memo, {
      [ptc]: {
        totalPrice: passengerCategories[ptc].TotalPrice,
        basePrice: passengerCategories[ptc].BasePrice,
        taxes: passengerCategories[ptc].Taxes
      }
    }), {});

    const result = {
      totalPrice: price.TotalPrice,
      basePrice: price.BasePrice,
      taxes: price.Taxes,
      directions: directions,
      bookingComponents: [{
        totalPrice: price.TotalPrice,
        basePrice: price.BasePrice,
        taxes: price.Taxes,
        uapi_fare_reference: fareKey // TODO
      }],
      passengerFares: passengerFares,
      passengerCounts: passengerCounts
    };

    fares.push(result);
  });

  fares.sort((a, b) => parseFloat(a.totalPrice.substr(3)) - parseFloat(b.totalPrice.substr(3)));

  return fares;
}

/**
 * This function used to transform segments and service segments objects
 * to arrays. After that this function try to set indexes with same as in
 * terminal response order. So it needs to check `TravelOrder` field for that.
 *
 * @param segmentsObject
 * @param serviceSegmentsObject
 * @return {*}
 */
function setIndexesForSegments() {
  let segmentsObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let serviceSegmentsObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  const segments = segmentsObject ? Object.keys(segmentsObject).map(k => segmentsObject[k]) : null;

  const serviceSegments = serviceSegmentsObject ? Object.keys(serviceSegmentsObject).map(k => serviceSegmentsObject[k]) : null;

  if (segments === null && serviceSegments === null) {
    return { segments: segments, serviceSegments: serviceSegments };
  }

  if (segments !== null && serviceSegments === null) {
    const segmentsNew = segments.map((segment, key) => _extends({}, segment, {
      index: key + 1
    }));
    return { segments: segmentsNew, serviceSegments: serviceSegments };
  }

  if (segments === null && serviceSegments !== null) {
    const serviceSegmentsNew = serviceSegments.map((segment, key) => _extends({}, segment, {
      index: key + 1
    }));
    return { segments: segments, serviceSegments: serviceSegmentsNew };
  }

  const maxSegmentsTravelOrder = segments.reduce((acc, x) => {
    if (x.TravelOrder > acc) {
      return x.TravelOrder;
    }

    return acc;
  }, 0);

  const maxServiceSegmentsTravelOrder = serviceSegments.reduce((acc, x) => {
    if (x.TravelOrder > acc) {
      return x.TravelOrder;
    }

    return acc;
  }, 0);

  const maxOrder = Math.max(maxSegmentsTravelOrder, maxServiceSegmentsTravelOrder);

  const allSegments = [];

  for (let i = 1; i <= maxOrder; i += 1) {
    segments.forEach(s => Number(s.TravelOrder) === i ? allSegments.push(s) : null);
    serviceSegments.forEach(s => Number(s.TravelOrder) === i ? allSegments.push(s) : null);
  }

  const indexedSegments = allSegments.map((s, k) => _extends({}, s, { index: k + 1 }));

  return {
    segments: indexedSegments.filter(s => s.SegmentType === undefined),
    serviceSegments: indexedSegments.filter(s => s.SegmentType === 'Service')
  };
}

module.exports = {
  formatLowFaresSearch: formatLowFaresSearch,
  formatTrip: formatTrip,
  formatSegment: formatSegment,
  formatServiceSegment: formatServiceSegment,
  formatAirExchangeBundle: formatAirExchangeBundle,
  formatPrices: formatPrices,
  setIndexesForSegments: setIndexesForSegments,
  getBaggage: getBaggage
};