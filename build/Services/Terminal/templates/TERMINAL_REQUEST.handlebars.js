"use strict";

module.exports = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ter="http://www.travelport.com/schema/terminal_v33_0" xmlns:com="http://www.travelport.com/schema/common_v33_0">
   <soapenv:Header/>
   <soapenv:Body>
      <ter:TerminalReq TargetBranch="{{TargetBranch}}">
         <com:BillingPointOfSaleInfo OriginApplication="uAPI" />
         <com:HostToken Host="1G">{{sessionToken}}</com:HostToken>
         <ter:TerminalCommand>{{command}}</ter:TerminalCommand>
      </ter:TerminalReq>
   </soapenv:Body>
</soapenv:Envelope>
`;