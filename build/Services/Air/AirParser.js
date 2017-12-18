'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _utils = require('../../utils');

var _utils2 = _interopRequireDefault(_utils);

var _AirFormat = require('./AirFormat');

var _AirFormat2 = _interopRequireDefault(_AirFormat);

var _AirErrors = require('./AirErrors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const searchLowFaresValidate = obj => {
  // +List, e.g. AirPricePointList, see below
  const rootArrays = ['AirPricePoint', 'AirSegment', 'FareInfo', 'FlightDetails', 'Route'];

  rootArrays.forEach(name => {
    const airName = 'air:' + name + 'List';
    if (!_lodash2.default.isObject(obj[airName])) {
      throw new _AirErrors.AirParsingError.ResponseDataMissing({ missing: airName });
    }
  });

  return obj;
};

const countHistogram = arr => {
  const a = {};
  let prev = null;

  if (!_lodash2.default.isArray(arr)) {
    throw new _AirErrors.AirParsingError.HistogramTypeInvalid();
  }

  if (_lodash2.default.isObject(arr[0])) {
    arr = arr.map(elem => elem.Code);
  }

  arr.sort();
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] !== prev) {
      a[arr[i]] = 1;
    } else {
      a[arr[i]] += 1;
    }
    prev = arr[i];
  }

  return a;
};

function lowFaresSearchRequest(obj) {
  return _AirFormat2.default.formatLowFaresSearch({
    debug: false
  }, searchLowFaresValidate.call(this, obj));
}

const ticketParse = function ticketParse(obj) {
  let checkResponseMessage = false;
  let checkTickets = false;

  if (obj['air:TicketFailureInfo']) {
    var _obj$airTicketFailur = obj['air:TicketFailureInfo'];
    const Message = _obj$airTicketFailur.Message,
          Code = _obj$airTicketFailur.Code;

    if (/VALID\sFORM\sOF\sID\s\sFOID\s\sREQUIRED/.exec(Message)) {
      throw new _AirErrors.AirRuntimeError.TicketingFoidRequired(obj);
    }
    if (Code === '3979') {
      // The Provider reservation is being modified externally. Please Air Ticket later.
      throw new _AirErrors.AirRuntimeError.TicketingPNRBusy(obj);
    }
    throw new _AirErrors.AirRuntimeError.TicketingFailed(obj);
  }

  if (obj[`common_${this.uapi_version}:ResponseMessage`]) {
    const responseMessage = obj[`common_${this.uapi_version}:ResponseMessage`];
    responseMessage.forEach(msg => {
      if (msg._ === 'OK:Ticket issued') {
        checkResponseMessage = true;
      }
    });
  }

  if (checkResponseMessage === false) {
    throw new _AirErrors.AirRuntimeError.TicketingResponseMissing(obj);
  }

  if (obj['air:ETR']) {
    try {
      checkTickets = _lodash2.default.reduce(obj['air:ETR'], (acc, x) => {
        const tickets = _lodash2.default.reduce(x['air:Ticket'], (acc2, t) => !!(acc2 && t.TicketNumber), true);
        return !!(acc && tickets);
      }, true);
    } catch (e) {
      throw new _AirErrors.AirRuntimeError.TicketingTicketsMissing(obj);
    }
  }

  return checkResponseMessage && checkTickets;
};

const nullParsing = obj => obj;

function fillAirFlightInfoResponseItem(data) {
  const item = data['air:FlightInfoDetail'];
  return {
    from: item.Origin || '',
    to: item.Destination || '',
    departure: item.ScheduledDepartureTime || '',
    arrival: item.ScheduledArrivalTime || '',
    duration: item.TravelTime || '',
    plane: item.Equipment || '',
    fromTerminal: item.OriginTerminal || '',
    toTerminal: item.DestinationTerminal || ''
  };
}

function airFlightInfoRsp(obj) {
  const data = this.mergeLeafRecursive(obj, 'air:FlightInformationRsp')['air:FlightInfo'];

  if (typeof data['air:FlightInfoErrorMessage'] !== 'undefined') {
    switch (data['air:FlightInfoErrorMessage']._) {
      case 'Airline not supported':
        throw new _AirErrors.AirFlightInfoRuntimeError.AirlineNotSupported(obj);
      case 'Flight not found':
        throw new _AirErrors.AirFlightInfoRuntimeError.FlightNotFound(obj);
      case 'Invalid Flight Number field':
        throw new _AirErrors.AirFlightInfoRuntimeError.InvalidFlightNumber(obj);
      default:
        throw new _AirErrors.AirFlightInfoRuntimeError(obj);
    }
  }

  if (typeof data.Carrier === 'undefined') {
    const response = [];
    data.forEach(item => {
      response.push(fillAirFlightInfoResponseItem(item));
    });
    return response;
  }

  return fillAirFlightInfoResponseItem(data);
}

