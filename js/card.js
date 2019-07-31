'use strict';

(function () {
  var types = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом'
  };
  var numToString = function (number, forms) { // функция возвращает правильную форму слова в зависимости от числа
    var numberOne = Math.abs(number) % 100;
    var numberTwo = number % 10;
    if (numberOne > 10 && numberOne < 20) {
      return forms[2];
    } else if (numberTwo > 1 && numberTwo < 5) {
      return forms[1];
    } else if (numberTwo === 1) {
      return forms[0];
    } else {
      return forms[2];
    }
  };

  var renderCard = function (cardSource) {
    var popupTemplate = document.querySelector('#card').content;
    var cardTemplate = popupTemplate.cloneNode(true);
    cardTemplate.querySelector('img').src = cardSource.author.avatar;
    cardTemplate.querySelector('.popup__title').textContent = cardSource.offer.title;
    cardTemplate.querySelector('.popup__text--address').textContent = cardSource.offer.address;
    cardTemplate.querySelector('.popup__text--price').textContent = cardSource.offer.price + '₽/ночь';
    cardTemplate.querySelector('.popup__type').textContent = types[cardSource.offer.type];

    var numberOfRooms = cardSource.offer.rooms;
    var numberOfGuests = cardSource.offer.guests;
    var room = numToString(numberOfRooms, ['комната', 'комнаты', 'комнат']);
    var guest = numToString(numberOfGuests, ['гостя', 'гостей', 'гостей']);

    cardTemplate.querySelector('.popup__text--capacity').textContent = numberOfRooms + ' ' + room + ' для ' + numberOfGuests + ' ' + guest;

    cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardSource.offer.checkin + ', выезд до ' + cardSource.offer.checkout;

    var renderFeatutes = function (featuresList) {
      var feauturesListFragment = document.createDocumentFragment();
      var newFeaturesList = document.createElement('ul');
      newFeaturesList.className = 'popup__features';
      featuresList.forEach(function (featureItem) {
        var li = document.createElement('li');
        li.className = 'popup__feature popup__feature--' + featureItem;
        li.textContent = featureItem;
        feauturesListFragment.appendChild(li);
      });
      newFeaturesList.appendChild(feauturesListFragment);

      return newFeaturesList;
    };

    var features = cardSource.offer.features;
    var popupFeatures = cardTemplate.querySelector('.popup__features');
    popupFeatures.replaceWith(renderFeatutes(features));

    cardTemplate.querySelector('.popup__description').textContent = cardSource.offer.description;
    var photos = cardSource.offer.photos;
    var popupPhotos = cardTemplate.querySelector('.popup__photos');
    var popupPhoto = popupPhotos.querySelector('.popup__photo');
    popupPhoto.src = photos[0];
    if (photos.length > 1) {
      var images = document.createDocumentFragment();
      for (var i = 1; i < photos.length; i++) {
        var image = popupPhoto.cloneNode(true);
        image.src = photos[i];
        images.appendChild(image);
      }
      popupPhotos.appendChild(images);
    }
    return cardTemplate;
  };


  window.insertCard = function (cardSources, index) {
    var card = window.data.map.querySelector('.map__card');
    var cardSource = cardSources[index];
    var newCard = renderCard(cardSource);
    var filtersContainer = window.data.map.querySelector('.map__filters-container');
    if (window.data.map.contains(card)) {
      window.data.map.replaceChild(newCard, card);
    } else {
      window.data.map.insertBefore(newCard, filtersContainer);
    }
    closePopupHandler();
  };

  var closePopupEscHandler = function (evt) {
    if (evt.keyCode === window.data.ESC) {
      closePopup();
    }
  };

  var closePopup = function () {
    var card = window.data.map.querySelector('.popup');
    card.classList.add('hidden');
    document.removeEventListener('keydown', closePopupEscHandler);
    window.pins.deactivatePin();
  };

  var closePopupHandler = function () {
    var card = window.data.map.querySelector('.popup');
    var closePopupBtn = card.querySelector('.popup__close');
    closePopupBtn.addEventListener('click', closePopup);
    document.addEventListener('keydown', closePopupEscHandler);
  };

})();

