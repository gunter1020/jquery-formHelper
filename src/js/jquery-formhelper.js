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
     * Get element rule
     *
     * @param {*} ele
     */
    var getEl = function (ele) {
      return $(ele || $el || document.body);
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
     * @param {Element} ele
     * @returns {Object}
     */
    helper.getFilePickerInfo = function (ele) {
      return components.filePicker.getAllInfo(getEl(ele));
    };

    /**
     * Check form
     *
     * @param {Element} ele
     * @returns {Boolean}
     */
    helper.check = function (ele) {
      var $ele = getEl(ele);

      try {
        // check FilePicker limit
        components.filePicker.check($ele);
      } catch (e) {
        // fail callback
        if (typeof options.onFail === 'function') {
          options.onFail(e);
        }
        return false;
      }
      return true;
    };

    /**
     * Submit form if check success
     *
     * @param {String} url
     * @param {*} data
     * @param {HTMLFormElement} formEle
     * @returns {Promise}
     */
    helper.submit = function (url, data = {}, formEle = undefined) {
      var dfr = $.Deferred();
      var $formEle = getEl(formEle);

      // check form data
      if (this.check($formEle)) {
        // init FormData
        var formData = $formEle.is('form') ? new FormData($formEle.get(0)) : new FormData();

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

        $.ajax({
          url: url,
          data: formData,
          dataType: 'json',
          processData: false,
          contentType: false,
          cache: false,
          method: 'POST',
        })
          .done(dfr.resolve)
          .fail(dfr.reject);
      }

      return dfr.promise();
    };

    return helper;
  };

  /**
   * FormHelper
   */
  window.FormHelper = function (options) {
    return formHelper($(document.body), $.extend(true, {}, $.fn.formhelper.defaults, options));
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
