'use strict';

(function () {
  var offerTypeEnToRu = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом'
  };
  var pluralize = function (number, forms) { // функция возвращает правильную форму слова в зависимости от числа
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

  var checkFieldAvailability = function (source, element) {
    if (source) {
      element.textContent = source;
    } else {
      element.style.display = 'none';
    }
  };

  var popupTemplate = document.querySelector('#card').content;

  var renderFeatutes = function (featureList) {
    var feautureListFragment = document.createDocumentFragment();
    var newFeatureList = document.createElement('ul');
    newFeatureList.className = 'popup__features';
    featureList.forEach(function (featureItem) {
      var li = document.createElement('li');
      li.className = 'popup__feature popup__feature--' + featureItem;
      li.textContent = featureItem;
      feautureListFragment.appendChild(li);
    });
    newFeatureList.appendChild(feautureListFragment);

    return newFeatureList;
  };

  var renderPhotos = function (photosContainer, sourceElement) {
    var photos = sourceElement.offer.photos;
    var popupPhoto = photosContainer.querySelector('.popup__photo');
    if (photos && photos.length > 0) {
      popupPhoto.src = photos[0];
      if (photos.length > 1) {
        var images = document.createDocumentFragment();
        for (var i = 1; i < photos.length; i++) {
          var image = popupPhoto.cloneNode(true);
          image.src = photos[i];
          images.appendChild(image);
        }
        photosContainer.appendChild(images);
      }
    } else {
      photosContainer.style.display = 'none';
    }
  };

  var renderCard = function (cardSource) {
    var cardTemplate = popupTemplate.cloneNode(true);
    var cardAvatar = cardTemplate.querySelector('img');
    var cardTitle = cardTemplate.querySelector('.popup__title');
    var cardAddress = cardTemplate.querySelector('.popup__text--address');
    var cardPrice = cardTemplate.querySelector('.popup__text--price');
    var cardType = cardTemplate.querySelector('.popup__type');
    if (cardSource.author.avatar) {
      cardAvatar.src = cardSource.author.avatar;
    } else {
      cardAvatar.style.display = 'none';
    }

    if (cardSource.offer.price) {
      cardPrice.src = cardSource.offer.price + '₽/ночь';
    } else {
      cardPrice.style.display = 'none';
    }
    checkFieldAvailability(cardSource.offer.title, cardTitle);
    checkFieldAvailability(cardSource.offer.address, cardAddress);
    checkFieldAvailability(offerTypeEnToRu[cardSource.offer.type], cardType);

    var numberOfRooms = cardSource.offer.rooms;
    var numberOfGuests = cardSource.offer.guests;
    var room = pluralize(numberOfRooms, ['комната', 'комнаты', 'комнат']);
    var guest = pluralize(numberOfGuests, ['гостя', 'гостей', 'гостей']);

    cardTemplate.querySelector('.popup__text--capacity').textContent = numberOfRooms + ' ' + room + ' для ' + numberOfGuests + ' ' + guest;
    cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardSource.offer.checkin + ', выезд до ' + cardSource.offer.checkout;

    var features = cardSource.offer.features;
    var popupFeatures = cardTemplate.querySelector('.popup__features');
    if (features && features.length > 0) {
      popupFeatures.replaceWith(renderFeatutes(features));
    } else {
      popupFeatures.style.display = 'none';
    }

    cardTemplate.querySelector('.popup__description').textContent = cardSource.offer.description;
    var popupPhotos = cardTemplate.querySelector('.popup__photos');

    renderPhotos(popupPhotos, cardSource);

    return cardTemplate;
  };

  var filtersContainer = window.data.map.querySelector('.map__filters-container');

  window.insertCard = function (cardSources, index) {
    var card = window.data.map.querySelector('.map__card');
    var cardSource = cardSources[index];
    var newCard = renderCard(cardSource);
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

