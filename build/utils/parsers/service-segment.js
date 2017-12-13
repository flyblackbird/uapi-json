'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

const itemPattern = new RegExp([
// rfiCode, rfiSubcode
'-([A-Z]{1})/([A-Z0-9]{3})',
// Fee description, passenger name, amount, currency
'\\/([^\\/]+)/NM-1(.+?)\\/([^\\/]*)\\/((?:\\d+\\.)?\\d+)\\/([A-Z]{3})'].join(''), 'i');

const parse = string => {
  var _string$match = string.match(itemPattern),
      _string$match2 = _slicedToArray(_string$match, 8);

  const _ = _string$match2[0],
        rfiCode = _string$match2[1],
        rfiSubcode = _string$match2[2],
        feeDescription = _string$match2[3],
        name = _string$match2[4],
        documentNumber = _string$match2[5],
        amount = _string$match2[6],
        currency = _string$match2[7];


  return Object.assign({
    rfiCode: rfiCode,
    rfiSubcode: rfiSubcode,
    feeDescription: feeDescription,
    name: name,
    amount: Number(amount),
    currency: currency
  }, documentNumber !== '' ? { documentNumber: documentNumber.substr(0, 13) } : null);
};

exports.default = parse;
module.exports = exports['default'];