'use strict';

var map = document.querySelector('.map');

var WINDOW_WIDTH = map.offsetWidth;
var WINDOW_HEIGHT_MAX = 630;
var WINDOW_HEIGHT_MIN = 130;

var accomodationTypes = ['palace', 'flat', 'house', 'bungalo'];
var announcements = []; // сюда буем складывать шаблоны объявлений с данными сгенерированными случайно

var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// возвращает нам случайный элемент из массива с типами жилищ
var getAccomodation = function (types) {
  return types[getRandom(0, types.length - 1)];
};

// генерирует случайное объект(объявление) и кладет его в передаваемый массив в количестве quantity.
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

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // сохраняем в переменную шаблон пина.

arrayFill(announcements, 8);

// заполняет шаблон объявления данными
var renderPin = function (announcement, element) {

  element.querySelector('img').src = announcement.author.avatar;
  element.style.top = announcement.location.y(element.offsetHeight) + 'px';
  element.style.left = announcement.location.x(element.offsetWidth) + 'px';
  element.querySelector('img').alt = announcement.offer.type;

  return element;
};

// ***********************Задание 2********************************

// переключает поле из активного в неактивное состояние и наоборот
var toggleElement = function (field, isDisabled) {
  field.disabled = isDisabled;
};

var form = document.querySelector('.ad-form');
var field = form.querySelector('.ad-form-header__input');
var fieldSets = form.querySelectorAll('.ad-form__element');

//  переключает все поля формы на странице из активного в неактивное состояние и наоборот
var toggleFields = function (isDisabled) {
  toggleElement(field, isDisabled);
  for (var i = 0; i < fieldSets.length; i++) {
    toggleElement(fieldSets[i], isDisabled);
  }
};

toggleFields(true); // выключает все поля в форме

var mainPin = map.querySelector('.map__pin--main');

// парсит в число из строки координату абсолютно спозиционированного элемента
var extractCoord = function (str) {
  return parseInt(str.replace('px', ''), 10);
};

var address = form.querySelector('#address');
// заполняет поле с адресом координатами главного пина
address.value = (extractCoord(mainPin.style.left) + mainPin.offsetWidth / 2) + ',' + (extractCoord(mainPin.style.top) + mainPin.offsetHeight / 2);

var pins = document.querySelector('.map__pins');

// слушает главный пин и переводит всю страницу в активное состояние, если кликнули по нему
mainPin.addEventListener('click', function () {
  toggleFields(false);
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  for (var i = 0; i < announcements.length; i++) {
    var clone = pinTemplate.cloneNode(true);
    pins.appendChild(clone);
    renderPin(announcements[i], clone);
  }
});
