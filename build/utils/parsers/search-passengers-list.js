'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _beautifyName = require('../beautify-name');

var _beautifyName2 = _interopRequireDefault(_beautifyName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const parse = screen => {
  const listPattern = /0*([0-9]+)\s[0-9]{2}([^\s]+)\s*(X?)\s([0-9]{2}[A-Z]{3}\d*)/g;
  const emptyPattern = /\s*(NO NAMES).*/g;

  if (screen.match(emptyPattern)) {
    return [];
  }

  const list = screen.match(listPattern);

  if (list === null) {
    return null;
  }

  const parsedList = list.map(line => {
    listPattern.lastIndex = 0;
    const parsedLine = listPattern.exec(line);

    var _parsedLine = _slicedToArray(parsedLine, 5);

    const _ = _parsedLine[0],
          id = _parsedLine[1],
          name = _parsedLine[2],
          cancelled = _parsedLine[3],
          date = _parsedLine[4];

    var _name$split = name.split('/'),
        _name$split2 = _slicedToArray(_name$split, 2);

    const lastName = _name$split2[0],
          firstName = _name$split2[1];

    return {
      id: id,
      lastName: (0, _beautifyName2.default)(lastName),
      firstName: (0, _beautifyName2.default)(firstName),
      isCancelled: cancelled.length > 0,
      date: (0, _moment2.default)(date, 'DDMMM').format()
    };
  });

  return parsedList;
};

exports.default = parse;
module.exports = exports['default'];