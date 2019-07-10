'use strict';
(function () {
  var map = document.querySelector('.map');

  var WINDOW_WIDTH = map.offsetWidth;
  var WINDOW_HEIGHT_MAX = 630;
  var WINDOW_HEIGHT_MIN = 130;
  var ESC = 27;

  // парсит в число из строки координату абсолютно спозиционированного элемента
  var extractCoord = function (str) {
    return parseInt(str.replace('px', ''), 10);
  };

  // возвращает координату X элемента (пина)
  var getX = function (element, width) {
    return extractCoord(element.style.left) + width;
  };

  // возвращает координату Y элемента (пина)
  var getY = function (element, height) {
    return extractCoord(element.style.top) + height;
  };

  var getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var closePopup = function (popup) {
    popup.classList.add('hidden');
  };

  var refreshPage = function () {
    window.location.reload();
  };


  window.data = {
    ESC: ESC,
    map: map,
    WINDOW_WIDTH: WINDOW_WIDTH,
    WINDOW_HEIGHT_MIN: WINDOW_HEIGHT_MIN,
    WINDOW_HEIGHT_MAX: WINDOW_HEIGHT_MAX,
    getX: getX,
    getY: getY,
    extractCoord: extractCoord,
    getRandom: getRandom,
    closePopup: closePopup,
    refreshPage: refreshPage
  };

})();
