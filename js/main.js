'use strict';

var map = document.querySelector('.map');

var WINDOW_WIDTH = map.offsetWidth;
var WINDOW_HEIGHT_MAX = 630;
var WINDOW_HEIGHT_MIN = 130;

var accomodationTypes = ['palace', 'flat', 'house', 'bungalo'];
var announcements = [];

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getAccomodation = function (types) {
  return types[getRandom(0, types.length - 1)];
};

var arrayFill = function (objects, quantity) {
  for (var i = 1; i <= quantity; i++) {
    var avatarSource = i < 10 ? 'img/avatars/user0' + i + '.png' : 'img/avatars/user' + i + '.png';
    var tempObject = {
      author: {
        avatar: avatarSource
      },
      offer: {
        type: getAccomodation(accomodationTypes)
      },
      location: {
        x: function (pinWidth) {
          return getRandom(pinWidth / 2, WINDOW_WIDTH - pinWidth / 2);
        },
        y: function (pinHeight) {
          return getRandom(WINDOW_HEIGHT_MIN + pinHeight, WINDOW_HEIGHT_MAX - pinHeight);
        }
      }

    };
    objects.push(tempObject);
  }
};

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

arrayFill(announcements, 8);

var renderPin = function (pin) {
  var element = pinTemplate.cloneNode(true);

  element.querySelector('img').src = pin.author.avatar;
  element.style.top = pin.location.y(element.offsetWidth) + 'px';
  element.style.left = pin.location.x(element.offsetHeight) + 'px';
  element.querySelector('img').alt = pin.offer.type;

  return element;
};

// ***********************Задание 2********************************

var toggleElement = function (element, isDisabled) {
  element.disabled = isDisabled;
};

var form = document.querySelector('.ad-form');
var field = form.querySelector('.ad-form-header__input');
var fieldSets = form.querySelectorAll('.ad-form__element');

var toggleFields = function (isDisabled) {
  toggleElement(field, isDisabled);
  for (var i = 0; i < fieldSets.length; i++) {
    toggleElement(fieldSets[i], isDisabled);
  }
};

toggleFields(true);

var fragment = document.createDocumentFragment();
for (var i = 0; i < announcements.length; i++) {
  fragment.appendChild(renderPin(announcements[i]));
}

var mainPin = map.querySelector('.map__pin--main');

var extractCoord = function (str) {
  return parseInt(str.replace('px', ''), 10);
};

form.querySelector('#address').value = (extractCoord(mainPin.style.left) + mainPin.offsetWidth / 2) + ',' + (extractCoord(mainPin.style.top) + mainPin.offsetHeight / 2);

mainPin.addEventListener('click', function () {
  toggleFields(false);
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  document.querySelector('.map__pins').appendChild(fragment);
});
