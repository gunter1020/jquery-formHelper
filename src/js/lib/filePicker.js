/**
 * FilePicker components
 *
 * @param {Element} $el
 * @param {*} options
 */
export var filePicker = function ($el, options) {
  const kilobyte = 1024;

  const byteUnit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  var lang = options.language;

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
   * Get FilePicker template
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
   * Get FileBox template
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

      $fileBox = $('<div>').addClass('fh-file-box');

      // add file input
      if (config.$fileInput) {
        $fileBox.append(
          config.$fileInput
            .attr({
              type: 'file',
              name: config.fileInput.name,
              accept: config.fileInput.accept.join(','),
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
          let $fileInfo = $('<span>').addClass('fh-file-info');
          let fileText = `${file.name} (${formatBytes(file.size)})`;

          // set download link
          if ('link' in file) {
            $fileInfo.append($('<a>').attr({ href: file.link, target: '_blank' }).text(fileText));
          } else {
            $fileInfo.text(fileText);
          }

          $fileBox.append($fileInfo.prepend($('<i>').addClass('far fa-file fa-fw')));
        });
      } else {
        // add selecting file prompt text
        $fileBox.append($('<span>').addClass('fh-file-info').text(lang.selectingFile));
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
      config.onChange(config);
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
      config.onCreate(config);
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
      config.onRemove(config);
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
      accept: config.fileInput.accept.join(','),
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
        // if not select files remove fileBox
        $fileBox.remove();
        // tigger fileBox remove
        fileBoxRemove(config);
        // tigger filePicker change
        filePickerChange(config);
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
   * Build Exception message
   *
   * @param {String} code
   * @param {String} param
   */
  var buildExceptionMsg = function (code, param) {
    return (lang[code] || '').replace('{0}', code).replace('{1}', param);
  };

  /**
   * FilePicker Exception
   *
   * @param {String} code
   * @param {String} param
   * @param {JQuery} $filePicker
   */
  var filePickerException = function (code, param, $filePicker) {
    this.code = code;
    this.msg = buildExceptionMsg(code, param);
    this.$el = $filePicker || $el;
    this.api = this.$el.data('FilePicker') || {};
  };

  /**
   * Add FilePicker
   *
   * @param {*} config
   */
  this.addPicker = function (config = {}) {
    // init filePicker config
    config = $.extend(true, {}, options.filePicker, config);

    // format fileInput accept type
    config.fileInput.accept = Array.isArray(config.fileInput.accept)
      ? config.fileInput.accept
      : config.fileInput.accept.split(',');

    // set filePicker element
    config.$filePicker = getFilePickerTmpl(config);

    // get filePicker list block
    var $fileList = config.$filePicker.find('.fh-file-list');

    // set filePicker API
    config.api = {
      getEl: function () {
        return config.$filePicker;
      },
      getSize: function (format = false) {
        var size = getFileSize(config.$filePicker);
        return format ? formatBytes(size) : size;
      },
      getCount: function () {
        return getFileCount(config.$filePicker);
      },
      getConfig: function () {
        return config;
      },
      addFileBox: function (fileBoxOpt = {}) {
        fileBoxOpt = $.extend(true, {}, config, fileBoxOpt);

        var $fileBox = getFileBoxTmpl(fileBoxOpt);

        // insert into filePicker list block
        $fileList.append($fileBox);

        // tigger fileBox create
        fileBoxCreate(fileBoxOpt);

        // tigger filePicker change
        filePickerChange(fileBoxOpt);

        return $fileBox;
      },
    };

    config.$filePicker.data('FilePicker', config.api);

    $(config.container || $el).append(config.$filePicker);

    return config.api;
  };

  /**
   * Get FilePicker info
   */
  this.getAllInfo = function ($ele) {
    var info = {
      size: 0,
      sizeHum: '',
      count: 0,
      picker: [],
    };

    $.each($ele.find('.fh-file-picker'), function () {
      let $filePicker = $(this);
      let filePickerAPI = $filePicker.data('FilePicker');

      // continue undefined FilePicker
      if (!filePickerAPI) {
        return;
      }

      let size = getFileSize($filePicker);
      let count = getFileCount($filePicker);

      info.size += size;
      info.count += count;
      info.picker.push({
        api: filePickerAPI,
        size: size,
        count: count,
      });
    });

    info.sizeHum = formatBytes(info.size);

    return info;
  };

  /**
   * Check FilePicker limit
   */
  this.check = function ($ele) {
    var info = this.getAllInfo($ele);

    // check all upload file size
    if (info.size > options.maxBytes) {
      throw new filePickerException('fileSizeOverload', formatBytes(options.maxBytes), $ele);
    }

    // check all upload file count
    if (info.count > options.maxFiles) {
      throw new filePickerException('fileCountOverload', options.maxFiles, $ele);
    }

    $.each(info.picker, function (idx, picker) {
      let pickerConfig = picker.api.getConfig();
      // check picker upload file size
      if (picker.size > pickerConfig.maxBytes) {
        throw new filePickerException('fileSizeOverload', formatBytes(pickerConfig.maxBytes), picker.$filePicker);
      }
      // check picker upload file count
      if (picker.count > pickerConfig.maxFiles) {
        throw new filePickerException('fileCountOverload', pickerConfig.maxFiles, picker.$filePicker);
      }
    });
  };

  return this;
};
