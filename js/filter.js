'use strict';

(function () {
  var PriceValue = {
    LOW: 10000,
    HIGH: 50000
  };

  var DELAY_TIME = 500;

  var requiredFeatures = [];

  var filtersForm = window.data.map.querySelector('.map__filters');
  var accomodationType = filtersForm.querySelector('#housing-type');
  var accomodationPrice = filtersForm.querySelector('#housing-price');
  var accomodationRoomsQuantity = filtersForm.querySelector('#housing-rooms');
  var accomodationGuestsQuantity = filtersForm.querySelector('#housing-guests');
  var accomodationFeatures = filtersForm.querySelectorAll('.map__checkbox');
  var accomodationOffers = [accomodationType, accomodationPrice, accomodationRoomsQuantity, accomodationGuestsQuantity];

  var setFilterAvailability = function (isDisabled) {
    accomodationOffers.forEach(function (offer) {
      window.data.setElementAvailability(offer, isDisabled);
    });
    accomodationFeatures.forEach(function (feature) {
      window.data.setElementAvailability(feature, isDisabled);
    });
  };

  setFilterAvailability(true);


  var filterByPrice = function (element) {
    switch (accomodationPrice.value) {
      case 'low':
        return element['offer']['price'] < PriceValue.LOW;
      case 'middle':
        return element['offer']['price'] >= PriceValue.LOW && element['offer']['price'] <= PriceValue.HIGH;
      case 'high':
        return element['offer']['price'] > PriceValue.HIGH;
      default:
        return false;
    }
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
    return elementCurrentValue === 'any' || requiredElementValue === elementCurrentValue;
  };

  var filterElements = function (element) {
    return filterValues(element['offer']['type'], accomodationType.value)
      && filterValues(element['offer']['rooms'], accomodationRoomsQuantity.value)
      && filterValues(element['offer']['guests'], accomodationGuestsQuantity.value)
      && filterByFeatures(element, requiredFeatures)
      && accomodationPrice.value === 'any' || filterByPrice(element);
  };

  var filterChangeHandler = function () {
    var pinData = [];
    var count = (window.responseObject.length < window.pins.PIN_LIMIT) ? window.responseObject.length : window.pins.PIN_LIMIT;
    for (var i = 0; i < window.responseObject.length; i++) {
      if (pinData.length === count) {
        break;
      } else if (filterElements(window.responseObject[i])) {
        pinData.push(window.responseObject[i]);
      }
    }
    var mapPins = window.data.map.querySelectorAll('.map__pin:not(.map__pin--main)');
    var card = window.data.map.querySelector('.map__card');
    mapPins.forEach(function (element) {
      element.remove();
    });
    if (card) {
      card.remove();
    }
    window.debounceTimeout(window.pins.createPins, DELAY_TIME, pinData);
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

  window.filter = {
    setFilterAvailability: setFilterAvailability
  };

})();
