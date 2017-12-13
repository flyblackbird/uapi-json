'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GdsRuntimeError = exports.AirFlightInfoRuntimeError = exports.AirRuntimeError = exports.AirParsingError = exports.AirFlightInfoValidationError = exports.GdsValidationError = exports.AirValidationError = undefined;

var _nodeErrorsHelpers = require('node-errors-helpers');

var _errorTypes = require('../../error-types');

var _errorTypes2 = _interopRequireDefault(_errorTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Validation errors
const AirValidationError = exports.AirValidationError = (0, _nodeErrorsHelpers.createErrorClass)('AirValidationError', 'Air service validation error', _errorTypes2.default.ValidationError);
Object.assign(AirValidationError, (0, _nodeErrorsHelpers.createErrorsList)({
  ParamsMissing: 'Params are missing',
  ParamsInvalidType: 'Params should be passed as object',
  PassengersHashMissing: 'Passengers hash of passenger types is missing',
  PassengersCategoryInvalid: 'Passengers hash contains invalid passenger',
  PassengersCountInvalid: 'Passengers category has wrong passegners number',
  LegsMissing: 'Missing legs in request',
  LegsInvalidType: 'Invalid type for legs in request',
  LegsInvalidStructure: 'Leg in leg array foes not all required fields',
  AirPricingSolutionInvalidType: 'air:AirPricingSolution array is expected',
  SegmentsMissing: 'Segments missing in request. See data.',
  BirthDateInvalid: 'Invalid birth date',
  FopMissing: 'Form of payment missing',
  FopTypeUnsupported: 'Form of payment type is unsupported',
  TicketNumberMissing: 'Ticket number missing',
  TicketNumberInvalid: 'Ticket number invalid',
  IncorrectEmail: 'Email is in incorrect format',
  PhoneMissing: 'Missing phone in book request',
  IncorrectPhoneFormat: 'Incorrect phone format. Missing required fields. See data.',
  DeliveryInformation: 'Missing of delivery information fields. See data.',
  ReservationLocator: 'Missing uapi_reservation_locator in request. See data.',
  ExchangeToken: 'Missing exchangeToken in request. See data.',
  CreditCardMissing: 'Missing creditCard in request. See data.'
}, AirValidationError));

const GdsValidationError = exports.GdsValidationError = (0, _nodeErrorsHelpers.createErrorClass)('GdsValidationError', 'Gds service validation error', _errorTypes2.default.ValidationError);
Object.assign(GdsValidationError, (0, _nodeErrorsHelpers.createErrorsList)({
  PnrMissing: 'PNR is missing in request',
  QueueMissing: 'Queue is missing in request',
  PccMissing: 'Pcc is missing in request'
}, GdsValidationError));

const AirFlightInfoValidationError = exports.AirFlightInfoValidationError = (0, _nodeErrorsHelpers.createErrorClass)('AirFlightInfoValidationError', 'Air FlightInfo service validation error', _errorTypes2.default.ValidationError);
Object.assign(AirFlightInfoValidationError, (0, _nodeErrorsHelpers.createErrorsList)({
  AirlineMissing: 'Airline is missing in request',
  FlightNumberMissing: 'Flight number is missing in request',
  DepartureMissing: 'Departure is missing in request'
}, AirFlightInfoValidationError));

// Parsing errors
const AirParsingError = exports.AirParsingError = (0, _nodeErrorsHelpers.createErrorClass)('AirParsingError', 'Air service parsing error', _errorTypes2.default.ParsingError);
Object.assign(AirParsingError, (0, _nodeErrorsHelpers.createErrorsList)({
  ResponseDataMissing: 'One of main data arrays is missing in parsed XML response',
  ReservationsMissing: 'Reservations missing in response',
  BookingInfoError: 'air:BookingInfo should be an array',
  PlatingCarriersError: 'Plating carriers do not coincide across all passenger reservations',
  PTCIsNotSet: 'Code is not set for PassengerTypeCode item',
  PTCTypeInvalid: 'PassengerTypeCode is supposed to be a string or array of PassengerTypeCode items',
  HistogramTypeInvalid: 'PassengerType is supposed to be an array',
  MultiplePricingSolutionsNotAllowed: 'Expected only one pricing solution, need to clarify search?',
  PricingSolutionNotFound: 'Pricing solution not found',
  ReservationProviderInfoMissing: 'Can\'t find provider information about reservation',
  CancelResponseNotFound: 'Cancel response not found'
}, AirParsingError));

// Runtime errors
const AirRuntimeError = exports.AirRuntimeError = (0, _nodeErrorsHelpers.createErrorClass)('AirRuntimeError', 'Air service runtime error', _errorTypes2.default.RuntimeError);
Object.assign(AirRuntimeError, (0, _nodeErrorsHelpers.createErrorsList)({
  SegmentBookingFailed: 'Failed to book on or more segments',
  SegmentWaitlisted: 'One or more segments is waitlisted, not allowed',
  TicketingFailed: 'Ticketing failed',
  TicketingFoidRequired: 'FOID required for the PC selected',
  TicketingPNRBusy: 'Reservation is being modified, unable to ticket now',
  TicketingResponseMissing: 'Response message text doesn\'t contain OK:Ticket issued',
  TicketingTicketsMissing: 'Tickets not found in ticketing response',
  NoResultsFound: 'No results found',
  InvalidRequestData: 'Request data is invalid',
  NoValidFare: 'No valid fare for input criteria.',
  TravelersListError: 'Not all BookingTravelers present in list or wrong lookup keys provided',
  PnrParseError: 'Failed to parse PNR from ticket information request response',
  GetPnrError: 'Failed to obtain PNR from ticket information',
  UnableToRetrieveTickets: 'Unable to retrieve tickets list',
  TicketRetrieveError: 'Unable to retrieve ticket',
  TicketInfoIncomplete: 'Ticket information is incomplete',
  RequestInconsistency: 'Request faced race condition. Please retry again',
  MissingPaxListAndBooking: 'Cant find anything for your request. List and booking are missing',
  TicketCancelResultUnknown: 'Ticket cancel result is unknown',
  FailedToCancelPnr: 'Failed to cancel PNR',
  FailedToCancelTicket: 'Failed to cancel ticket',
  UnableToCancelTicketStatusNotOpen: 'Unable to cancel ticket with status not OPEN',
  PNRHasOpenTickets: 'Selected PNR has tickets. Please use `cancelTickets` option or cancel tickets manually',
  NoReservationToImport: 'No reservation to import',
  UnableToImportPnr: 'Unable to import requested PNR',
  UnableToOpenPNRInTerminal: 'Unable to open requested PNR in Terminal',
  UnableToAddExtraSegment: 'Unable to add extra segment to PNR',
  UnableToSaveBookingWithExtraSegment: 'Unable to save booking with extra segment',
  NoResidualValue: 'Original ticket has no residual value for this specific itinerary. Issue a new ticket using current fares.',
  TicketsNotIssued: 'Host error during ticket retrieve.',
  CantDetectExchangeReponse: 'Exchange response is unknown.',
  ExchangeTokenIncorrect: 'Can\'t parse exchange token. Please resolve it again.',
  DuplicateTicketFound: 'Duplicate ticket number found. Provide PNR, UR locator',
  NoPNRFoundInUR: 'No PNR found in Universal record'
}, AirRuntimeError));

const AirFlightInfoRuntimeError = exports.AirFlightInfoRuntimeError = (0, _nodeErrorsHelpers.createErrorClass)('AirFlightInfoRuntimeError', 'Air flight info service runtime error', _errorTypes2.default.RuntimeError);
Object.assign(AirFlightInfoRuntimeError, (0, _nodeErrorsHelpers.createErrorsList)({
  FlightNotFound: 'Flight not found',
  AirlineNotSupported: 'Airline not supported',
  InvalidFlightNumber: 'Invalid flight number'
}, AirFlightInfoRuntimeError));

const GdsRuntimeError = exports.GdsRuntimeError = (0, _nodeErrorsHelpers.createErrorClass)('GdsRuntimeError', 'Gds service runtime error', _errorTypes2.default.RuntimeError);
Object.assign(GdsRuntimeError, (0, _nodeErrorsHelpers.createErrorsList)({
  PlacingInQueueMessageMissing: 'Placing success message missing',
  PlacingInQueueError: 'Error during placing in queue request'
}, GdsRuntimeError));

exports.default = {
  AirValidationError: AirValidationError,
  AirFlightInfoValidationError: AirFlightInfoValidationError,
  GdsValidationError: GdsValidationError,
  AirParsingError: AirParsingError,
  AirFlightInfoRuntimeError: AirFlightInfoRuntimeError,
  AirRuntimeError: AirRuntimeError,
  GdsRuntimeError: GdsRuntimeError
};