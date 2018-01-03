module.exports = `
<!--Release 33-->
<!--Version Dated as of 14/Aug/2015 18:47:44-->
<!--Air Low Fare Search For Galileo(1G) Request-->
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <air:LowFareSearchReq
            AuthorizedBy="user" TraceId="{{requestId}}" TargetBranch="{{TargetBranch}}"
            ReturnUpsellFare="true"
            xmlns:air="http://www.travelport.com/schema/air_v33_0"
            xmlns:com="http://www.travelport.com/schema/common_v33_0"
            >
            <com:BillingPointOfSaleInfo OriginApplication="uAPI"/>
            {{#legs}}
            <air:SearchAirLeg>
                <air:SearchOrigin>
                  {{#if originPreferCity}}
                    <com:CityOrAirport
                      Code="{{from}}"
                      PreferCity="true"
                    />
                  {{else}}
                    <com:Airport
                      Code="{{from}}"
                    />
                  {{/if}}
                </air:SearchOrigin>
                <air:SearchDestination>
                  {{#if destinationPreferCity}}
                    <com:CityOrAirport
                      Code="{{to}}"
                      PreferCity="true"
                    />
                  {{else}}
                    <com:Airport
                      Code="{{to}}"
                    />
                  {{/if}}
                </air:SearchDestination>
                <air:SearchDepTime PreferredTime="{{departureDate}}"/>
                <air:AirLegModifiers>
                    {{#if ../cabins}}
                    <air:PreferredCabins>
                        {{#each ../cabins}}
                        <com:CabinClass Type="{{this}}"/>
                        {{/each}}
                    </air:PreferredCabins>
                    {{/if}}
                </air:AirLegModifiers>
            </air:SearchAirLeg>
            {{/legs}}
            <air:AirSearchModifiers
                {{#if allowChangeOfAirport}}
                  AllowChangeOfAirport="true"
                {{else}}
                  AllowChangeOfAirport="false"
                {{/if}}
                {{#if excludeOpenJawAirport}}
                  ExcludeOpenJawAirport="true"
                {{else}}
                  ExcludeOpenJawAirport="false"
                {{/if}}
                {{#if maxJourneyTime}}
                    MaxJourneyTime="{{maxJourneyTime}}"
                {{/if}}
                {{#if orderBy}}
                    OrderBy="{{orderBy}}"
                {{/if}}
                {{#if maxSolutions}}
                    MaxSolutions="{{maxSolutions}}"
                {{/if}}
                {{#if preferNonStop}}
                    PreferNonStop="{{preferNonStop}}"
                {{/if}}
            >
                <air:PreferredProviders>
                    <com:Provider Code="1G" xmlns:com="http://www.travelport.com/schema/common_v33_0"/>
                </air:PreferredProviders>

                {{#if permittedCarriers.length}}
                  <air:PermittedCarriers>
                      {{#each permittedCarriers}}
                        <com:Carrier Code="{{this}}"/>
                      {{/each}}
                  </air:PermittedCarriers>
                {{/if}}

                {{#if prohibitedCarriers.length}}
                  <air:ProhibitedCarriers>
                      {{#each prohibitedCarriers}}
                        <com:Carrier Code="{{this}}"/>
                      {{/each}}
                  </air:ProhibitedCarriers>
                {{/if}}

                {{#if preferredCarriers.length}}
                  <air:PreferredCarriers>
                      {{#each preferredCarriers}}
                        <com:Carrier Code="{{this}}"/>
                      {{/each}}
                  </air:PreferredCarriers>
                {{/if}}

                {{#if flightType}}
                  <air:FlightType
                    {{#if flightType.MaxStops}}
                        MaxStops="{{flightType.maxStops}}"
                    {{/if}}

                    {{#if flightType.maxConnections}}
                      MaxConnections="{{flightType.maxConnections}}"
                    {{/if}}

                    {{#if flightType.nonStopDirects}}
                      NonStopDirects="{{flightType.nonStopDirects}}"
                    {{/if}}
                  />
                {{/if}}
                {{#if maxLayoverDuration}}
                  <air:MaxLayoverDuration
                    {{#if maxLayoverDuration.domestic}}
                      Domestic="{{maxLayoverDuration.domestic}}"
                    {{/if}}

                    {{#if maxLayoverDuration.gateway}}
                      Gateway="{{maxLayoverDuration.gateway}}"
                    {{/if}}

                    {{#if maxLayoverDuration.international}}
                      International="{{maxLayoverDuration.international}}"
                    {{/if}}
                  />
                {{/if}}
            </air:AirSearchModifiers>
            {{#passengers}}
            <com:SearchPassenger Code="{{ageCategory}}"{{#if child}} Age="9"{{/if}} xmlns:com="http://www.travelport.com/schema/common_v33_0"/>
            {{/passengers}}
            {{#if pricing}}
            <air:AirPricingModifiers
                {{#if pricing.currency}}
                CurrencyType="{{pricing.currency}}"
                {{/if}}
                {{#if pricing.eTicketability}}
                ETicketability="{{pricing.eTicketability}}"
                {{/if}}
            />
            {{/if}}
            {{#if emulatePcc}}
            <air:PCC>
                <com:OverridePCC ProviderCode="1G" PseudoCityCode="{{emulatePcc}}"/>
            </air:PCC>
            {{/if}}
        </air:LowFareSearchReq>
    </soap:Body>
</soap:Envelope>
`;
