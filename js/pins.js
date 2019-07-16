'use strict';
(function () {
  var PIN_LIMIT = 5;
  var pins = document.querySelector('.map__pins');
  var main = document.querySelector('main');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // сохраняем в переменную шаблон пина

  var renderPin = function (announcement, announcementIndex) { // заполняет шаблон объявления данными
    var element = pinTemplate.cloneNode(true);
    element.querySelector('img').src = announcement.author.avatar;
    element.style.top = announcement.location.y + 'px';
    element.style.left = announcement.location.x + 'px';
    element.querySelector('img').alt = announcement.offer.type;
    element.dataset.id = announcementIndex;

    var pinClickHandler = function (evt) {
      var index = evt.currentTarget.dataset.id;
      window.insertCard(window.responseObject, index);
    };

    element.addEventListener('click', function (evt) {
      pinClickHandler(evt);
    });

    return element;
  };

  var createPins = function (elements) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < elements.length; i++) {
      fragment.appendChild(renderPin(elements[i], i));
    }
    pins.appendChild(fragment);
  };

  var deletePopup = function (popup) {
    popup.remove();
    disablePage();
  };

  var enablePage = function () { // функция делает страницу активной
    window.formValidation.toggleFields(false);
    window.data.map.classList.remove('map--faded');
    window.formValidation.form.classList.remove('ad-form--disabled');
    window.download(successHandler, errorHandler);
  };

  var disablePage = function () { // функция делает страницу неактивной
    window.formValidation.toggleFields(true);
    window.data.map.classList.add('map--faded');
    window.formValidation.form.classList.add('ad-form--disabled');
    window.data.isFirstMove = true;
    window.data.mainPin.style.top = '375px';
    window.data.mainPin.style.left = '570px';
  };


  var successHandler = function () {
    createPins(window.responseObject.slice(0, PIN_LIMIT));
  };

  var errorHandler = function (message) {
    var errorTemplate = document.querySelector('#error').content;
    main.appendChild(errorTemplate);
    var error = document.querySelector('.error');
    var errorBtn = error.querySelector('.error__button');
    var errorMsg = error.querySelector('.error__message');
    errorMsg.textContent = message;

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === window.data.ESC) {
        deletePopup(error);
        document.removeEventListener('keydown', onPopupEscPress);
      }
    };

    errorBtn.addEventListener('click', function () {
      deletePopup(error);
    });
    error.addEventListener('click', function () {
      deletePopup(error);
    });

    document.addEventListener('keydown', onPopupEscPress);
  };

  window.pins = {
    enablePage: enablePage,
    createPins: createPins,
    pinTemplate: pinTemplate
  };

})();
