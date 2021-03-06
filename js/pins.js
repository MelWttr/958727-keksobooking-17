'use strict';
(function () {
  var PIN_LIMIT = 5;
  var pinContainer = document.querySelector('.map__pins');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // сохраняем в переменную шаблон пина

  var renderPin = function (announcement) { // заполняет шаблон объявления данными
    var element = pinTemplate.cloneNode(true);
    var avatar = element.querySelector('img');
    avatar.src = announcement.author.avatar;
    element.style.top = announcement.location.y + 'px';
    element.style.left = announcement.location.x + 'px';
    avatar.alt = announcement.offer.type;
    element.dataset.id = window.responseObject.indexOf(announcement);

    var pinClickHandler = function (evt) {
      var index = evt.currentTarget.dataset.id;
      window.insertCard(window.responseObject, index);
      deactivatePin();
      evt.currentTarget.classList.add('map__pin--active');
    };

    element.addEventListener('click', pinClickHandler);

    return element;
  };

  var createPins = function (elements) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].offer) {
        fragment.appendChild(renderPin(elements[i]));
      }
    }
    pinContainer.appendChild(fragment);
    window.filter.setFilterAvailability(false);
  };

  var deactivatePin = function () {
    var pinActive = document.querySelector('.map__pin--active');
    if (pinActive) {
      pinActive.classList.remove('map__pin--active');
    }
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

  var ErrorTemplate = document.querySelector('#error').content;

  var errorHandler = function (message) {
    var errorElement = ErrorTemplate.cloneNode(true);
    window.data.main.appendChild(errorElement);
    var error = window.data.main.querySelector('.error');
    var errorMsg = error.querySelector('.error__message');
    errorMsg.textContent = message;

    var deleteErrorPopup = function () {
      window.data.deletePopup(error);
    };

    var popupEscPressHandler = function (evt) {
      if (evt.keyCode === window.data.ESC) {
        deleteErrorPopup();
        document.removeEventListener('keydown', popupEscPressHandler);
      }
    };
    error.addEventListener('click', function () {
      deleteErrorPopup();
    });

    document.addEventListener('keydown', popupEscPressHandler);
  };

  window.pins = {
    PIN_LIMIT: PIN_LIMIT,
    enablePage: enablePage,
    createPins: createPins,
    deactivatePin: deactivatePin,
    pinTemplate: pinTemplate,
    errorHandler: errorHandler
  };

})();
