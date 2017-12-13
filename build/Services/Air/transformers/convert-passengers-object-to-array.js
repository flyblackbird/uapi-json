'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = params => {
  const list = [];

  Object.keys(params.passengers).forEach(ageCategory => {
    const number = params.passengers[ageCategory];
    if (number) {
      for (let i = 0; i < number; i += 1) {
        list.push({
          ageCategory: ageCategory,
          child: ageCategory === 'CNN' // quickfix
        });
      }
    }
  });

  params.passengers = list;
  return params;
};

module.exports = exports['default'];