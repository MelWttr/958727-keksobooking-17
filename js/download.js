'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';

  window.download = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });
    xhr.open('GET', URL);
    xhr.send();
  };
})();
