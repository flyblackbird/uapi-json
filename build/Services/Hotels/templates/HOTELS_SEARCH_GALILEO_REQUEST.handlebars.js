"use strict";

module.exports = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:hot="http://www.travelport.com/schema/hotel_v34_0" xmlns:com="http://www.travelport.com/schema/common_v34_0">
  <soapenv:Header/>
  <soapenv:Body>
    <hot:HotelSearchAvailabilityReq TargetBranch="{{TargetBranch}}" >
      <com:BillingPointOfSaleInfo OriginApplication="UAPI" />
      {{#nextResult}}
        <com:NextResultReference ProviderCode="1G" >
          {{nextResult}}
        </com:NextResultReference>
        {{/nextResult}}
      <hot:HotelSearchLocation>
        {{#if location}}
          <hot:HotelLocation Location="{{location}}"/>
        {{/if}}

        {{#if code}}
          <hot:ProviderLocation ProviderCode="TRM" Location="{{code}}" />
        {{/if}}

        {{#if coordinateLocation}}
          <com:CoordinateLocation
              latitude="{{coordinateLocation.latitude}}"
              longitude="{{coordinateLocation.longitude}}"
          />
        {{/if}}

        {{#if distance}}
          <com:Distance
              Value="{{distance.value}}"
          />
        {{/if}}

      </hot:HotelSearchLocation>
      <hot:HotelSearchModifiers
        AvailableHotelsOnly="true"
        {{#currency}} PreferredCurrency="{{.}}" {{/currency}}
        NumberOfAdults="{{NumberOfAdults}}"
        NumberOfRooms="{{NumberOfRooms}}"
        ReturnPropertyDescription="true"
      >
        <com:PermittedProviders xmlns:com="http://www.travelport.com/schema/common_v34_0">
          <com:Provider Code="1G"/>
        </com:PermittedProviders>

        {{#if hotelName}}
          <hot:HotelName>{{hotelName}}</hot:HotelName>
        {{/if}}

        {{#if rating}}
        <hot:HotelRating RatingProvider="TRM">
          {{#each rating}}
          <hot:Rating>{{this}}</hot:Rating>
          {{/each}}
        </hot:HotelRating>
        {{/if}}
        {{#children.length}}
        <hot:NumberOfChildren Count="{{children.length}}">
          {{#children}}
          <hot:Age>{{.}}</hot:Age>
          {{/children}}
        </hot:NumberOfChildren>
        {{/children.length}}
      </hot:HotelSearchModifiers>
      <hot:HotelStay>
        <hot:CheckinDate>{{startDate}}</hot:CheckinDate>
        <hot:CheckoutDate>{{endDate}}</hot:CheckoutDate>
      </hot:HotelStay>
    </hot:HotelSearchAvailabilityReq>
  </soapenv:Body>
</soapenv:Envelope>
`;