/*
 * returns keys of reservations (AirPricingInfos) with their corresponding passenger
 * category types and counts for an AirPricingSolution
 *
 * NOTE: uses non-parsed input
 */
function airPriceRspPassengersPerReservation(obj) {
  const data = this.mergeLeafRecursive(obj, 'air:AirPriceRsp')['air:AirPriceRsp'];

  const priceResult = data['air:AirPriceResult'];
  const prices = priceResult['air:AirPricingSolution'];
  const priceKeys = Object.keys(prices);

  const pricing = prices[_lodash2.default.first(priceKeys)];

  return _lodash2.default.mapValues(pricing['air:AirPricingInfo'], fare => {
    const histogram = countHistogram(fare['air:PassengerType']);
    return histogram;
  });
}

function airPriceRspPricingSolutionXML(obj) {
  // first let's parse a regular structure
  const objCopy = _lodash2.default.cloneDeep(obj);
  const passengersPerReservations = airPriceRspPassengersPerReservation.call(this, objCopy);

  const segments = obj['air:AirPriceRsp'][0]['air:AirItinerary'][0]['air:AirSegment'];
  const priceResult = obj['air:AirPriceRsp'][0]['air:AirPriceResult'][0];
  const pricingSolutions = priceResult['air:AirPricingSolution'];
  let pricingSolution = 0;
  if (pricingSolutions.length > 1) {
    console.log('More than one solution found in booking. Resolving the cheapest one.');
    const sorted = pricingSolutions.sort((a, b) => parseFloat(a.$.TotalPrice.slice(3)) - parseFloat(b.$.TotalPrice.slice(3)));
    pricingSolution = sorted[0];
  } else {
    pricingSolution = pricingSolutions[0];
  }

  // remove segment references and add real segments (required)
  delete pricingSolution['air:AirSegmentRef'];

  pricingSolution['air:AirSegment'] = segments;

  // pricingSolution = moveObjectElement('air:AirSegment', '$', pricingSolution);

  // delete existing air passenger types for each fare (map stored in passengersPerReservations)
  const pricingInfos = pricingSolution['air:AirPricingInfo'].map(info => _lodash2.default.assign({}, info, { 'air:PassengerType': [] }));

  this.env.passengers.forEach((passenger, index) => {
    // find a reservation with places available for this passenger type, decrease counter
    const reservationKey = _lodash2.default.findKey(passengersPerReservations, elem => {
      const item = elem;
      const ageCategory = passenger.ageCategory;
      if (item[ageCategory] > 0) {
        item[ageCategory] -= 1;
        return true;
      }
      return false;
    });

    const pricingInfo = _lodash2.default.find(pricingInfos, info => info.$.Key === reservationKey);

    pricingInfo['air:PassengerType'].push({
      $: {
        BookingTravelerRef: 'P_' + index,
        Code: passenger.ageCategory,
        Age: passenger.Age
      }
    });
  });

  pricingSolution['air:AirPricingInfo'] = pricingInfos;
  const resultXml = {};

  ['air:AirSegment', 'air:AirPricingInfo', 'air:FareNote'].forEach(root => {
    const builder = new _xml2js2.default.Builder({
      headless: true,
      rootName: root
    });

    // workaround because xml2js does not accept arrays to generate multiple "root objects"
    const buildObject = {
      [root]: pricingSolution[root]
    };

    const intResult = builder.buildObject(buildObject);
    // remove root object tags at first and last line
    const lines = intResult.split('\n');
    lines.splice(0, 1);
    lines.splice(-1, 1);

    // return
    resultXml[root + '_XML'] = lines.join('\n');
  });

  return {
    'air:AirPricingSolution': _lodash2.default.clone(pricingSolution.$),
    'air:AirPricingSolution_XML': resultXml
  };
}

