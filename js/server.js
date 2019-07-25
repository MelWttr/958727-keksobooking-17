'use strict';

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var Code = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED_USER: 401,
    NOT_FOUND: 404
  };

  var TIMEOUT = 10000;

  var setup = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var message;
      switch (xhr.status) {
        case Code.SUCCESS:
          window.responseObject = xhr.response;
          onSuccess();
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
    xhr.timeout = TIMEOUT;
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'сек');
    });

    return xhr;
  };

  var download = function (onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('GET', DOWNLOAD_URL);
    xhr.send();
  };

  var upload = function (data, onSuccess, onError) {
    var xhr = setup(onSuccess, onError);
    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  window.server = {
    download: download,
    upload: upload
  };
})();
