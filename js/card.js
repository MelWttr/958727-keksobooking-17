'use strict';

(function () {
  var types = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом'
  };
  var numTostring = function (number, forms) {
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
  window.renderCard = function (array) {
    var cardSource = array[0];
    var cardTemplate = document.querySelector('#card').content;
    cardTemplate.querySelector('img').src = cardSource.author.avatar;
    cardTemplate.querySelector('.popup__title').textContent = cardSource.offer.title;
    cardTemplate.querySelector('.popup__text--address').textContent = cardSource.offer.address;
    cardTemplate.querySelector('.popup__text--price').textContent = cardSource.offer.price + '₽/ночь';
    cardTemplate.querySelector('.popup__type').textContent = types[cardSource.offer.type];
    cardTemplate.querySelector('.popup__text--capacity').textContent = cardSource.offer.rooms + ' ' + numTostring(cardSource.offer.rooms, ['комната', 'комнаты', 'комнат']) + ' для ' + cardSource.offer.guests + ' ' + numTostring(cardSource.offer.rooms, ['гостя', 'гостей', 'гостей']);
    cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardSource.offer.checkin + ', выезд до ' + cardSource.offer.checkout;
    var features = cardSource.offer.features;
    var popupFeatures = cardTemplate.querySelector('.popup__features');
    features.forEach(function (feature) {
      try {
        cardTemplate.querySelector('.popup__feature--' + feature).textContent = feature;
      } catch (error) {
        var li = document.createElement('li');
        li.className = 'popup__feature popup__feature--' + feature;
        li.textContent = feature;
        popupFeatures.appendChild(li);
      }
    });
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
    window.data.map.insertBefore(cardTemplate, window.data.map.querySelector('.map__filters-container'));
  };
})();