const AirErrorHandler = function AirErrorHandler(obj) {
  const errData = obj.detail && obj.detail[`common_${this.uapi_version}:ErrorInfo`] || null;
  // FIXME collapse versions using a regexp search in ParserUapi
  if (errData) {
    switch (errData[`common_${this.uapi_version}:Code`]) {
      case '4454':
        return Promise.reject(new _AirErrors.AirRuntimeError.NoResidualValue(obj));
      case '12009':
        return Promise.reject(new _AirErrors.AirRuntimeError.TicketsNotIssued(obj));
      case '13003':
        return Promise.reject(new _AirErrors.AirRuntimeError.NoReservationToImport(obj));
      case '3003':
        return Promise.reject(new _AirErrors.AirRuntimeError.InvalidRequestData(obj));
      case '2602': // No Solutions in the response.
      case '3037':
        // No availability on chosen flights, unable to fare quote
        return Promise.reject(new _AirErrors.AirRuntimeError.NoResultsFound(obj));
      default:
        return Promise.reject(new _AirErrors.AirRuntimeError(obj)); // TODO replace with custom error
    }
  }
  // FIXME use switch above by merging <air:AvailabilityErrorInfo> into detail by means of parser
  // (requires full coverage of parser by unit tests;
  // then add a separate config group with new merge up functionality)
  // then simply detect <common_v36_0:Code> = 3000
  // see error response in AirCreateReservation.Waitlisted.xml for example
  const segmentErrData = obj.detail && obj.detail['air:AvailabilityErrorInfo'] || null;
  if (segmentErrData) {
    obj.detail = obj.detail['air:AvailabilityErrorInfo']; // Quickfix structure returned in exception
    switch (segmentErrData[`common_${this.uapi_version}:Code`]) {
      case '3000':
        {
          const messages = _lodash2.default.pluck(segmentErrData['air:AirSegmentError'], 'air:ErrorMessage');
          if (messages.indexOf('Booking is not complete due to waitlisted segment') !== -1) {
            return Promise.reject(new _AirErrors.AirRuntimeError.SegmentWaitlisted(obj));
          }
          // else // unknown error, fall back to SegmentBookingFailed
          return Promise.reject(new _AirErrors.AirRuntimeError.SegmentBookingFailed(obj));
        }

      default:
        return Promise.reject(new _AirErrors.AirRuntimeError(obj));
    }
  }
  return Promise.reject(new _AirErrors.AirParsingError(obj));
};

