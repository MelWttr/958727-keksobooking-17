'use strict';
(function () {


  var pins = document.querySelector('.map__pins');
  window.announcements = null;
  var main = document.querySelector('main');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // сохраняем в переменную шаблон пина

  var renderPin = function (announcement, element) { // заполняет шаблон объявления данными
    element.querySelector('img').src = announcement.author.avatar;
    element.style.top = announcement.location.y + 'px';
    element.style.left = announcement.location.x + 'px';
    element.querySelector('img').alt = announcement.offer.type;

    return element;
  };

  var createPins = function (elements, node) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < elements.length; i++) {
      var pin = node.cloneNode(true);
      fragment.appendChild(renderPin(elements[i], pin));
    }
    pins.appendChild(fragment);
  };

  var successHandler = function (data) {
    window.announcements = data;
    createPins(window.announcements.slice(0, 5), pinTemplate);
  };

  var errorHandler = function (message) {
    var errorTemplate = document.querySelector('#error').content;
    var error = errorTemplate.querySelector('.error');
    var errorBtn = errorTemplate.querySelector('.error__button');
    var errorMsg = errorTemplate.querySelector('.error__message');
    errorMsg.textContent = message;
    main.appendChild(errorTemplate);
    error = document.querySelector('.error');
    window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.ESC) {
        error.classList.add('hidden');

      }
    });
    errorBtn.addEventListener('click', function () {
      window.data.refreshPage();
    });
  };

  var enablePage = function () { // функция делает страницу активной
    window.formValidation.toggleFields(false);
    window.data.map.classList.remove('map--faded');
    window.formValidation.form.classList.remove('ad-form--disabled');
    window.download(successHandler, errorHandler);
  };

  window.pins = {
    enablePage: enablePage,
    createPins: createPins,
    pinTemplate: pinTemplate
  };

})();

