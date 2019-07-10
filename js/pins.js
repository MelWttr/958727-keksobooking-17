'use strict';
(function () {

  var announcements = []; // сюда буем складывать объявления
  var pins = document.querySelector('.map__pins');
  var main = document.querySelector('main');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // сохраняем в переменную шаблон пина

  var renderPin = function (announcement, element) { // заполняет шаблон объявления данными
    element.querySelector('img').src = announcement.author.avatar;
    element.style.top = announcement.location.y + 'px';
    element.style.left = announcement.location.x + 'px';
    element.querySelector('img').alt = announcement.offer.type;

    return element;
  };

  var successHandler = function (data) {
    var fragment = document.createDocumentFragment();
    announcements = data;
    for (var i = 0; i < announcements.length; i++) {
      var announcement = pinTemplate.cloneNode(true);
      fragment.appendChild(renderPin(announcements[i], announcement));
    }
    pins.appendChild(fragment);
  };

  var errorHandler = function (message) {
    var error = document.querySelector('#error').content;
    var errorBtn = error.querySelector('.error__button');
    var errorMsg = error.querySelector('.error__message');
    errorMsg.textContent = message;
    main.appendChild(error);
    errorBtn.addEventListener('click', function () {
      window.data.refreshPage();
    });
  };

  window.enablePage = function () { // функция делает страницу активной
    window.formValidation.toggleFields(false);
    window.data.map.classList.remove('map--faded');
    window.formValidation.form.classList.remove('ad-form--disabled');
    window.download(successHandler, errorHandler);
  };

})();

