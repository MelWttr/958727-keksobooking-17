'use strict';

var map = document.querySelector('.map');
map.classList.remove('map--faded');

// var pin = map.querySelector('map__pin');

var WINDOW_WIDTH = map.offsetWidth;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var accomodationType = ['palace', 'flat', 'house', 'bungalo'];
var announcement = [];

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getX = function () {
  return getRandom(PIN_WIDTH / 2, WINDOW_WIDTH - PIN_WIDTH / 2);
};
var getY = function () {
  return getRandom(130 + PIN_HEIGHT, 630 - PIN_HEIGHT);
};

var getAccomodation = function (types) {
  return types[getRandom(0, types.length - 1)];
};

var arrayFill = function (array, quantity) {
  for (var i = 1; i <= quantity; i++) {
    var avatarSource = i < 10 ? 'img/avatars/user0' + i + '.png' : 'img/avatars/user' + i + '.png';
    var tempObject = {
      author: {
        avatar: avatarSource
      },
      offer: {
        type: getAccomodation(accomodationType)
      },
      location: {
        x: getX(),
        y: getY()
      }

    };
    array.push(tempObject);
  }
};

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

arrayFill(announcement, 8);

var renderPin = function (pin) {
  var element = pinTemplate.cloneNode(true);

  element.querySelector('img').src = pin.author.avatar;
  element.style.top = pin.location.y + 'px;';
  element.style.left = pin.location.x + 'px;';
  element.querySelector('img').alt = pin.offer.type;

  return element;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < announcement.length; i++) {
  fragment.appendChild(renderPin(announcement[i]));
}

document.querySelector('.map__pins').appendChild(fragment);
