'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

const moment = require('moment');

exports.default = params => {
  if (params.fop.type === 'Card') {
    params.fop.type = 'Credit'; // FIXME: determine card type and add it

    var _params$creditCard$ex = params.creditCard.expDate.split('/'),
        _params$creditCard$ex2 = _slicedToArray(_params$creditCard$ex, 2);

    const m = _params$creditCard$ex2[0],
          y = _params$creditCard$ex2[1];

    params.creditCard.expDate = `${moment().format('YYYY').substring(0, 2)}${y}-${m}`;
    // params.creditCard.type = 'CA'; // determine card type for 1G
  }
  return params;
};

module.exports = exports['default'];