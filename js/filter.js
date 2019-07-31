'use strict';

(function () {
  var PriceValues = {
    LOW: 10000,
    HIGH: 50000
  };

  var DELAY_TIME = 500;

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
    return elementCurrentValue === 'any' ? true : requiredElementValue === elementCurrentValue;
  };

  var filterElements = function (element) {
    return filterValues(element['offer']['type'], accomodationType.value)
      && filterValues(element['offer']['rooms'], accomodationRoomsQuantity.value)
      && filterValues(element['offer']['guests'], accomodationGuestsQuantity.value)
      && filterByFeatures(element, requiredFeatures)
      && ((accomodationPrice.value === 'any') ? true : filterByPrice(element));
  };

  var filterChangeHandler = function () {
    var pinsData = [];
    var count = (window.responseObject.length < window.pins.PIN_LIMIT) ? window.responseObject.length : window.pins.PIN_LIMIT;
    for (var i = 0; i < window.responseObject.length; i++) {
      if (pinsData.length === count) {
        break;
      } else if (filterElements(window.responseObject[i])) {
        pinsData.push(window.responseObject[i]);
      }
    }
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var card = document.querySelector('.map__card');
    mapPins.forEach(function (element) {
      element.remove();
    });
    if (card) {
      card.remove();
    }
    window.debounceTimeout(window.pins.createPins, DELAY_TIME, pinsData);
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


// var filterChangeHandler = function () {
//   var pinsData = [];
//   var count = (window.responseObject.length < window.pins.PIN_LIMIT) ? window.responseObject.length : window.pins.PIN_LIMIT;

//   for (var i = 0; i < window.responseObject.length; i++) {
//     if (pinsData.length === count) {
//       break;
//     } else if (filterElements(window.responseObject[i])) {
//       pinsData.push(window.responseObject[i]);
//     }
//   }


//   var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
//   var card = document.querySelector('.map__card');
//   mapPins.forEach(function (element) {
//     element.remove();
//   });
//   if (card) {
//     card.remove();
//   }
//   window.debounceTimeout(window.pins.createPins, DELAY_TIME, pinsData);
// };
