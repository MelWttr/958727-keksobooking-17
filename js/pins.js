'use strict';
(function () {

  var ACCOMODATION_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var announcements = []; // сюда буем складывать шаблоны объявлений с данными сгенерированными случайно
  var pins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // сохраняем в переменную шаблон пина


  var getAccomodation = function (types) { // возвращает нам случайный элемент из массива с типами жилищ
    return types[window.data.getRandom(0, types.length - 1)];
  };
  var arrayFill = function (objects, quantity) { // генерирует случайное объект(объявление) и кладет его в передаваемый массив в количестве quantity
    for (var i = 1; i <= quantity; i++) {
      var avatarSource = i < 10 ? 'img/avatars/user0' + i + '.png' : 'img/avatars/user' + i + '.png';
      var tempObject = {
        author: {
          avatar: avatarSource
        },
        offer: {
          type: getAccomodation(ACCOMODATION_TYPES)
        },
        location: {
          x: function (pinWidth) {
            return window.data.getRandom(pinWidth / 2, window.data.WINDOW_WIDTH - pinWidth / 2);
          },
          y: function (pinHeight) {
            return window.data.getRandom(window.data.WINDOW_HEIGHT_MIN + pinHeight, window.data.WINDOW_HEIGHT_MAX - pinHeight);
          }
        }

      };
      objects.push(tempObject);
    }
  };

  arrayFill(announcements, 8); // наполняем массив для хранения шаблонов объявлений

  var renderPin = function (announcement, element) { // заполняет шаблон объявления данными
    element.querySelector('img').src = announcement.author.avatar;
    element.style.top = announcement.location.y(element.offsetHeight) + 'px';
    element.style.left = announcement.location.x(element.offsetWidth) + 'px';
    element.querySelector('img').alt = announcement.offer.type;

    return element;
  };

  window.enablePage = function () { // функция делает страницу активной
    window.formValidation.toggleFields(false);
    window.data.map.classList.remove('map--faded');
    window.formValidation.form.classList.remove('ad-form--disabled');
    for (var i = 0; i < announcements.length; i++) {
      var clone = pinTemplate.cloneNode(true)
      pins.appendChild(clone);
      renderPin(announcements[i], clone);
    }
  };

})();

