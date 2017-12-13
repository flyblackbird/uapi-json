'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = string => {
  if (Object.prototype.toString.apply(string) !== '[object String]') {
    return null;
  }
  return string.split(' ').map(name => name[0].toUpperCase() + name.slice(1).toLowerCase()).join(' ');
};

module.exports = exports['default'];