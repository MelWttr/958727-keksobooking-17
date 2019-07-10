'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';

  window.download = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var message;
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        case 400:
          message = 'Неверный запрос';
          break;
        case 401:
          message = 'Пользователь не авторизован';
          break;
        case 404:
          message = 'Страница не найдена';
          break;
        default:
          message = xhr.status + ' ' + xhr.statusText;
      }
      if (message) {
        onError(message);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    xhr.timeout = 10000;
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'сек');
    });
    xhr.open('GET', URL);
    xhr.send();
  };
})();
