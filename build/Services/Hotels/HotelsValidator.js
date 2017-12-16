'use strict';

var _HotelsErrors = require('./HotelsErrors');

function Validator(params) {
  this.params = params;
  this.reg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
}

Validator.prototype.end = function () {
  return this.params;
};

Validator.prototype.rooms = function () {
  if (!(this.params.rooms instanceof Array)) {
    throw new _HotelsErrors.HotelsValidationError.RoomsMissing(this.params);
  }
  if (this.params.rooms.length < 1) {
    throw new _HotelsErrors.HotelsValidationError.RoomsMissing(this.params);
  }
  this.params.rooms.forEach(elem => {
    if (elem.adults < 1) {
      throw new _HotelsErrors.HotelsValidationError.TravellersError.AdultsMissing(this.params);
    }
    if (elem.children) {
      if (!(elem.children instanceof Array)) {
        throw new _HotelsErrors.HotelsValidationError.TravellersError.ChildrenTypeInvalid(this.params);
      }
      elem.children.forEach(child => {
        if (child < 0 || child > 18) {
          throw new _HotelsErrors.HotelsValidationError.TravellersError.ChildrenAgeInvalid(this.params);
        }
      });
    }
  });
  return this;
};

Validator.prototype.code = function () {
  if (this.params.location) {
    return this;
  }
  if (this.params.code === undefined) {
    throw new _HotelsErrors.HotelsValidationError.LocationMissing(this.params);
  } else if (this.params.code.length > 6) {
    throw new _HotelsErrors.HotelsValidationError.LocationInvalid(this.params);
  }
  return this;
};

Validator.prototype.location = function () {
  if (this.params.code) {
    return this;
  }
  if (this.params.location === undefined) {
    throw new _HotelsErrors.HotelsValidationError.LocationMissing(this.params);
  } else if (this.params.location.length > 3) {
    throw new _HotelsErrors.HotelsValidationError.LocationInvalid(this.params);
  }
  return this;
};

Validator.prototype.startDate = function () {
  if (this.params.startDate === undefined) {
    throw new _HotelsErrors.HotelsValidationError.StartDateMissing(this.params);
  } else if (this.reg.exec(this.params.startDate) == null) {
    throw new _HotelsErrors.HotelsValidationError.StartDateInvalid(this.params);
  }
  return this;
};

Validator.prototype.endDate = function () {
  if (this.params.endDate === undefined) {
    throw new _HotelsErrors.HotelsValidationError.EndDateMissing(this.params);
  } else if (this.reg.exec(this.params.endDate) == null) {
    throw new _HotelsErrors.HotelsValidationError.EndDateInvalid(this.params);
  }
  return this;
};

Validator.prototype.hotelChain = function () {
  if (this.params.HotelChain === undefined) {
    throw new _HotelsErrors.HotelsValidationError.HotelChainMissing(this.params);
  } else if (this.params.HotelChain.length > 2) {
    throw new _HotelsErrors.HotelsValidationError.HotelChainInvalid(this.params);
  }
  return this;
};

Validator.prototype.hotelCode = function () {
  if (this.params.HotelCode === undefined) {
    throw new _HotelsErrors.HotelsValidationError.HotelCodeMissing(this.params);
  }
  return this;
};

Validator.prototype.people = function () {
  if (!(this.params.people instanceof Array) || this.params.people.length < 1) {
    throw new _HotelsErrors.HotelsValidationError.TravellersMissing(this.params);
  }
  this.params.people.forEach(traveler => {
    if (traveler.FirstName === undefined) {
      throw new _HotelsErrors.HotelsValidationError.FirstNameMissing(this.params);
    }
    if (traveler.LastName === undefined) {
      throw new _HotelsErrors.HotelsValidationError.LastNameMissing(this.params);
    }
    if (traveler.PrefixName === undefined || traveler.PrefixName.length > 4) {
      throw new _HotelsErrors.HotelsValidationError.PrefixNameMissing(this.params);
    }
    if (traveler.Nationality === undefined || traveler.Nationality.length > 2) {
      throw new _HotelsErrors.HotelsValidationError.NationalityMissing(this.params);
    }
    if (traveler.BirthDate === undefined || this.reg.exec(traveler.BirthDate) == null) {
      throw new _HotelsErrors.HotelsValidationError.BirthDateMissing(this.params);
    }
  });
  return this;
};