const airGetTicket = function airGetTicket(obj) {
  const failure = obj['air:DocumentFailureInfo'];
  if (failure) {
    if (failure.Code === '3273') {
      throw new _AirErrors.AirRuntimeError.DuplicateTicketFound(obj);
    }
    throw new _AirErrors.AirRuntimeError.TicketRetrieveError(obj);
  }

  const etr = obj['air:ETR'];
  if (!etr) {
    throw new _AirErrors.AirRuntimeError.TicketRetrieveError(obj);
  }
  // Checking if pricing info exists
  if (!etr.ProviderLocatorCode) {
    throw new _AirErrors.AirRuntimeError.TicketInfoIncomplete(etr);
  }

  const tourCode = etr.TourCode;

  const passengersList = etr[`common_${this.uapi_version}:BookingTraveler`];
  const passengers = Object.keys(passengersList).map(passengerKey => ({
    firstName: passengersList[passengerKey][`common_${this.uapi_version}:BookingTravelerName`].First,
    lastName: passengersList[passengerKey][`common_${this.uapi_version}:BookingTravelerName`].Last
  }));

  const airPricingInfo = etr['air:AirPricingInfo'] ? _utils2.default.firstInObj(etr['air:AirPricingInfo']) : null;

  const fareInfo = airPricingInfo && airPricingInfo['air:FareInfo'] ? _utils2.default.firstInObj(airPricingInfo['air:FareInfo']) : null;

  const ticketsList = etr['air:Ticket'];
  const exchangedTickets = [];

  const tickets = Object.keys(ticketsList).map(ticketKey => {
    const ticket = ticketsList[ticketKey];
    if (ticket['air:ExchangedTicketInfo']) {
      ticket['air:ExchangedTicketInfo'].forEach(t => exchangedTickets.push(t.Number));
    }

    const coupons = Object.keys(ticket['air:Coupon']).map(couponKey => {
      const coupon = ticket['air:Coupon'][couponKey];

      let bookingInfo = null;
      // looking for fareInfo by it's fareBasis
      // and for bookingInfo by correct FareInfoRef
      if (airPricingInfo && airPricingInfo['air:FareInfo']) {
        Object.keys(airPricingInfo['air:FareInfo']).forEach(fareKey => {
          const fare = airPricingInfo['air:FareInfo'][fareKey];
          if (fare.FareBasis === coupon.FareBasis && airPricingInfo['air:BookingInfo']) {
            const bInfo = airPricingInfo['air:BookingInfo'].find(info => info.FareInfoRef === fareKey);

            if (bInfo) {
              bookingInfo = bInfo;
            }
          }
        });
      }

      const couponInfo = Object.assign({
        couponNumber: coupon.CouponNumber,
        from: coupon.Origin,
        to: coupon.Destination,
        departure: coupon.DepartureTime,
        airline: coupon.MarketingCarrier,
        flightNumber: coupon.MarketingFlightNumber,
        fareBasisCode: coupon.FareBasis,
        status: coupon.Status,
        notValidBefore: coupon.NotValidBefore,
        notValidAfter: coupon.NotValidAfter,
        bookingClass: coupon.BookingClass,
        stopover: coupon.StopoverCode === 'true'
      }, bookingInfo !== null ? { serviceClass: bookingInfo.CabinClass } : null);

      return couponInfo;
    });

    return {
      ticketNumber: ticket.TicketNumber,
      coupons: coupons
    };
  });

  const taxes = airPricingInfo && airPricingInfo['air:TaxInfo'] ? Object.keys(airPricingInfo['air:TaxInfo']).map(taxKey => Object.assign({
    type: airPricingInfo['air:TaxInfo'][taxKey].Category,
    value: airPricingInfo['air:TaxInfo'][taxKey].Amount
  }, airPricingInfo['air:TaxInfo'][taxKey][`common_${this.uapi_version}:TaxDetail`] ? {
    details: airPricingInfo['air:TaxInfo'][taxKey][`common_${this.uapi_version}:TaxDetail`].map(taxDetail => ({
      airport: taxDetail.OriginAirport,
      value: taxDetail.Amount
    }))
  } : null)) : [];
  const priceSource = airPricingInfo || etr;
  const priceInfoAvailable = priceSource.BasePrice !== undefined;

  const commission = etr && etr[`common_${this.uapi_version}:Commission`] || fareInfo && fareInfo[`common_${this.uapi_version}:Commission`] || null;

  const fareCalculation = etr['air:FareCalc'].match(/^([\s\S]+END)($|\s)/)[1];
  const roe = etr['air:FareCalc'].match(/ROE((?:\d+\.)?\d+)/);

  const response = Object.assign({
    uapi_ur_locator: obj.UniversalRecordLocatorCode,
    uapi_reservation_locator: etr['air:AirReservationLocatorCode'],
    pnr: etr.ProviderLocatorCode,
    ticketNumber: tickets[0].ticketNumber,
    platingCarrier: etr.PlatingCarrier,
    ticketingPcc: etr.PseudoCityCode,
    issuedAt: etr.IssuedDate,
    farePricingMethod: airPricingInfo ? airPricingInfo.PricingMethod : null,
    farePricingType: airPricingInfo ? airPricingInfo.PricingType : null,
    fareCalculation: fareCalculation,
    priceInfoAvailable: priceInfoAvailable,
    priceInfoDetailsAvailable: airPricingInfo !== null,
    taxes: priceSource.Taxes,
    taxesInfo: taxes,
    passengers: passengers,
    tickets: tickets,
    // Flags
    noAdc: !etr.TotalPrice,
    isConjunctionTicket: tickets.length > 1,
    tourCode: tourCode
  }, roe ? { roe: roe[1] } : null, commission ? {
    commission: {
      [commission.Type === 'PercentBase' ? 'percent' : 'amount']: commission.Type === 'PercentBase' ? parseFloat(commission.Percentage) : parseFloat(commission.Amount.slice(3))
    }
  } : null, priceInfoAvailable ? {
    totalPrice: priceSource.TotalPrice || `${(priceSource.EquivalentBasePrice || priceSource.BasePrice).slice(0, 3)}0`,
    basePrice: priceSource.BasePrice,
    equivalentBasePrice: priceSource.EquivalentBasePrice
  } : null, exchangedTickets.length > 0 ? { exchangedTickets: exchangedTickets } : null);

  return response;
};

function airCancelTicket(obj) {
  if (!obj['air:VoidResultInfo'] || obj['air:VoidResultInfo'].ResultType !== 'Success') {
    throw new _AirErrors.AirRuntimeError.TicketCancelResultUnknown(obj);
  }
  return true;
}

function airCancelPnr(obj) {
  const messages = obj[`common_${this.uapi_version}:ResponseMessage`] || [];
  if (messages.some(message => message._ === 'Itinerary Cancelled')) {
    return true;
  }
  throw new _AirErrors.AirParsingError.CancelResponseNotFound();
}

