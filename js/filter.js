'use strict';

(function () {
  var PriceValues = {
    LOW: 10000,
    HIGH: 50000
  };

  var requiredFeatures = [];

  var filtersForm = document.querySelector('.map__filters');
  var accomodationType = filtersForm.querySelector('#housing-type');
  var accomodationPrice = filtersForm.querySelector('#housing-price');
  var accomodationRoomsQuantity = filtersForm.querySelector('#housing-rooms');
  var accomodationGuestsQuantity = filtersForm.querySelector('#housing-guests');
  var accomodationFeatures = filtersForm.querySelectorAll('.map__checkbox');
  var accomodationOffers = [accomodationType, accomodationPrice, accomodationRoomsQuantity, accomodationGuestsQuantity];

  var filterByPrice = function (element) {
    switch (accomodationPrice.value) {
      case 'low':
        return element['offer']['price'] < PriceValues.LOW;
      case 'middle':
        return element['offer']['price'] >= PriceValues.LOW && element['offer']['price'] <= PriceValues.HIGH;
      case 'high':
        return element['offer']['price'] > PriceValues.HIGH;
    }
    return false;
  };

  var filterByFeatures = function (element, features) {
    for (var i = 0; i < features.length; i++) {
      if (element['offer']['features'].indexOf(features[i]) === -1) {
        return false;
      }
    }
    return true;
  };

  var filterValues = function (requiredElementValue, elementCurrentValue) {
    if (!isNaN(elementCurrentValue)) {
      elementCurrentValue = +elementCurrentValue;
    }
    return elementCurrentValue === 'any' ? true : requiredElementValue === elementCurrentValue;
  };

  var filterElements = function (element) {
    return filterValues(element['offer']['type'], accomodationType.value)
      && filterValues(element['offer']['rooms'], accomodationRoomsQuantity.value)
      && filterValues(element['offer']['guests'], accomodationGuestsQuantity.value)
      && filterByFeatures(element, requiredFeatures)
      && (accomodationPrice.value === 'any') ? true : filterByPrice(element);
  };

  var filterChangeHandler = function () {
    var pinsData = window.responseObject.filter(filterElements).slice(0, window.pins.PIN_LIMIT);

    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPins.forEach(function (element) {
      element.remove();
    });
    window.debounce(pinsData, window.pins.createPins);
  };

  accomodationOffers.forEach(function (accomodationOffer) {
    accomodationOffer.addEventListener('change', filterChangeHandler);
  });

  var fillRequiredFeatures = function () {
    requiredFeatures = [];
    accomodationFeatures.forEach(function (accomodationFeature) {
      if (accomodationFeature.checked) {
        requiredFeatures.push(accomodationFeature.value);
      }
    });
  };

  accomodationFeatures.forEach(function (accomodationFeature) {
    accomodationFeature.addEventListener('change', function () {
      fillRequiredFeatures();
      filterChangeHandler();
    });
  });

})();
