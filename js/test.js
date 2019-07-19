'use strict';

// var numberValidity = function (roomValue, capacityValue) {
//   if (roomValue === 100 && capacityValue === 0) {
//     return ('100 and 0');
//   }
//   if ((capacityValue > roomValue) || (roomValue === 100 || capacityValue === 0)) {
//     return 'недопустимое кол-во комнат';
//   } else {
//     return 'normal';
//   }
// };

var numberValidity = function (roomValue, capacityValue) {
  var message = '';
  if (roomValue === 100 && capacityValue === 0) {
    return message;
  } else if ((capacityValue > roomValue) || (roomValue === 100 || capacityValue === 0)) {
    message = 'недопустимое кол-во комнат';
  }
  return message;
};

console.log(numberValidity(10, 0));