function extractBookings(obj) {
  const record = obj['universal:UniversalRecord'];
  const messages = obj[`common_${this.uapi_version}:ResponseMessage`] || [];

  messages.forEach(message => {
    if (/NO VALID FARE FOR INPUT CRITERIA/.exec(message._)) {
      throw new _AirErrors.AirRuntimeError.NoValidFare(obj);
    }
  });

  if (!record['air:AirReservation'] || record['air:AirReservation'].length === 0) {
    throw new _AirErrors.AirParsingError.ReservationsMissing();
  }

  if (obj['air:AirSegmentSellFailureInfo']) {
    throw new _AirErrors.AirRuntimeError.SegmentBookingFailed(obj);
  }

  const travelers = record['common_' + this.uapi_version + ':BookingTraveler'];
  const reservationInfo = record['universal:ProviderReservationInfo'];
  const remarksObj = record[`common_${this.uapi_version}:GeneralRemark`];
  const remarks = remarksObj ? Object.keys(remarksObj).reduce((acc, key) => {
    const reservationRef = remarksObj[key].ProviderReservationInfoRef;
    return Object.assign(acc, {
      [reservationRef]: (acc[reservationRef] || []).concat(remarksObj[key])
    });
  }, {}) : {};

  return record['air:AirReservation'].map(booking => {
    const resKey = `common_${this.uapi_version}:ProviderReservationInfoRef`;
    const providerInfo = reservationInfo[booking[resKey]];
    const ticketingModifiers = booking['air:TicketingModifiers'];
    const emails = [];
    const providerInfoKey = providerInfo.Key;
    const resRemarks = remarks[providerInfoKey] || [];
    const splitBookings = providerInfo['universal:ProviderReservationDetails'] && providerInfo['universal:ProviderReservationDetails'].DivideDetails === 'true' ? resRemarks.reduce((acc, remark) => {
      const splitMatch = remark['common_v36_0:RemarkData'].match(/^SPLIT\s.*([A-Z0-9]{6})$/);
      if (!splitMatch) {
        return acc;
      }
      return acc.concat(splitMatch[1]);
    }, []) : [];

    const passiveReservation = record['passive:PassiveReservation'] ? record['passive:PassiveReservation'].find(res => res.ProviderReservationInfoRef === providerInfoKey) : null;

    if (!providerInfo) {
      throw new _AirErrors.AirParsingError.ReservationProviderInfoMissing();
    }

    const passengers = booking[`common_${this.uapi_version}:BookingTravelerRef`].map(travellerRef => {
      const traveler = travelers[travellerRef];
      if (!traveler) {
        throw new _AirErrors.AirRuntimeError.TravelersListError();
      }
      const name = traveler[`common_${this.uapi_version}:BookingTravelerName`];
      const travelerEmails = traveler[`common_${this.uapi_version}:Email`];
      if (travelerEmails) {
        Object.keys(travelerEmails).forEach(i => {
          const email = travelerEmails[i];
          if (email[`common_${this.uapi_version}:ProviderReservationInfoRef`]) {
            emails.push({
              index: emails.length + 1,
              email: email.EmailID.toLowerCase()
            });
          }
        });
      }

      return Object.assign({
        lastName: name.Last,
        firstName: name.First,
        uapi_passenger_ref: traveler.Key
      }, traveler.DOB ? {
        birthDate: (0, _moment2.default)(traveler.DOB).format('YYYY-MM-DD')
      } : null, traveler.TravelerType ? {
        ageCategory: traveler.TravelerType
      } : null, traveler.Gender ? {
        gender: traveler.Gender
      } : null);
    });

    var _format$setIndexesFor = _AirFormat2.default.setIndexesForSegments(booking['air:AirSegment'] || null, passiveReservation && passiveReservation['passive:PassiveSegment'] || null);

    const indexedSegments = _format$setIndexesFor.segments,
          indexedServiceSegments = _format$setIndexesFor.serviceSegments;


    const supplierLocator = booking[`common_${this.uapi_version}:SupplierLocator`] || [];
    const segments = indexedSegments ? indexedSegments.map(segment => _extends({}, _AirFormat2.default.formatTrip(segment, segment['air:FlightDetails']), {
      index: segment.index,
      status: segment.Status,
      serviceClass: segment.CabinClass,
      bookingClass: segment.ClassOfService
    })) : [];

    const serviceSegments = indexedServiceSegments ? indexedServiceSegments.map(s => {
      const remark = passiveReservation['passive:PassiveRemark'].find(r => r.PassiveSegmentRef === s.Key);
      return _AirFormat2.default.formatServiceSegment(s, remark);
    }) : [];

    const fareQuotesCommon = {};
    const tickets = booking['air:DocumentInfo'] && booking['air:DocumentInfo']['air:TicketInfo'] ? booking['air:DocumentInfo']['air:TicketInfo'].map(ticket => ({
      number: ticket.Number,
      uapi_passenger_ref: ticket.BookingTravelerRef,
      uapi_pricing_info_ref: ticket.AirPricingInfoRef ? ticket.AirPricingInfoRef : null
    })) : [];

    const pricingInfos = !booking['air:AirPricingInfo'] ? [] : Object.keys(booking['air:AirPricingInfo']).map(key => {
      const pricingInfo = booking['air:AirPricingInfo'][key];

      const uapiSegmentRefs = pricingInfo['air:BookingInfo'].map(segment => segment.SegmentRef);

      const uapiPassengerRefs = pricingInfo[`common_${this.uapi_version}:BookingTravelerRef`];

      const fareInfo = pricingInfo['air:FareInfo'];

      const baggage = Object.keys(fareInfo).map(fareLegKey => _AirFormat2.default.getBaggage(fareInfo[fareLegKey]['air:BaggageAllowance']));

      const passengersCount = pricingInfo['air:PassengerType'].reduce((acc, data) => Object.assign(acc, {
        [data.Code]: (acc[data.Code] || 0) + 1
      }), {});

      const taxesInfo = pricingInfo['air:TaxInfo'] ? Object.keys(pricingInfo['air:TaxInfo']).map(taxKey => Object.assign({
        value: pricingInfo['air:TaxInfo'][taxKey].Amount,
        type: pricingInfo['air:TaxInfo'][taxKey].Category
      }, pricingInfo['air:TaxInfo'][taxKey][`common_${this.uapi_version}:TaxDetail`] ? {
        details: pricingInfo['air:TaxInfo'][taxKey][`common_${this.uapi_version}:TaxDetail`].map(taxDetail => ({
          airport: taxDetail.OriginAirport,
          value: taxDetail.Amount
        }))
      } : null)) : [];

      const modifierKey = pricingInfo['air:TicketingModifiersRef'] ? Object.keys(pricingInfo['air:TicketingModifiersRef'])[0] : null;

      const modifiers = modifierKey && ticketingModifiers[modifierKey];

      const platingCarrier = modifiers ? modifiers.PlatingCarrier : null;

      const firstFareInfo = _utils2.default.firstInObj(fareInfo);

      const tourCode = firstFareInfo.TourCode || null;

      const endorsement = firstFareInfo[`common_${this.uapi_version}:Endorsement`] ? firstFareInfo[`common_${this.uapi_version}:Endorsement`].map(end => end.Value).join(' ') : null;

      fareQuotesCommon[pricingInfo.AirPricingInfoGroup] = Object.assign({
        uapi_segment_refs: uapiSegmentRefs,
        effectiveDate: firstFareInfo.EffectiveDate,
        status: pricingInfo.Ticketed ? 'Ticketed' : 'Reserved',
        endorsement: endorsement,
        tourCode: tourCode
      }, platingCarrier ? { platingCarrier: platingCarrier } : null);

      const pricingInfoPassengers = uapiPassengerRefs.map(ref => {
        const ticket = tickets.find(t => t.uapi_passenger_ref === ref && t.uapi_pricing_info_ref === key);
        return Object.assign({
          uapi_passenger_ref: ref,
          isTicketed: !!ticket
        }, ticket ? { ticketNumber: ticket.number } : null);
      });

      const fareCalculation = pricingInfo['air:FareCalc'].match(/^([\s\S]+END)($|\s)/)[1];
      const roe = pricingInfo['air:FareCalc'].match(/ROE((?:\d+\.)?\d+)/);

      return Object.assign({
        uapi_pricing_info_ref: key,
        passengers: pricingInfoPassengers,
        uapi_pricing_info_group: pricingInfo.AirPricingInfoGroup,
        fareCalculation: fareCalculation,
        farePricingMethod: pricingInfo.PricingMethod,
        farePricingType: pricingInfo.PricingType,
        totalPrice: pricingInfo.TotalPrice,
        basePrice: pricingInfo.BasePrice,
        equivalentBasePrice: pricingInfo.EquivalentBasePrice,
        taxes: pricingInfo.Taxes,
        passengersCount: passengersCount,
        taxesInfo: taxesInfo,
        baggage: baggage,
        timeToReprice: pricingInfo.LatestTicketingTime
      }, roe ? { roe: roe[1] } : null);
    });

    const fareQuotesGrouped = pricingInfos.reduce((acc, pricingInfo) => Object.assign(acc, {
      [pricingInfo.uapi_pricing_info_group]: (acc[pricingInfo.uapi_pricing_info_group] || []).concat(pricingInfo)
    }), {});

    const fareQuotes = Object.keys(fareQuotesGrouped).map(key => {
      const fqGroup = fareQuotesGrouped[key];
      const fqGroupPassengers = fqGroup.reduce((acc, fq) => acc.concat(fq.passengers.map(p => p.uapi_passenger_ref)), []);

      return _extends({
        pricingInfos: fqGroup,
        uapi_passenger_refs: fqGroupPassengers
      }, fareQuotesCommon[key]);
    }).sort((fq1, fq2) => (0, _moment2.default)(fq1.effectiveDate) - (0, _moment2.default)(fq2.effectiveDate)).map((fq, index) => _extends({}, fq, { index: index + 1 }));

    return Object.assign({
      type: 'uAPI',
      pnr: providerInfo.LocatorCode,
      version: record.Version,
      uapi_ur_locator: record.LocatorCode,
      uapi_reservation_locator: booking.LocatorCode,
      airlineLocatorInfo: supplierLocator.map(info => ({
        createDate: info.CreateDateTime,
        supplierCode: info.SupplierCode,
        locatorCode: info.SupplierLocatorCode
      })),
      createdAt: providerInfo.CreateDate,
      hostCreatedAt: providerInfo.HostCreateDate,
      modifiedAt: providerInfo.ModifiedDate,
      fareQuotes: fareQuotes,
      segments: segments,
      serviceSegments: serviceSegments,
      passengers: passengers,
      emails: emails,
      bookingPCC: providerInfo.OwningPCC,
      tickets: tickets
    }, splitBookings.length > 0 ? { splitBookings: splitBookings } : null);
  });
}

