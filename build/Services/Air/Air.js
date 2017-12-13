'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _promiseRetry = require('promise-retry');

var _promiseRetry2 = _interopRequireDefault(_promiseRetry);

var _utils = require('../../utils');

var _getBookingFromUr = require('../../utils/get-booking-from-ur');

var _getBookingFromUr2 = _interopRequireDefault(_getBookingFromUr);

var _AirService = require('./AirService');

var _AirService2 = _interopRequireDefault(_AirService);

var _Terminal = require('../Terminal/Terminal');

var _Terminal2 = _interopRequireDefault(_Terminal);

var _AirErrors = require('./AirErrors');

var _validateServiceSettings = require('../../utils/validate-service-settings');

var _validateServiceSettings2 = _interopRequireDefault(_validateServiceSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = settings => {
  const service = (0, _AirService2.default)((0, _validateServiceSettings2.default)(settings));
  const log = settings.options && settings.options.logFunction || console.log;
  return {
    shop: function shop(options, configOptions) {
      return service.searchLowFares(options, configOptions);
    },
    fareRules: function fareRules(options, configOptions) {
      // add request for fare rules
      const request = Object.assign(options, {
        fetchFareRules: true
      });
      return service.lookupFareRules(request, configOptions);
    },
    toQueue: function toQueue(options, configOptions) {
      return service.gdsQueue(options, configOptions);
    },
    book: function book(options, configOptions) {
      return service.airPricePricingSolutionXML(options).then(data => {
        const bookingParams = Object.assign({}, {
          ticketDate: (0, _moment2.default)().add(3, 'hours').format(),
          ActionStatusType: 'TAU'
        }, data, options);
        return service.createReservation(bookingParams, configOptions).catch(err => {
          if (err instanceof _AirErrors.AirRuntimeError.SegmentBookingFailed || err instanceof _AirErrors.AirRuntimeError.NoValidFare) {
            if (options.allowWaitlist) {
              // will not have a UR if waitlisting restricted
              const code = err.data['universal:UniversalRecord'].LocatorCode;
              return service.cancelUR({
                LocatorCode: code
              }).then(() => Promise.reject(err));
            }
            return Promise.reject(err);
          }
          return Promise.reject(err);
        });
      });
    },
    getPNR: function getPNR(options) {
      return this.getUniversalRecordByPNR(options).then(ur => (0, _getBookingFromUr2.default)(ur, options.pnr) || Promise.reject(new _AirErrors.AirRuntimeError.NoPNRFoundInUR(ur)));
    },
    importPNR: function importPNR(options) {
      return this.getPNR(options).then(response => [response]);
    },
    getUniversalRecordByPNR: function getUniversalRecordByPNR(options) {
      return service.getUniversalRecordByPNR(options).catch(err => {
        // Checking for error type
        if (!(err instanceof _AirErrors.AirRuntimeError.NoReservationToImport)) {
          return Promise.reject(err);
        }
        // Creating passive segment to import PNR
        const terminal = (0, _Terminal2.default)(settings);
        const segment = {
          date: (0, _moment2.default)().add(42, 'days').format('DDMMM'),
          airline: 'OK',
          from: 'DOH',
          to: 'ODM',
          comment: 'NO1',
          class: 'Y'
        };
        const segmentCommand = `0${segment.airline}OPEN${segment.class}${segment.date}${segment.from}${segment.to}${segment.comment}`.toUpperCase();
        const segmentResult = `1. ${segment.airline} OPEN ${segment.class}  ${segment.date} ${segment.from}${segment.to} ${segment.comment}`.toUpperCase();
        const pnrRegExp = new RegExp(`^(?:\\*\\* THIS BF IS CURRENTLY IN USE \\*\\*\\s*)?${options.pnr}`);
        return terminal.executeCommand(`*${options.pnr}`).then(response => {
          if (!response.match(pnrRegExp)) {
            return Promise.reject(new _AirErrors.AirRuntimeError.UnableToOpenPNRInTerminal());
          }
          return Promise.resolve();
        }).then(() => terminal.executeCommand(segmentCommand)).then(response => {
          if (response.indexOf(segmentResult) === -1) {
            return Promise.reject(new _AirErrors.AirRuntimeError.UnableToAddExtraSegment());
          }
          return Promise.resolve();
        }).then(() => {
          const ticketingDate = (0, _moment2.default)().add(10, 'days').format('DDMMM');
          const command = `T.TAU/${ticketingDate}`;
          return terminal.executeCommand(command).then(() => terminal.executeCommand('R.UAPI+ER')).then(() => terminal.executeCommand('ER'));
        }).then(response => {
          if (!response.match(pnrRegExp) || response.indexOf(segmentResult) === -1) {
            return Promise.reject(new _AirErrors.AirRuntimeError.UnableToSaveBookingWithExtraSegment());
          }
          return Promise.resolve();
        }).catch(importErr => terminal.closeSession().then(() => Promise.reject(new _AirErrors.AirRuntimeError.UnableToImportPnr(options, importErr)))).then(() => terminal.closeSession()).then(() => service.getUniversalRecordByPNR(options)).then(ur => service.cancelPNR((0, _getBookingFromUr2.default)(ur, options.pnr))).then(() => service.getUniversalRecordByPNR(options));
      });
    },
    ticket: function ticket(options) {
      return (options.ReservationLocator ? Promise.resolve(options.ReservationLocator) : this.getPNR(options).then(booking => booking.uapi_reservation_locator)).then(ReservationLocator => (0, _promiseRetry2.default)({ retries: 3 }, (again, number) => {
        if (settings.debug && number > 1) {
          log(`ticket ${options.pnr} issue attempt number ${number}`);
        }
        return service.ticket(_extends({}, options, {
          ReservationLocator: ReservationLocator
        })).catch(err => {
          if (err instanceof _AirErrors.AirRuntimeError.TicketingFoidRequired) {
            return this.getPNR(options).then(updatedBooking => service.foid(updatedBooking)).then(() => again(err));
          }
          if (err instanceof _AirErrors.AirRuntimeError.TicketingPNRBusy) {
            return again(err);
          }
          return Promise.reject(err);
        });
      }));
    },
    flightInfo: function flightInfo(options) {
      const parameters = {
        flightInfoCriteria: _lodash2.default.isArray(options) ? options : [options]
      };
      return service.flightInfo(parameters);
    },
    getTicket: function getTicket(options) {
      return service.getTicket(options).catch(err => {
        if (!(err instanceof _AirErrors.AirRuntimeError.TicketInfoIncomplete) && !(err instanceof _AirErrors.AirRuntimeError.DuplicateTicketFound)) {
          return Promise.reject(err);
        }
        return this.getPNRByTicketNumber({
          ticketNumber: options.ticketNumber
        }).then(pnr => this.getPNR({ pnr: pnr })).then(booking => service.getTicket(_extends({}, options, {
          pnr: booking.pnr,
          uapi_ur_locator: booking.uapi_ur_locator
        })));
      });
    },
    getPNRByTicketNumber: function getPNRByTicketNumber(options) {
      const terminal = (0, _Terminal2.default)(settings);
      return terminal.executeCommand(`*TE/${options.ticketNumber}`).then(response => terminal.closeSession().then(() => response.match(/RLOC [^\s]{2} ([^\s]{6})/)[1]).catch(() => Promise.reject(new _AirErrors.AirRuntimeError.PnrParseError(response)))).catch(err => Promise.reject(new _AirErrors.AirRuntimeError.GetPnrError(options, err)));
    },
    getTickets: function getTickets(options) {
      return this.getPNR(options).then(booking => Promise.all(booking.tickets.map(ticket => this.getTicket({
        pnr: booking.pnr,
        uapi_ur_locator: booking.uapi_ur_locator,
        ticketNumber: ticket.number
      })))).catch(err => Promise.reject(new _AirErrors.AirRuntimeError.UnableToRetrieveTickets(options, err)));
    },
    searchBookingsByPassengerName: function searchBookingsByPassengerName(options) {
      const terminal = (0, _Terminal2.default)(settings);
      return terminal.executeCommand(`*-${options.searchPhrase}`).then(firstScreen => {
        const list = _utils.parsers.searchPassengersList(firstScreen);
        if (list) {
          return Promise.all(list.map(line => {
            const localTerminal = (0, _Terminal2.default)(settings);
            return localTerminal.executeCommand(`*-${options.searchPhrase}`).then(firstScreenAgain => {
              if (firstScreenAgain !== firstScreen) {
                return Promise.reject(new _AirErrors.AirRuntimeError.RequestInconsistency({
                  firstScreen: firstScreen,
                  firstScreenAgain: firstScreenAgain
                }));
              }

              return localTerminal.executeCommand(`*${line.id}`);
            }).then(_utils.parsers.bookingPnr).then(pnr => localTerminal.closeSession().then(() => _extends({}, line, { pnr: pnr })));
          })).then(data => ({ type: 'list', data: data }));
        }

        const pnr = _utils.parsers.bookingPnr(firstScreen);
        if (pnr) {
          return {
            type: 'pnr',
            data: pnr
          };
        }

        return Promise.reject(new _AirErrors.AirRuntimeError.MissingPaxListAndBooking(firstScreen));
      }).then(results => terminal.closeSession().then(() => results).catch(() => results));
    },
    cancelTicket: function cancelTicket(options) {
      return this.getTicket(options).then(ticketData => service.cancelTicket({
        pnr: ticketData.pnr,
        ticketNumber: options.ticketNumber
      })).catch(err => Promise.reject(new _AirErrors.AirRuntimeError.FailedToCancelTicket(options, err)));
    },
    cancelPNR: function cancelPNR(options) {
      return this.getTickets(options).then(tickets => Promise.all(tickets.map(ticketData => {
        // Check for VOID
        const allTicketsVoid = ticketData.tickets.every(ticket => ticket.coupons.every(coupon => coupon.status === 'V'));
        if (allTicketsVoid) {
          return Promise.resolve(true);
        }
        // Check for cancelTicket option
        if (options.cancelTickets !== true) {
          return Promise.reject(new _AirErrors.AirRuntimeError.PNRHasOpenTickets());
        }
        // Check for not OPEN/VOID segments
        const hasNotOpenSegment = ticketData.tickets.some(ticket => ticket.coupons.some(coupon => 'OV'.indexOf(coupon.status) === -1));
        if (hasNotOpenSegment) {
          return Promise.reject(new _AirErrors.AirRuntimeError.UnableToCancelTicketStatusNotOpen());
        }
        return Promise.all(ticketData.tickets.map(ticket => ticket.coupons[0].status !== 'V' ? service.cancelTicket({
          pnr: options.pnr,
          ticketNumber: ticket.ticketNumber
        }) : Promise.resolve(true)));
      }))).then(() => this.getPNR(options)).then(booking => service.cancelPNR(booking)).catch(err => Promise.reject(new _AirErrors.AirRuntimeError.FailedToCancelPnr(options, err)));
    },
    getExchangeInformation: function getExchangeInformation(options) {
      return this.getPNR(options).then(booking => service.exchangeQuote(_extends({}, options, {
        bookingDate: (0, _moment2.default)(booking.createdAt).format('YYYY-MM-DD')
      })));
    },
    exchangeBooking: function exchangeBooking(options) {
      return this.getPNR(options).then(booking => service.exchangeBooking(_extends({}, options, {
        uapi_reservation_locator: booking.uapi_reservation_locator
      })));
    }
  };
};