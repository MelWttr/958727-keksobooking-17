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

  var clearForm = function () {
    form.title.textContent = '';
    type.value = 'flat';
    form.timein.selectedIndex = 0;
    form.timeout.selectedIndex = 0;
    roomNumber.value = 1;
    roomCapacity.value = 1;
    features.forEach(function (feature) {
      feature.checked = false;
    });
    form.description.textContent = '';
    toggleFields(true);
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
    toggleFields: toggleFields,
    clearForm: clearForm,
    address: address,
    form: form,
    makeAddressValue: makeAddressValue
  };
})();

