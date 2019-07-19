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
  var type = document.querySelector('#type');
  var price = document.querySelector('#price');

  // переключает поле из активного в неактивное состояние и наоборот
  var toggleElement = function (field, isDisabled) {
    field.disabled = isDisabled;
  };

  var formInput = form.querySelector('.ad-form-header__input');
  var formElements = form.querySelectorAll('.ad-form__element');

  //  переключает все поля формы на странице из активного в неактивное состояние и наоборот
  var toggleFields = function (isDisabled) {
    toggleElement(formInput, isDisabled);
    for (var i = 0; i < formElements.length; i++) {
      toggleElement(formElements[i], isDisabled);
    }
  };

  toggleFields(true); // выключает все поля в форме

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

  var roomNumber = form.querySelector('#room_number');
  var roomCapacity = form.querySelector('#capacity');

  // проверяет правильность заполнения полей количества комнат и гостей
  var numberValidity = function (roomValue, capacityValue) {
    var message = '';
    if (roomValue === 100 && capacityValue === 0) {
      return message;
    } else if ((capacityValue > roomValue) || roomValue === 100 || capacityValue === 0) {
      message = 'недопустимое кол-во';
    }
    return message;
  };

  var roomChangeHandler = function (evt) {
    roomNumber.setCustomValidity(numberValidity(parseInt(evt.target.value, 10), parseInt(roomCapacity.value, 10)));
  };

  var capacityChangeHandler = function (evt) {
    roomNumber.setCustomValidity(numberValidity(parseInt(roomNumber.value, 10), parseInt(evt.target.value, 10)));
  };

  roomNumber.addEventListener('change', roomChangeHandler);
  roomCapacity.addEventListener('change', capacityChangeHandler);

  window.formValidation = {
    address: address,
    form: form,
    toggleFields: toggleFields,
    makeAddressValue: makeAddressValue
  };
})();

