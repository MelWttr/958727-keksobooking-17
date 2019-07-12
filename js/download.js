'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';

  var Code = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED_USER: 401,
    NOT_FOUND: 404
  };

  window.download = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var message;
      switch (xhr.status) {
        case Code.SUCCESS:
          onSuccess(xhr.response);
          break;
        case Code.BAD_REQUEST:
          message = 'Неверный запрос';
          break;
        case Code.UNAUTHORIZED_USER:
          message = 'Пользователь не авторизован';
          break;
        case Code.NOT_FOUND:
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
