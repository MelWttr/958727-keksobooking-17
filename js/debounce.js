'use strict';

(function () {
  var lastTimeout;
  window.debounceTimeout = function (callback, timeout, params) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      callback(params);
    }, timeout);
  };
})();