function importRequest(data) {
  const response = extractBookings.call(this, data);
  return response;
}

function extractFareRules(obj) {
  const rulesList = obj['air:FareRule'];
  rulesList.forEach(item => {
    const result = [];
    const listName = item['air:FareRuleLong'] ? 'air:FareRuleLong' : 'air:FareRuleShort';
    item[listName].forEach(rule => {
      const ruleCategoryNumber = parseInt(rule.Category, 10);
      if (rule['air:FareRuleNameValue']) {
        // for short rules
        result[ruleCategoryNumber] = rule['air:FareRuleNameValue'];
      } else {
        // for long rules
        result[ruleCategoryNumber] = rule._;
      }
    });

    delete item[listName];
    delete item.FareInfoRef;
    item.Rules = result;
  });

  return rulesList;
}

function airPriceFareRules(data) {
  return extractFareRules(data['air:AirPriceResult']);
}

function gdsQueue(req) {
  // TODO implement all major error cases
  // https://support.travelport.com/webhelp/uapi/uAPI.htm#Error_Codes/QUESVC_Service_Error_Codes.htm%3FTocPath%3DError%2520Codes%2520and%2520Messages|_____9
  // like 7015 "Branch does not have Queueing configured"

  let data = null;
  try {
    data = req['common_v36_0:ResponseMessage'][0];
  } catch (e) {
    throw new _AirErrors.GdsRuntimeError.PlacingInQueueError(req);
  }

  // TODO check if there can be several messages
  const message = data._;
  if (message.match(/^Booking successfully placed/) === null) {
    throw new _AirErrors.GdsRuntimeError.PlacingInQueueMessageMissing(message);
  }

  return true;
}

