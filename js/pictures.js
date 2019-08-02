'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarFileChooser = window.formValidation.form.querySelector('#avatar');
  var avatarImage = window.formValidation.form.querySelector('.ad-form-header__preview img');
  var flatPicturesChooser = window.formValidation.form.querySelector('#images');
  var photosContainer = window.formValidation.form.querySelector('.ad-form__photo');

  var createReader = function (fileToRead) {
    var fileName = fileToRead.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (!matches) {
      return window.pins.errorHandler('ошибка загрузки файла');
    }
    return new FileReader();
  };

  avatarFileChooser.addEventListener('change', function () {
    var file = avatarFileChooser.files[0];
    var reader = createReader(file);
    if (reader) {
      reader.addEventListener('load', function () {
        avatarImage.src = reader.result;
      });
      reader.readAsDataURL(file);
    }

  });

  flatPicturesChooser.addEventListener('change', function () {
    var files = Array.from(flatPicturesChooser.files);
    files.forEach(function (file) {
      var reader = createReader(file);
      if (reader) {
        reader.addEventListener('load', function () {
          var element = document.createElement('img');
          element.src = reader.result;
          element.width = 70;
          element.height = 70;
          photosContainer.appendChild(element);
        });
        reader.readAsDataURL(file);
        window.data.images.push(file);
      }
    });

  });

})();
