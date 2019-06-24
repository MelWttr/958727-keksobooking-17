'use strict';

var map = document.querySelector('.map');

var WINDOW_WIDTH = map.offsetWidth;
var WINDOW_HEIGHT_MAX = 630;
var WINDOW_HEIGHT_MIN = 130;
var PSEUDO_HEIGHT = 22;

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

var getX = function (element, width) {
  return extractCoord(element.style.left) + width;
};

var getY = function (element, height) {
  return extractCoord(element.style.top) + height;
};

var makeAddressValue = function (x, y) {
  return x + ',' + y;
};

var address = form.querySelector('#address');
// заполняет поле с адресом координатами главного пина
address.value = makeAddressValue(getX(mainPin, mainPin.offsetWidth / 2), getY(mainPin, mainPin.offsetHeight / 2));

var pins = document.querySelector('.map__pins');

// ***************Задание 2.1***************************

// хранит минимальные стоимости за ночь для разных типов жилья
var minPrices = {
  'bungalo': '0',
  'flat': '1000',
  'house': '5000',
  'palace': '10000'
};

var type = document.querySelector('#type');
var price = document.querySelector('#price');
// устанавливаем первоначальные значения полей тип и цена за ночь
price.min = minPrices[type.value];
price.placeholder = minPrices[type.value];
// синхронизируем поля тип и цена за ночь
type.onchange = function () {
  price.min = minPrices[this.value];
  price.placeholder = minPrices[this.value];
};
// устанавливаем первоначальные значения полей дат заезда и выезда
form.timein.value = form.timeout.value;
// синхронизируем дату заезда и выезда
form.onchange = function (evt) {
  if (evt.target.name === 'timein') {
    this.timeout.value = evt.target.value;
  }
  if (evt.target.name === 'timeout') {
    this.timein.value = evt.target.value;
  }
};

// ******************Задание 3.1*********************
var count = true;

// функция делает страницу активной
var enablePage = function () {
  toggleFields(false);
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  for (var i = 0; i < announcements.length; i++) {
    var clone = pinTemplate.cloneNode(true);
    pins.appendChild(clone);
    renderPin(announcements[i], clone);
  }
};

// далее описана логика перемещения пина по карте
mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    address.value = makeAddressValue(getX(mainPin, mainPin.offsetWidth / 2), getY(mainPin, mainPin.offsetHeight + PSEUDO_HEIGHT)); // меняем значение в поле                                                                                                                                        адреса на каждый мув
    if (count) { // если первый мув, приводим страницу в активное состояние
      enablePage();
      count = false;
    }
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var pinY = mainPin.offsetTop - shift.y;
    var pinX = mainPin.offsetLeft - shift.x;

    // задаем границы перемещения пина
    if (pinY >= (WINDOW_HEIGHT_MIN - (mainPin.offsetHeight + PSEUDO_HEIGHT)) && pinY <= (WINDOW_HEIGHT_MAX - (mainPin.offsetHeight + PSEUDO_HEIGHT))) {
      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
    }
    if (pinX > -(mainPin.offsetWidth / 2) && pinX < WINDOW_WIDTH - mainPin.offsetWidth / 2) {
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    }
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});