Validator.prototype.firstPeopleContacts = function () {
  const traveler = this.params.people[0];
  if (traveler.AreaCode === undefined) {
    throw new _HotelsErrors.HotelsValidationError.ContactError.AreaCodeMissing(this.params);
  }
  if (traveler.CountryCode === undefined) {
    throw new _HotelsErrors.HotelsValidationError.ContactError.CountryCodeMissing(this.params);
  }
  if (traveler.Number === undefined) {
    throw new _HotelsErrors.HotelsValidationError.ContactError.NumberMissing(this.params);
  }
  if (traveler.Email === undefined) {
    throw new _HotelsErrors.HotelsValidationError.ContactError.EmailMissing(this.params);
  }
  if (traveler.Country === undefined) {
    throw new _HotelsErrors.HotelsValidationError.ContactError.CountryMissing(this.params);
  } else if (traveler.Country.length !== 2) {
    throw new _HotelsErrors.HotelsValidationError.ContactError.CountryInvalid(this.params);
  }
  if (traveler.City === undefined) {
    throw new _HotelsErrors.HotelsValidationError.ContactError.CityMissing(this.params);
  }
  if (traveler.Street === undefined) {
    throw new _HotelsErrors.HotelsValidationError.ContactError.StreetMissing(this.params);
  }
  if (traveler.PostalCode === undefined) {
    throw new _HotelsErrors.HotelsValidationError.ContactError.PostalCodeMissing(this.params);
  }
  return this;
};

Validator.prototype.guarantee = function () {
  if (this.params.Guarantee === undefined) {
    throw new _HotelsErrors.HotelsValidationError.PaymentDataError.GuaranteeMissing(this.params);
  }
  if (this.params.Guarantee.CVV === undefined) {
    throw new _HotelsErrors.HotelsValidationError.PaymentDataError.CvvMissing(this.params);
  } else if (this.params.Guarantee.CVV.length !== 3) {
    throw new _HotelsErrors.HotelsValidationError.PaymentDataError.CvvInvalid(this.params);
  }
  if (this.params.Guarantee.ExpDate === undefined) {
    throw new _HotelsErrors.HotelsValidationError.PaymentDataError.ExpDateMissing(this.params);
  }
  if (this.params.Guarantee.CardHolder === undefined) {
    throw new _HotelsErrors.HotelsValidationError.PaymentDataError.CardHolderMissing(this.params);
  }
  if (this.params.Guarantee.CardNumber === undefined) {
    throw new _HotelsErrors.HotelsValidationError.PaymentDataError.CardNumberMissing(this.params);
  }
  if (this.params.Guarantee.CardType === undefined) {
    throw new _HotelsErrors.HotelsValidationError.PaymentDataError.CardTypeMissing(this.params);
  } else if (this.params.Guarantee.CardType.length !== 2) {
    throw new _HotelsErrors.HotelsValidationError.PaymentDataError.CardTypeInvalid(this.params);
  }
  return this;
};

Validator.prototype.locatorCode = function () {
  if (this.params.LocatorCode === undefined) {
    throw new _HotelsErrors.HotelsValidationError.LocatorCodeMissing(this.params);
  }
  return this;
};

Validator.prototype.rates = function () {
  if (this.params.rates === undefined) {
    throw new _HotelsErrors.HotelsValidationError.RatesMissing(this.params);
  }
  if (this.params.rates.length < 1) {
    throw new _HotelsErrors.HotelsValidationError.RatesMissing(this.params);
  }

  this.params.rates.forEach(rate => {
    if (rate.RateOfferId === undefined) {
      throw new _HotelsErrors.HotelsValidationError.RateOfferIdMissing(this.params);
    }

    if (rate.RateSupplier === undefined) {
      throw new _HotelsErrors.HotelsValidationError.RateSupplierMissing(this.params);
    }

    if (rate.RatePlanType === undefined) {
      throw new _HotelsErrors.HotelsValidationError.RatePlanTypeMissing(this.params);
    }

    if (rate.Base === undefined) {
      throw new _HotelsErrors.HotelsValidationError.BasePriceMissing(this.params);
    }

    if (rate.Total === undefined) {
      throw new _HotelsErrors.HotelsValidationError.TotalMissing(this.params);
    }
    if (rate.Tax === undefined) {
      throw new _HotelsErrors.HotelsValidationError.TaxMissing(this.params);
    }
    if (rate.Surcharge === undefined) {
      throw new _HotelsErrors.HotelsValidationError.SurchargeMissing(this.params);
    }
  });
  return this;
};

Validator.prototype.hostToken = function () {
  if (this.params.HostToken === undefined) {
    throw new _HotelsErrors.HotelsValidationError.HostTokenMissing(this.params);
  }
  return this;
};

module.exports = {
  HOTELS_SEARCH_REQUEST: function HOTELS_SEARCH_REQUEST(params) {
    return new Validator(params).code().location().startDate().endDate().rooms().end();
  },
  HOTELS_SEARCH_REQUEST_GALILEO: function HOTELS_SEARCH_REQUEST_GALILEO(params) {
    return new Validator(params).code().location().startDate().endDate().end();
  },
  HOTELS_RATE_REQUEST: function HOTELS_RATE_REQUEST(params) {
    return new Validator(params).hotelChain().hotelCode().startDate().endDate().rooms().end();
  },
  HOTELS_BOOK_REQUEST: function HOTELS_BOOK_REQUEST(params) {
    return new Validator(params).hotelChain().hotelCode().startDate().endDate().people().firstPeopleContacts().guarantee().rates().hostToken().end();
  },
  HOTELS_CANCEL_BOOK_REQUEST: function HOTELS_CANCEL_BOOK_REQUEST(params) {
    return new Validator(params).locatorCode().end();
  }
};