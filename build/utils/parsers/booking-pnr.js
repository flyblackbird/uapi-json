"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

const parse = screen => {
  const pnrPattern = /(?:^|\n)\s*([A-Z0-9]{6})\/(?:[A-Z0-9]+\s+){3}AG\s+[0-9]+\s+[0-9]{1,2}[A-Z]{3}\s*\n/i;
  const matched = screen.match(pnrPattern);
  if (matched) {
    var _matched = _slicedToArray(matched, 2);

    const _ = _matched[0],
          pnr = _matched[1];

    return pnr;
  }
  return null;
};

exports.default = parse;
module.exports = exports["default"];