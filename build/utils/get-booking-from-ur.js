"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBookingFromUr;
function getBookingFromUr(ur, pnr) {
  return ur.find(record => record.pnr === pnr);
}
module.exports = exports["default"];