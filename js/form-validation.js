'use strict';
(function () {
  // хранит минимальные стоимости за ночь для разных типов жилья
  var MIN_PRICES = {
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

  var field = form.querySelector('.ad-form-header__input');
  var fieldSets = form.querySelectorAll('.ad-form__element');

  //  переключает все поля формы на странице из активного в неактивное состояние и наоборот
  var toggleFields = function (isDisabled) {
    toggleElement(field, isDisabled);
    for (var i = 0; i < fieldSets.length; i++) {
      toggleElement(fieldSets[i], isDisabled);
    }
  };

  toggleFields(true); // выключает все поля в форме

  var mainPin = window.data.map.querySelector('.map__pin--main');

  // возвращает строку с координатами x и y для записи в поле адрес
  var makeAddressValue = function (x, y) {
    return x + ',' + y;
  };

  // заполняет поле с адресом координатами главного пина
  address.value = makeAddressValue(window.data.getX(mainPin, mainPin.offsetWidth / 2), window.data.getY(mainPin, mainPin.offsetHeight / 2));

  // устанавливаем первоначальные значения полей тип и цена за ночь
  price.min = MIN_PRICES[type.value];
  price.placeholder = MIN_PRICES[type.value];

  // синхронизируем поля тип и цена за ночь
  type.onchange = function () {
    price.min = MIN_PRICES[this.value];
    price.placeholder = MIN_PRICES[this.value];
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

  window.formValidation = {
    mainPin: mainPin,
    address: address,
    form: form,
    toggleFields: toggleFields,
    makeAddressValue: makeAddressValue
  };
})();

