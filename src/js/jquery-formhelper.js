import { filePicker } from './lib/filePicker.js';

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
    var helper = {};

    var components = {
      filePicker: new filePicker($el, options),
    };

    /**
     * Add FilePicker
     *
     * @param {*} config
     * @returns {JQuery}
     */
    helper.addFilePicker = function (config = {}) {
      return components.filePicker.addPicker(config);
    };

    /**
     * Get FilePicker info
     *
     * @returns {Object}
     */
    helper.getFilePickerInfo = function () {
      return components.filePicker.getAllInfo();
    };

    /**
     * Check form
     */
    helper.check = function () {
      try {
        // check FilePicker limit
        components.filePicker.check();
      } catch (e) {
        // fail callback
        if (typeof options.onFail === 'function') {
          options.onFail(e);
        } else {
          throw e;
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
    onFail: function (e) {
      alert(`[${e.code}] ${e.msg}`);
    },
  };
});
