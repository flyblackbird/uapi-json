'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaymentDataError = exports.ContactError = exports.TravellersError = exports.HotelsValidationError = undefined;

var _nodeErrorsHelpers = require('node-errors-helpers');

var _errorTypes = require('../../error-types');

var _errorTypes2 = _interopRequireDefault(_errorTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Validation errors
const HotelsValidationError = exports.HotelsValidationError = (0, _nodeErrorsHelpers.createErrorClass)('HotelsValidationError', 'Hotels service validation error', _errorTypes2.default.ValidationError);
const TravellersError = exports.TravellersError = (0, _nodeErrorsHelpers.createErrorClass)('TravellersError', 'Travellers information is incorrect', HotelsValidationError);
const ContactError = exports.ContactError = (0, _nodeErrorsHelpers.createErrorClass)('AddressError', 'Address information is incorrect', HotelsValidationError);
const PaymentDataError = exports.PaymentDataError = (0, _nodeErrorsHelpers.createErrorClass)('PaymentDataError', 'Payment information is incorrect', HotelsValidationError);
Object.assign(HotelsValidationError, {
  TravellersError: TravellersError,
  ContactError: ContactError,
  PaymentDataError: PaymentDataError
});
Object.assign(HotelsValidationError, (0, _nodeErrorsHelpers.createErrorsList)({
  LocationMissing: 'Missing location in request',
  LocationInvalid: 'Invalid location in request',
  StartDateMissing: 'Missing startDate in request',
  StartDateInvalid: 'Invalid startDate in request',
  EndDateMissing: 'Missing endDate in request',
  EndDateInvalid: 'Invalid endDate in request',
  RoomsMissing: 'Missing rooms in request',
  HotelChainMissing: 'Missing HotelChain in request',
  HotelChainInvalid: 'Invalid HotelChain in request',
  HotelCodeMissing: 'Missing HotelCode in request',
  VendorLocationKeyMissing: 'Missing VendorLocationKey in request',
  LocatorCodeMissing: 'Missing LocatorCode in request',
  RatesMissing: 'Missing rates',
  TotalMissing: 'Missing Total price',
  SurchargeMissing: 'Missing Surcharge',
  TaxMissing: 'Missing Tax',
  BasePriceMissing: 'Missing Base price',
  RateSupplierMissing: 'Missing RateSupplier',
  RatePlanTypeMissing: 'Missing RatePlanType',
  RateOfferIdMissing: 'Missing RateOfferId',
  HostTokenMissing: 'Missing HostToken'
}, HotelsValidationError));
Object.assign(TravellersError, (0, _nodeErrorsHelpers.createErrorsList)({
  AdultsMissing: 'Missing adults in request',
  ChildrenTypeInvalid: 'Invalid type for children in request',
  ChildrenAgeInvalid: 'One or more child in request has invalid age',
  TravellersMissing: 'Missing travellers in request',
  FirstNameMissing: 'Missing FirstName in request',
  LastNameMissing: 'Missing LastName in request',
  PrefixNameMissing: 'Missing PrefixName in request',
  NationalityMissing: 'Missing Nationality in request',
  BirthDateMissing: 'Missing BirthDate in request'
}, TravellersError));
Object.assign(ContactError, (0, _nodeErrorsHelpers.createErrorsList)({
  AreaCodeMissing: 'Missing AreaCode in request',
  CountryCodeMissing: 'Missing CountryCode in request',
  NumberMissing: 'Missing Number in request',
  EmailMissing: 'Missing Email in request',
  CountryMissing: 'Missing Country in request',
  CountryInvalid: 'Invalid Country in request',
  CityMissing: 'Missing City in request',
  StreetMissing: 'Missing Street in request',
  PostalCodeMissing: 'Missing PostalCode in request'
}, ContactError));
Object.assign(PaymentDataError, (0, _nodeErrorsHelpers.createErrorsList)({
  GuaranteeMissing: 'Missing Guarantee',
  CvvMissing: 'Missing CVV',
  CvvInvalid: 'Invalid CVV',
  ExpDateMissing: 'Missing ExpDate',
  CardNumberMissing: 'Missing CardNumber',
  CardTypeMissing: 'Missing CardType',
  CardTypeInvalid: 'Invalid CardType',
  CardHolderMissing: 'Missing CardHolder'
}, PaymentDataError));

// Parsing errors
const HotelsParsingError = (0, _nodeErrorsHelpers.createErrorClass)('HotelsParsingError', 'Hotels service parsing error', _errorTypes2.default.ParsingError);
Object.assign(HotelsParsingError, (0, _nodeErrorsHelpers.createErrorsList)({
  SearchParsingError: 'Cant parse XML response. #HotelsParser.searchParse()',
  MediaParsingError: 'Cant parse XML response. #HotelsParser.mediaParse()',
  RateParsingError: 'Cant parse XML response. #HotelsParser.rateParse()',
  BookingParsingError: 'Cant parse XML response. #HotelsParser.bookParse()',
  CancelBookingParsingError: 'Cant parse XML response. #HotelsParser.cancelBookParse()'
}, HotelsParsingError));

// Runtime errors
const HotelsRuntimeError = (0, _nodeErrorsHelpers.createErrorClass)('HotelsRuntimeError', 'Hotels service runtime error', _errorTypes2.default.RuntimeError);
Object.assign(HotelsRuntimeError, (0, _nodeErrorsHelpers.createErrorsList)({
  NoEnginesResults: 'None of the enabled engines could fulfill your request',
  NoResultsFound: 'No results found'
}, HotelsRuntimeError));

exports.default = {
  HotelsValidationError: HotelsValidationError,
  HotelsParsingError: HotelsParsingError,
  HotelsRuntimeError: HotelsRuntimeError
};