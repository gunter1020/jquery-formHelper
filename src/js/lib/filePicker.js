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
   * FilePicker Exception
   *
   * @param {String} code
   * @param {JQuery} $filePicker
   */
  var filePickerException = function (code, $filePicker) {
    this.code = code;
    this.msg = lang[code] || '';
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

    // set filePicker element
    config.$filePicker = getFilePickerTmpl(config);

    // get filePicker list block
    var $fileList = config.$filePicker.find('.fh-file-list');

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

      // continue undefined FilePicker
      if (!$filePicker.data('FilePicker')) {
        return;
      }

      let size = getFileSize($filePicker);
      let count = getFileCount($filePicker);

      info.size += size;
      info.count += count;
      info.picker.push({
        $filePicker: $filePicker,
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

    // check upload file size
    if (info.totalSize > options.filePicker.maxBytes) {
      throw new filePickerException('fileSizeOverload');
    }

    // check upload file count
    $.each(info.picker, function (idx, picker) {
      if (picker.count > options.filePicker.maxFiles) {
        throw new filePickerException('fileCountOverload', picker.$filePicker);
      }
    });
  };

  return this;
};
