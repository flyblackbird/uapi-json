'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = params => {
  params.passengers.forEach(item => {
    const birthSSR = (0, _moment2.default)(item.birthDate.toUpperCase(), 'YYYY-MM-DD');
    const country = item.passCountry,
          num = item.passNumber,
          first = item.firstName,
          last = item.lastName,
          gender = item.gender;


    const due = (0, _moment2.default)().add(12, 'month').format('DDMMMYY');
    const birth = birthSSR.format('DDMMMYY');

    if (item.ageCategory === 'CNN') {
      item.isChild = true;
      if (item.Age < 10) {
        item.ageCategory = `C0${item.Age}`;
      } else {
        item.ageCategory = `C${item.Age}`;
      }
    }

    item.ssr = {
      type: 'DOCS',
      text: `P/${country}/${num}/${country}/${birth}/${gender}/${due}/${last}/${first}`
    };
    item.DOB = birthSSR.format('YYYY-MM-DD');
  });

  return params;
};

module.exports = exports['default'];