function exchangeQuote(req) {
  const root = 'air:AirExchangeQuoteRsp';
  const xml = req[root][0];
  const tokenRoot = `common_${this.uapi_version}:HostToken`;

  const token = {
    'air:AirExchangeBundle': xml['air:AirExchangeBundle'],
    'air:AirPricingSolution': xml['air:AirPricingSolution'],
    [tokenRoot]: xml[tokenRoot]
  };

  return _utils2.default.deflate(JSON.stringify(token)).then(zippedToken => {
    const json = this.mergeLeafRecursive(req, root)['air:AirExchangeQuoteRsp'];

    const exchangeInfoRoot = `common_${this.uapi_version}:AirExchangeInfo`;

    const exchangeBundleTotal = json['air:AirExchangeBundleTotal'];
    const totalBundle = exchangeBundleTotal && exchangeBundleTotal[exchangeInfoRoot];

    const exchangeDetails = json['air:AirExchangeBundle'].map(bundle => {
      const exchange = bundle[exchangeInfoRoot];
      const taxes = exchange[`common_${this.uapi_version}:PaidTax`].map(tax => ({ type: tax.Code, value: tax.Amount }));

      return _extends({}, _AirFormat2.default.formatAirExchangeBundle(exchange), {
        taxes: taxes,
        uapi_pricing_info_ref: Object.keys(bundle['air:AirPricingInfoRef'])[0]
      });
    });

    const solution = _utils2.default.firstInObj(json['air:AirPricingSolution']);
    const segments = Object.keys(solution['air:AirSegment']).map(key => {
      const segment = solution['air:AirSegment'][key];
      return _extends({}, _AirFormat2.default.formatSegment(segment), {
        serviceClass: segment.CabinClass,
        bookingClass: segment.ClassOfService
      });
    });

    const pricingInfo = Object.keys(solution['air:AirPricingInfo']).map(key => {
      const pricing = solution['air:AirPricingInfo'][key];

      const bookingInfo = Object.keys(pricing['air:BookingInfo']).map(bookingInfoKey => {
        const info = pricing['air:BookingInfo'][bookingInfoKey];
        const fare = pricing['air:FareInfo'][info.FareInfoRef];

        return {
          bookingCode: info.BookingCode,
          cabinClass: info.CabinClass,
          baggage: _AirFormat2.default.getBaggage(fare['air:BaggageAllowance']),
          fareBasis: fare.FareBasis,
          from: fare.Origin,
          to: fare.Destination,
          uapi_segment_ref: info.SegmentRef
        };
      });

      return _extends({}, _AirFormat2.default.formatPrices(pricing), {
        bookingInfo: bookingInfo,
        uapi_pricing_info_ref: pricing.Key,
        fareCalculation: pricing['air:FareCalc']
      });
    });

    const airPricingDetails = solution['air:PricingDetails'];

    return {
      exchangeToken: zippedToken,
      exchangeDetails: exchangeDetails,
      segments: segments,
      pricingInfo: pricingInfo,
      pricingDetails: {
        pricingType: airPricingDetails.PricingType,
        lowFareFound: airPricingDetails.LowFareFound === 'true',
        lowFarePricing: airPricingDetails.LowFarePricing === 'true',
        discountApplies: airPricingDetails.DiscountApplies === 'true',
        penaltyApplies: airPricingDetails.DiscountApplies === 'true',
        conversionRate: parseFloat(airPricingDetails.ConversionRate || 1),
        rateOfExchange: parseFloat(airPricingDetails.RateOfExchange || 1),
        validatingVendor: airPricingDetails.ValidatingVendorCode
      },
      pricingSolution: _AirFormat2.default.formatPrices(solution),
      exchangeTotal: _extends({}, _AirFormat2.default.formatAirExchangeBundle(totalBundle), {
        pricingTag: totalBundle.PricingTag
      })
    };
  });
}

