'use strict';
(function () {
  var PSEUDO_HEIGHT = 22; // высота хвоста главного пина

  var fillAddressField = function () {
    var mainPinDefaultX = window.data.getElementCoordinateX(window.data.mainPin, window.data.mainPin.offsetWidth / 2); // координата X главного пина
    var mainPinDefaultY = window.data.getElementCoordinateY(window.data.mainPin, window.data.mainPin.offsetHeight + PSEUDO_HEIGHT); // координата Y главного пина
    window.formValidation.address.value = window.formValidation.getAddressValue(mainPinDefaultX, mainPinDefaultY); // меняем значение в поле адреса на каждый мув
  };

  window.mainPinClickHandler = function () {
    if (window.data.isFirstMove) {
      window.pins.enablePage();
      fillAddressField();
      window.data.isFirstMove = false;
    }
    window.data.mainPin.removeEventListener('click', window.mainPinClickHandler);
  };
  window.data.mainPin.addEventListener('click', window.mainPinClickHandler);

  // далее описана логика перемещения пина по карте
  window.data.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      fillAddressField();
      if (window.data.isFirstMove) { // если первый мув, приводим страницу в активное состояние
        window.pins.enablePage();
        window.data.isFirstMove = false;
      }
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var pinY = window.data.mainPin.offsetTop - shift.y;
      var pinX = window.data.mainPin.offsetLeft - shift.x;

      // задаем границы перемещения пина по карте
      var minBottomValue = window.data.WINDOW_HEIGHT_MIN - PSEUDO_HEIGHT;
      var maxTopValue = window.data.WINDOW_HEIGHT_MAX;
      var minLeftValue = -(window.data.mainPin.offsetWidth / 2);
      var maxRightValue = window.data.windowWidth - window.data.mainPin.offsetWidth / 2;
      if (pinY >= minBottomValue && pinY <= maxTopValue) {
        window.data.mainPin.style.top = (window.data.mainPin.offsetTop - shift.y) + 'px';
      }
      if (pinX > minLeftValue && pinX < maxRightValue) {
        window.data.mainPin.style.left = (window.data.mainPin.offsetLeft - shift.x) + 'px';
      }
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
