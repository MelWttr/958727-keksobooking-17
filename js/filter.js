'use strict';

(function () {
  var filtersForm = document.querySelector('.map__filters');
  var accomodationType = filtersForm.querySelector('#housing-type');
  var filterElements = function (elements, filterType, filterTypeItem, filterValue) {
    return elements.filter(function (element) {
      return element[filterType][filterTypeItem] === filterValue;
    });
  };
  accomodationType.addEventListener('change', function () {
    var filteredItems = accomodationType.value === 'any' ? window.announcements.slice(0, 5) : filterElements(window.announcements, 'offer', 'type', accomodationType.value);

    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPins.forEach(function (element) {
      element.remove();
    });
    window.pins.createPins(filteredItems, window.pins.pinTemplate);
  });
})();
