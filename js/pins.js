'use strict';
(function () {
  var PIN_LIMIT = 5;
  var pins = document.querySelector('.map__pins');
  // window.announcements = null;
  var main = document.querySelector('main');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // сохраняем в переменную шаблон пина

  var closePopup = function (popup) {
    popup.classList.add('hidden');
  };

  var renderPin = function (announcement, element, announcementIndex) { // заполняет шаблон объявления данными
    element.querySelector('img').src = announcement.author.avatar;
    element.style.top = announcement.location.y + 'px';
    element.style.left = announcement.location.x + 'px';
    element.querySelector('img').alt = announcement.offer.type;
    element.dataset.id = announcementIndex;

    var pinClickHandler = function (evt) { // функция фставки попапа в дом (для обработчика при клике на пин).
      var card = window.data.map.querySelector('.popup');
      var index = evt.currentTarget.dataset.id;
      var newCard = window.renderCard(window.announcements[index]);
      var filtersContainer = window.data.map.querySelector('.map__filters-container');
      if (window.data.map.contains(card)) {
        window.data.map.replaceChild(card, newCard);
      } else {
        window.data.map.insertBefore(newCard, filtersContainer);
      }
      newCard = window.data.map.querySelector('.popup');
      var popupCloseBtnHandler = function () {
        closePopup(newCard);
      };
      var popupCloseOnEscPress = function (evt) {
        if (evt.keyCode === window.data.ESC) {
          closePopup(newCard);
          document.removeEventListener('keydown', popupCloseOnEscPress);
        }
      };
      var closePopupBtn = newCard.querySelector('.popup__close');
      closePopupBtn.addEventListener('click', popupCloseBtnHandler);
      document.addEventListener('keydown', popupCloseOnEscPress);
    };

    element.addEventListener('click', pinClickHandler);

    return element;
  };

  var createPins = function (elements, node) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < elements.length; i++) {
      var pin = node.cloneNode(true);
      fragment.appendChild(renderPin(elements[i], pin, i));
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


  var successHandler = function (data) {
    window.announcements = data;
    createPins(window.announcements.slice(0, PIN_LIMIT), pinTemplate);
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
