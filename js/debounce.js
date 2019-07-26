'use strict';

(function () {
  var TIMEOUT = 300;
  var lastTimeout;
  window.debounce = function (params, callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      callback(params);
    }, TIMEOUT);
  };
})();
