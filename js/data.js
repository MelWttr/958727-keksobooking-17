'use strict';
(function () {
  var WINDOW_HEIGHT_MAX = 630;
  var WINDOW_HEIGHT_MIN = 130;
  var MAIN_PIN_DEFAULT_LEFT = 570;
  var MAIN_PIN_DEFAULT_TOP = 375;
  var ESC = 27;

  var images = [];
  var main = document.querySelector('main');
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var isFirstMove = true;
  var windowWidth = map.offsetWidth;

  // парсит в число из строки координату абсолютно спозиционированного элемента
  var extractCoord = function (str) {
    return parseInt(str.replace('px', ''), 10);
  };

  // возвращает координату X элемента (пина)
  var getElementCoordinateX = function (element, width) {
    return Math.floor(extractCoord(element.style.left) + width);
  };

  // возвращает координату Y элемента (пина)
  var getElementCoordinateY = function (element, height) {
    return Math.floor(extractCoord(element.style.top) + height);
  };

  var closePopup = function (popup) {
    popup.classList.add('hidden');
  };

  var clearMap = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    var card = map.querySelector('.map__card');
    pins.forEach(function (pin) {
      pin.remove();
    });
    if (card) {
      card.remove();
    }
    map.classList.add('map--faded');
    mainPin.style.top = MAIN_PIN_DEFAULT_TOP + 'px';
    mainPin.style.left = MAIN_PIN_DEFAULT_LEFT + 'px';
  };

  var deletePopup = function (popup) {
    popup.remove();
  };

  // переключает поле из активного в неактивное состояние и наоборот
  var setElementAvailability = function (field, isDisabled) {
    field.disabled = isDisabled;
  };

  window.data = {
    isFirstMove: isFirstMove,
    main: main,
    map: map,
    mainPin: mainPin,
    images: images,
    ESC: ESC,
    windowWidth: windowWidth,
    WINDOW_HEIGHT_MIN: WINDOW_HEIGHT_MIN,
    WINDOW_HEIGHT_MAX: WINDOW_HEIGHT_MAX,
    getElementCoordinateX: getElementCoordinateX,
    getElementCoordinateY: getElementCoordinateY,
    extractCoord: extractCoord,
    closePopup: closePopup,
    clearMap: clearMap,
    deletePopup: deletePopup,
    setElementAvailability: setElementAvailability
  };

})();
