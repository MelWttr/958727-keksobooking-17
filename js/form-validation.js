'use strict';
(function () {
  // хранит минимальные стоимости за ночь для разных типов жилья
  var minPrices = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var form = document.querySelector('.ad-form');
  var address = form.querySelector('#address');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var features = form.querySelectorAll('.feature__checkbox');

  // переключает поле из активного в неактивное состояние и наоборот
  var setElementAvailability = function (field, isDisabled) {
    field.disabled = isDisabled;
  };

  var formInputElement = form.querySelector('.ad-form-header__input');
  var formElements = form.querySelectorAll('.ad-form__element');

  //  переключает все поля формы на странице из активного в неактивное состояние и наоборот
  var setFieldsAvailability = function (isDisabled) {
    setElementAvailability(formInputElement, isDisabled);
    for (var i = 0; i < formElements.length; i++) {
      setElementAvailability(formElements[i], isDisabled);
    }
  };

  setFieldsAvailability(true); // выключает все поля в форме

  // возвращает строку с координатами x и y для записи в поле адрес
  var makeAddressValue = function (x, y) {
    return x + ',' + y;
  };

  // заполняет поле с адресом координатами главного пина
  address.value = makeAddressValue(window.data.getX(window.data.mainPin, window.data.mainPin.offsetWidth / 2), window.data.getY(window.data.mainPin, window.data.mainPin.offsetHeight / 2));

  // устанавливаем первоначальные значения полей тип и цена за ночь
  price.min = minPrices[type.value];
  price.placeholder = minPrices[type.value];

  // синхронизируем поля тип и цена за ночь
  type.onchange = function () {
    price.min = minPrices[this.value];
    price.placeholder = minPrices[this.value];
  };

  // устанавливаем первоначальные значения полей дат заезда и выезда
  form.timein.value = form.timeout.value;

  // синхронизируем дату заезда и выезда
  form.onchange = function (evt) {
    if (evt.target.name === 'timein') {
      this.timeout.value = evt.target.value;
    }
    if (evt.target.name === 'timeout') {
      this.timein.value = evt.target.value;
    }
  };

  var roomQuantity = form.querySelector('#room_number');
  var guestQuantity = form.querySelector('#capacity');

  // проверяет правильность заполнения полей количества комнат и гостей
  var quantityValidation = function (roomQuantityValue, guestQuantityValue) {
    if ((roomQuantityValue === 100 && guestQuantityValue > 0) || (roomQuantityValue < 100 && guestQuantityValue === 0) || (roomQuantityValue < guestQuantityValue)) {
      return 'недопустимое кол-во';
    }
    return '';
  };

  var roomChangeHandler = function (evt) {
    roomQuantity.setCustomValidity(quantityValidation(parseInt(evt.target.value, 10), parseInt(guestQuantity.value, 10)));
  };
  var capacityChangeHandler = function (evt) {
    roomQuantity.setCustomValidity(quantityValidation(parseInt(roomQuantity.value, 10), parseInt(evt.target.value, 10)));
  };

  roomQuantity.addEventListener('change', roomChangeHandler);
  guestQuantity.addEventListener('change', capacityChangeHandler);

  var clearForm = function () {
    form.title.textContent = '';
    type.value = 'flat';
    form.timein.selectedIndex = 0;
    form.timeout.selectedIndex = 0;
    roomQuantity.value = 1;
    guestQuantity.value = 1;
    features.forEach(function (feature) {
      feature.checked = false;
    });
    form.description.textContent = '';
    setFieldsAvailability(true);
    form.classList.add('ad-form--disabled');
  };

  var uploadFormSuccessHandler = function () {
    clearForm();
    window.data.clearMap();
    var successTemplate = document.querySelector('#success').content;
    window.data.main.appendChild(successTemplate);
    var success = document.querySelector('.success');

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === window.data.ESC) {
        window.data.deletePopup(success);
        document.removeEventListener('keydown', onPopupEscPress);
      }
    };

    success.addEventListener('click', function () {
      window.data.deletePopup(success);
    });

    document.addEventListener('keydown', onPopupEscPress);
  };

  var formSubmitHandler = function (evt) {
    evt.preventDefault();
    window.server.upload(new FormData(form), uploadFormSuccessHandler, window.pins.errorHandler);
  };

  form.addEventListener('submit', formSubmitHandler);

  window.formValidation = {
    clearForm: clearForm,
    address: address,
    form: form,
    setFieldsAvailability: setFieldsAvailability,
    makeAddressValue: makeAddressValue
  };
})();