function exchangeBooking(rsp) {
  if (rsp['air:AirReservation']) {
    return true;
  }
  throw new _AirErrors.AirRuntimeError.CantDetectExchangeReponse(rsp);
}

module.exports = {
  AIR_LOW_FARE_SEARCH_REQUEST: lowFaresSearchRequest,
  AIR_PRICE_REQUEST_PRICING_SOLUTION_XML: airPriceRspPricingSolutionXML,
  AIR_PRICE_FARE_RULES_REQUEST: airPriceFareRules,
  AIR_CREATE_RESERVATION_REQUEST: extractBookings,
  AIR_TICKET_REQUEST: ticketParse,
  AIR_IMPORT_REQUEST: importRequest,
  GDS_QUEUE_PLACE_RESPONSE: gdsQueue,
  AIR_CANCEL_UR: nullParsing,
  UNIVERSAL_RECORD_FOID: nullParsing,
  AIR_ERRORS: AirErrorHandler, // errors handling
  AIR_FLIGHT_INFORMATION: airFlightInfoRsp,
  AIR_GET_TICKET: airGetTicket,
  AIR_CANCEL_TICKET: airCancelTicket,
  AIR_CANCEL_PNR: airCancelPnr,
  AIR_EXCHANGE_QUOTE: exchangeQuote,
  AIR_EXCHANGE: exchangeBooking
};