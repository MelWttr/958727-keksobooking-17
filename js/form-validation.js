'use strict';
(function () {
  // хранит минимальные стоимости за ночь для разных типов жилья
  var AVATAR_DEFAULT_IMAGE = 'img/muffin-grey.svg';
  var INVALID_FIELD_BORDER = '2px solid red';

  var offerTypeToMinPrice = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var form = document.querySelector('.ad-form');
  var address = form.querySelector('#address');
  var title = form.querySelector('#title');
  var description = form.querySelector('#description');
  var type = form.querySelector('#type');
  var price = form.querySelector('#price');
  var features = form.querySelectorAll('.feature__checkbox');
  var avatarImage = document.querySelector('.ad-form-header__preview img');
  var photosContainer = document.querySelector('.ad-form__photo');

  var formInputElement = form.querySelector('.ad-form-header__input');
  var formElements = form.querySelectorAll('.ad-form__element');

  //  переключает все поля формы на странице из активного в неактивное состояние и наоборот
  var setFieldsAvailability = function (isDisabled) {
    window.data.setElementAvailability(formInputElement, isDisabled);
    for (var i = 0; i < formElements.length; i++) {
      window.data.setElementAvailability(formElements[i], isDisabled);
    }
  };

  setFieldsAvailability(true); // выключает все поля в форме

  var inputChangeHandler = function (evt) {
    if (evt.target.validity.valid === false) {
      evt.target.style.border = INVALID_FIELD_BORDER;
    } else {
      evt.target.style.border = 'none';
    }
  };

  title.addEventListener('input', inputChangeHandler);

  // возвращает строку с координатами x и y для записи в поле с адресом
  var getAddressValue = function (x, y) {
    return x + ',' + y;
  };

  // заполняет поле с адресом координатами главного пина
  address.value = getAddressValue(window.data.getElementCoordinateX(window.data.mainPin, window.data.mainPin.offsetWidth / 2), window.data.getElementCoordinateY(window.data.mainPin, window.data.mainPin.offsetHeight / 2));

  // устанавливаем первоначальные значения полей тип и цена за ночь
  price.min = offerTypeToMinPrice[type.value];
  price.placeholder = offerTypeToMinPrice[type.value];

  // синхронизируем поля тип и цена за ночь
  type.addEventListener('change', function () {
    price.min = offerTypeToMinPrice[type.value];
    price.placeholder = offerTypeToMinPrice[type.value];
    if (price.validity.valid === false) {
      price.style.border = INVALID_FIELD_BORDER;
    } else {
      price.style.border = 'none';
    }
  });

  price.addEventListener('input', inputChangeHandler);

  // устанавливаем первоначальные значения полей дат заезда и выезда
  form.timein.value = form.timeout.value;

  // синхронизируем дату заезда и выезда
  form.addEventListener('change', function (evt) {
    if (evt.target.name === 'timein') {
      form.timeout.value = evt.target.value;
    }
    if (evt.target.name === 'timeout') {
      form.timein.value = evt.target.value;
    }
  });

  var roomQuantity = form.querySelector('#room_number');
  var guestQuantity = form.querySelector('#capacity');

  // проверяет правильность заполнения полей количества комнат и гостей
  var quantityValidation = function (roomQuantityValue, guestQuantityValue, element) {
    if ((roomQuantityValue === 100 && guestQuantityValue > 0) || (roomQuantityValue < 100 && guestQuantityValue === 0) || (roomQuantityValue < guestQuantityValue)) {
      element.style.border = '2px solid red';
      return 'недопустимое кол-во';
    }
    element.style.border = 'none';
    return '';
  };

  var roomChangeHandler = function (evt) {
    roomQuantity.setCustomValidity(quantityValidation(parseInt(evt.target.value, 10), parseInt(guestQuantity.value, 10), roomQuantity));
  };
  var capacityChangeHandler = function (evt) {
    roomQuantity.setCustomValidity(quantityValidation(parseInt(roomQuantity.value, 10), parseInt(evt.target.value, 10), roomQuantity));
  };

  roomQuantity.addEventListener('change', roomChangeHandler);
  guestQuantity.addEventListener('change', capacityChangeHandler);

  var clearForm = function () {
    title.value = '';
    address.value = getAddressValue(window.data.getElementCoordinateX(window.data.mainPin, window.data.mainPin.offsetWidth / 2), window.data.getElementCoordinateY(window.data.mainPin, window.data.mainPin.offsetHeight / 2));
    type.value = 'flat';
    price.value = offerTypeToMinPrice[type.value];
    form.timein.selectedIndex = 0;
    form.timeout.selectedIndex = 0;
    roomQuantity.value = 1;
    guestQuantity.value = 1;
    features.forEach(function (feature) {
      feature.checked = false;
    });
    description.value = '';
    setFieldsAvailability(true);
    avatarImage.src = AVATAR_DEFAULT_IMAGE;
    var appartmentPhotos = Array.from(photosContainer.children);
    if (appartmentPhotos) {
      appartmentPhotos.forEach(function (appartmentPhoto) {
        appartmentPhoto.remove();
      });
    }

    form.classList.add('ad-form--disabled');
  };

  var returnPageToStartCondition = function () {
    window.data.clearMap();
    clearForm();
    window.data.isFirstMove = true;
    window.data.mainPin.addEventListener('click', window.mainPinClickHandler);
  };

  var popupTemplate = document.querySelector('#success').content;

  var uploadFormSuccessHandler = function () {
    returnPageToStartCondition();
    var successTemplate = popupTemplate.cloneNode(true);
    window.data.main.appendChild(successTemplate);
    var success = window.data.main.querySelector('.success');

    var popupEscPressHandler = function (evt) {
      if (evt.keyCode === window.data.ESC) {
        window.data.deletePopup(success);
        document.removeEventListener('keydown', popupEscPressHandler);
      }
    };

    success.addEventListener('click', function () {
      window.data.deletePopup(success);
    });

    document.addEventListener('keydown', popupEscPressHandler);
  };

  var formSubmitHandler = function (evt) {
    evt.preventDefault();
    var formData = new FormData(form);
    formData.delete('images');
    window.data.images.forEach(function (image) {
      formData.append('images', image);
    });
    window.server.upload(formData, uploadFormSuccessHandler, window.pins.errorHandler);
  };

  form.addEventListener('submit', formSubmitHandler);

  var resetBtn = form.querySelector('.ad-form__reset');
  resetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    returnPageToStartCondition();
  });

  window.formValidation = {
    clearForm: clearForm,
    address: address,
    form: form,
    setFieldsAvailability: setFieldsAvailability,
    getAddressValue: getAddressValue
  };
})();

