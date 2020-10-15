/**
 * Form components
 */
(function (factory) {
  if (!$) {
    throw 'formHelper requires jQuery to be loaded first';
  }
  factory();
})(function () {
  'use strict';

  var formHelper = function ($el, options) {
    const kilobyte = 1024;

    const byteUnit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    var lang = options.language;

    var helper = {};

    /**
     * Format file size for kilobyte
     *
     * @param {Number} size
     * @returns {String}
     */
    var formatBytes = function (size) {
      var index = size < 1 ? 0 : Math.floor(Math.log(size) / Math.log(kilobyte));
      return `${(size / Math.pow(kilobyte, index)).toFixed(2).toString()} ${byteUnit[index]}`;
    };

    /**
     * filePicker Exception
     *
     * @param {String} code
     * @param {JQuery} $filePicker
     */
    var filePickerException = function (code, $filePicker) {
      this.code = code;
      this.msg = lang[code];
      this.$filePicker = $filePicker;
      this.api = $filePicker.data('FilePicker');
    };

    /**
     * Get file picker template
     *
     * @param {*} config
     * @returns {JQuery}
     */
    var getFilePickerTmpl = function (config = {}) {
      var $filePicker;

      if (typeof options.templates.filePicker === 'function') {
        $filePicker = $(options.templates.filePicker(config));
      } else if (options.templates.filePicker) {
        $filePicker = $(options.templates.filePicker);
      } else {
        $filePicker = $('<div>')
          .addClass('fh-file-picker')
          .append(
            $('<button>')
              .attr({ type: 'button' })
              .addClass('btn btn-success fh-file-select')
              .append($('<span>').text(lang.selectFile).prepend($('<i>').addClass('fas fa-plus fa-fw')))
          )
          .append(
            $('<div>')
              .addClass('fh-file-block')
              .append($('<span>').addClass('fh-file-limit').text(lang.limitMsg))
              .append($('<span>').addClass('fh-file-unselect').text(lang.unselectFile))
              .append($('<div>').addClass('fh-file-list'))
          );
      }

      bindFilePickerEvent($filePicker, config);

      return $filePicker;
    };

    /**
     * Get file box template
     *
     * @param {*} configs
     * @returns {JQuery}
     */
    var getFileBoxTmpl = function (config = {}) {
      var $fileBox;

      if (typeof options.templates.fileBox === 'function') {
        $fileBox = $(options.templates.fileBox(config));
      } else if (options.templates.fileBox) {
        $fileBox = $(options.templates.fileBox);
      } else {
        var toolbar = [];

        $fileBox = $('<div>')
          .addClass('fh-file-box')
          .css('background-color', config.isInvalid ? '#FCDEDE' : '#F5F5F5');

        // add file input
        if (config.$fileInput) {
          $fileBox.append(
            config.$fileInput
              .attr({
                type: 'file',
                name: config.fileInput.name,
                accept: config.fileInput.accept,
                multiple: config.fileInput.multiple,
              })
              .addClass('fh-file-input')
              .hide()
          );
        }

        if (config.inputs) {
          // add hidden input
          $.each(config.inputs, function (idx, input) {
            $fileBox.append($('<input>').attr({ type: 'hidden', name: input.name, value: input.value }));
          });
        }

        if (config.files && config.files.length) {
          // add select files info text
          $.each(config.files, function (idx, file) {
            $fileBox.append(
              $('<span>')
                .addClass('fh-file-info')
                .text(`${file.name} (${formatBytes(file.size)})`)
                .prepend($('<i>').addClass('far fa-file fa-fw'))
            );
          });
        } else {
          // add selecting file prompt text
          $fileBox.append($('<span>').addClass('fh-file-info').text(lang.selectingFile));
        }

        // add invalid message
        if (config.isInvalid) {
          $fileBox.append($('<em>').text(options.language.invalidMsg));
        }

        // create modify icon
        if (config.canModify && config.$fileInput) {
          toolbar.push($('<span>').addClass('fh-file-modify').append($('<i>').addClass('fas fa-pen fa-fw')));
        }

        // create remove icon
        if (config.canRemove) {
          toolbar.push($('<span>').addClass('fh-file-remove').append($('<i>').addClass('fas fa-times fa-fw')));
        }

        // add toolbar
        if (toolbar.length) {
          $fileBox.append($('<div>').addClass('fh-file-toolbar').append(toolbar));
        }
      }

      bindFileBoxEvent($fileBox, config);

      return $fileBox;
    };

    /**
     * Get file size by filePicker
     *
     * @param {JQuery} $filePicker
     * @returns {Number}
     */
    var getFileSize = function ($filePicker) {
      var fileSize = 0;

      $.each($filePicker.find('.fh-file-input'), function () {
        $.each($(this).prop('files'), function (idx, file) {
          fileSize = fileSize + file.size;
        });
      });

      return fileSize;
    };

    /**
     * Get file count by filePicker
     *
     * @param {JQuery} $filePicker
     * @returns {Number}
     */
    var getFileCount = function ($filePicker) {
      var fileCount = 0;

      $.each($filePicker.find('.fh-file-input'), function () {
        fileCount = fileCount + $(this).prop('files').length;
      });

      return fileCount;
    };

    /**
     * FilePicker change event
     *
     * @param {*} config
     */
    var filePickerChange = function (config) {
      var $fileSelect = config.$filePicker.find('.fh-file-select');
      var $unselectMsg = config.$filePicker.find('.fh-file-unselect');
      var fileConut = getFileCount(config.$filePicker);

      // tigger no files selected message display
      if ($unselectMsg.length) {
        if (fileConut) {
          $unselectMsg.hide();
        } else {
          $unselectMsg.show();
        }
      }

      // tigger file select button
      if (fileConut >= config.maxFiles) {
        $fileSelect.attr('disabled', true);
      } else {
        $fileSelect.attr('disabled', false);
      }

      // tigger change callback
      if (typeof config.onChange === 'function') {
        config.onChange();
      }
    };

    /**
     * FileBox create event
     *
     * @param {*} config
     */
    var fileBoxCreate = function (config) {
      // tigger create callback
      if (typeof config.onCreate === 'function') {
        config.onCreate();
      }
    };

    /**
     * FileBox remove event
     *
     * @param {*} config
     */
    var fileBoxRemove = function (config) {
      // tigger remove callback
      if (typeof config.onRemove === 'function') {
        config.onRemove();
      }
    };

    /**
     * Bind FilePicker event
     *
     * @param {JQuery} $filePicker
     * @param {*} config
     */
    var bindFilePickerEvent = function ($filePicker, config) {
      var $fileList = $filePicker.find('.fh-file-list');
      var $fileSelect = $filePicker.find('.fh-file-select');
      var $fileInputFake = $('<input>').attr({
        type: 'file',
        accept: config.fileInput.accept,
        multiple: config.fileInput.multiple,
      });

      // create fileBox & trigger file select filePicker
      $fileSelect.on('click', function () {
        $fileInputFake.trigger('click');
      });

      // fileInputFake change render
      $fileInputFake.on('change.formhelper', function () {
        var files = $fileInputFake.prop('files');

        // if have select file
        if (files.length > 0) {
          // create new file box
          var newConfig = $.extend(true, {}, config, {
            files: files,
            $fileInput: $fileInputFake.clone(),
          });

          $fileList.append(getFileBoxTmpl(newConfig));

          // tigger fileBox create
          fileBoxCreate(newConfig);

          // tigger filePicker change
          filePickerChange(newConfig);
        }

        // reset fileInputFake
        $fileInputFake.prop('type', '').prop('type', 'file');
      });
    };

    /**
     * Bind FileBox event
     *
     * @param {JQuery} $fileBox
     * @param {*} config
     */
    var bindFileBoxEvent = function ($fileBox, config) {
      var $fileInput = $fileBox.find('.fh-file-input');
      var $modifyIcon = $fileBox.find('.fh-file-modify');
      var $removeIcon = $fileBox.find('.fh-file-remove');

      // fileInput change render
      $fileInput.on('change', function () {
        // if have select file
        if ($fileInput.prop('files').length > 0) {
          var newConfig = $.extend(true, {}, config, {
            files: $fileInput.prop('files'),
            $fileInput: $fileInput.clone(),
          });

          // insert new fileBox after ori fileBox
          $fileBox.after(getFileBoxTmpl(newConfig)).remove();
          // tigger filePicker change
          filePickerChange(newConfig);
        } else {
          // tigger fileBox remove
          fileBoxRemove(config);
          // tigger filePicker change
          filePickerChange(config);
          // if not select files remove fileBox
          $fileBox.remove();
        }
      });

      // modify fileBox
      $modifyIcon.on('click', function () {
        $fileInput.trigger('click');
      });

      // remove fileBox
      $removeIcon.on('click', function () {
        $fileBox.remove();
        // tigger fileBox remove
        fileBoxRemove(config);
        // tigger filePicker change
        filePickerChange(config);
      });
    };

    /**
     * Add FilePicker
     *
     * @param {*} config
     * @returns {JQuery}
     */
    helper.addFilePicker = function (config = {}) {
      // init filePicker config
      config = $.extend(true, {}, options.filePicker, config);

      // set parents filePicker
      config.$filePicker = getFilePickerTmpl(config);

      // set filePicker API
      config.api = {
        getSize: function (format = false) {
          var size = getFileSize(config.$filePicker);
          return format ? formatBytes(size) : size;
        },
        getCount: function () {
          return getFileCount(config.$filePicker);
        },
        addFileBox: function (fileBoxOpt = {}) {
          var $fileBox = getFileBoxTmpl($.extend(true, {}, config, fileBoxOpt));

          config.$filePicker.find('.fh-file-list').append($fileBox);

          // tigger fileBox create
          fileBoxCreate(newConfig);

          // tigger filePicker change
          filePickerChange(config);

          return $fileBox;
        },
      };

      $(config.container || $el).append(config.$filePicker);

      config.$filePicker.data('FilePicker', config.api);

      return config.api;
    };

    /**
     * Add FilePicker info
     *
     * @returns {Object}
     */
    helper.getFilePickerInfo = function () {
      var size = 0;
      var count = 0;

      $.each($el.find('.fh-file-picker'), function () {
        let $filePicker = $(this);
        size = size + getFileSize($filePicker);
        count = count + getFileCount($filePicker);
      });

      return {
        size: size,
        sizeHum: formatBytes(size),
        count: count,
      };
    };

    /**
     * Check form
     */
    helper.check = function () {
      try {
        var totalSize = 0;

        $.each($el.find('.fh-file-picker'), function () {
          let $filePicker = $(this);

          // continue undefined FilePicker
          if (!$filePicker.data('FilePicker')) {
            return;
          }

          totalSize = totalSize + getFileSize($filePicker);

          // check upload file size
          if (totalSize > options.filePicker.maxBytes) {
            throw new filePickerException('fileSizeOverload', $filePicker);
          }

          // check upload file count
          if (getFileCount($filePicker) > options.filePicker.maxFiles) {
            throw new filePickerException('fileCountOverload', $filePicker);
          }
        });
      } catch (filePickerError) {
        // fail callback
        if (typeof options.onFail === 'function') {
          options.onFail(filePickerError.code, lang[filePickerError.code] || '');
        } else {
          throw filePickerError;
        }
        return false;
      }
      return true;
    };

    /**
     * Submit form
     *
     * @param {String} url
     * @param {*} data
     */
    helper.submit = function (url, data = {}) {
      // check form data
      if (!this.check()) {
        return;
      }

      // init FormData
      var formData = new FormData($el.get(0));

      // append custom data
      if (!$.isEmptyObject(data)) {
        $.each(data, function (name, value) {
          if (Array.isArray(value)) {
            value.map(function (item) {
              formData.append(`${name}[]`, String(item));
            });
          } else {
            formData.append(name, String(value));
          }
        });
      }

      return $.ajax({
        url: url,
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        method: 'POST',
      });
    };

    return helper;
  };

  /**
   * jQuery plugin constructor
   */
  $.fn.formhelper = function (options) {
    this.each(function () {
      var $el = $(this);
      if (!$el.data('FormHelper')) {
        // create a private copy of the defaults object
        options = $.extend(true, {}, $.fn.formhelper.defaults, options);
        $el.data('FormHelper', formHelper($el, options));
      }
    });

    return this.data('FormHelper');
  };

  /**
   * jQuery defaults object
   */
  $.fn.formhelper.defaults = {
    filePicker: {
      canRemove: true,
      canModify: true,
      container: false,
      maxBytes: 10 * 1024 * 1024,
      maxFiles: 10,
      onChange: false,
      onCreate: false,
      onRemove: false,
      fileInput: {
        name: 'files[]',
        accept: '',
        multiple: false,
      },
    },
    language: {
      selectFile: 'Select file',
      selectingFile: 'Selecting files...',
      unselectFile: 'No files selected.',
      limitMsg: 'File size limit (MB)',
      invalidMsg: 'File format not supported.',
      fileSizeOverload: 'File size overload!',
      fileCountOverload: 'File count overload!',
    },
    templates: {
      filePicker: false,
      fileBox: false,
    },
    onFail: function (errorCode, errorMsg) {
      alert(`[${errorCode}]${errorMsg}`);
    },
  };
});
