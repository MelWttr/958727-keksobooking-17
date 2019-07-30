'use strict';
(function () {
  var PIN_LIMIT = 5;
  var pins = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // сохраняем в переменную шаблон пина

  var renderPin = function (announcement) { // заполняет шаблон объявления данными
    var element = pinTemplate.cloneNode(true);
    element.querySelector('img').src = announcement.author.avatar;
    element.style.top = announcement.location.y + 'px';
    element.style.left = announcement.location.x + 'px';
    element.querySelector('img').alt = announcement.offer.type;
    element.dataset.id = window.responseObject.indexOf(announcement);

    var pinClickHandler = function (evt) {
      var index = evt.currentTarget.dataset.id;
      window.insertCard(window.responseObject, index);
    };

    element.addEventListener('click', pinClickHandler);

    return element;
  };

  var createPins = function (elements) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < elements.length; i++) {
      fragment.appendChild(renderPin(elements[i]));
    }
    pins.appendChild(fragment);
  };

  var enablePage = function () { // функция делает страницу активной
    window.formValidation.setFieldsAvailability(false);
    window.data.map.classList.remove('map--faded');
    window.formValidation.form.classList.remove('ad-form--disabled');
    window.server.download(downloadSuccessHandler, errorHandler);
  };

  var downloadSuccessHandler = function () {
    createPins(window.responseObject.slice(0, PIN_LIMIT));
  };

  var errorHandler = function (message) {
    var errorTemplate = document.querySelector('#error').content;
    window.data.main.appendChild(errorTemplate);
    var error = document.querySelector('.error');
    var errorBtn = error.querySelector('.error__button');
    var errorMsg = error.querySelector('.error__message');
    errorMsg.textContent = message;

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === window.data.ESC) {
        window.data.deletePopup(error);
        document.removeEventListener('keydown', onPopupEscPress);
      }
    };

    errorBtn.addEventListener('click', function () {
      window.data.deletePopup(error);
    });
    error.addEventListener('click', function () {
      window.data.deletePopup(error);
    });

    document.addEventListener('keydown', onPopupEscPress);
  };

  window.pins = {
    PIN_LIMIT: PIN_LIMIT,
    enablePage: enablePage,
    createPins: createPins,
    pinTemplate: pinTemplate,
    errorHandler: errorHandler
  };

})();
