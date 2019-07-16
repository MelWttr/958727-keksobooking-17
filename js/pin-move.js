'use strict';
(function () {
  var PSEUDO_HEIGHT = 22;

  // далее описана логика перемещения пина по карте
  window.data.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.formValidation.address.value = window.formValidation.makeAddressValue(window.data.getX(window.data.mainPin, window.data.mainPin.offsetWidth / 2), window.data.getY(window.data.mainPin, window.data.mainPin.offsetHeight + PSEUDO_HEIGHT)); // меняем значение в поле адреса на каждый мув
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
      if (pinY >= (window.data.WINDOW_HEIGHT_MIN - (window.data.mainPin.offsetHeight + PSEUDO_HEIGHT)) && pinY <= (window.data.WINDOW_HEIGHT_MAX - (window.data.mainPin.offsetHeight + PSEUDO_HEIGHT))) {
        window.data.mainPin.style.top = (window.data.mainPin.offsetTop - shift.y) + 'px';
      }
      if (pinX > -(window.data.mainPin.offsetWidth / 2) && pinX < window.data.WINDOW_WIDTH - window.data.mainPin.offsetWidth / 2) {
        window.data.mainPin.style.left = (window.data.mainPin.offsetLeft - shift.x) + 'px';
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
})();
