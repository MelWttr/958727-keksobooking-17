'use strict';
(function () {
  var PSEUDO_HEIGHT = 22;
  var isFirstMove = true;

  // далее описана логика перемещения пина по карте
  window.formValidation.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.formValidation.address.value = window.formValidation.makeAddressValue(window.data.getX(window.formValidation.mainPin, window.formValidation.mainPin.offsetWidth / 2), window.data.getY(window.formValidation.mainPin, window.formValidation.mainPin.offsetHeight + PSEUDO_HEIGHT)); // меняем значение в поле адреса на каждый мув
      if (isFirstMove) { // если первый мув, приводим страницу в активное состояние
        window.pins.enablePage();
        isFirstMove = false;
      }
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var pinY = window.formValidation.mainPin.offsetTop - shift.y;
      var pinX = window.formValidation.mainPin.offsetLeft - shift.x;

      // задаем границы перемещения пина по карте
      if (pinY >= (window.data.WINDOW_HEIGHT_MIN - (window.formValidation.mainPin.offsetHeight + PSEUDO_HEIGHT)) && pinY <= (window.data.WINDOW_HEIGHT_MAX - (window.formValidation.mainPin.offsetHeight + PSEUDO_HEIGHT))) {
        window.formValidation.mainPin.style.top = (window.formValidation.mainPin.offsetTop - shift.y) + 'px';
      }
      if (pinX > -(window.formValidation.mainPin.offsetWidth / 2) && pinX < window.data.WINDOW_WIDTH - window.formValidation.mainPin.offsetWidth / 2) {
        window.formValidation.mainPin.style.left = (window.formValidation.mainPin.offsetLeft - shift.x) + 'px';
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
