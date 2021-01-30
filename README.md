# jquery-formhelper

- [jquery-formhelper](#jquery-formhelper)
  - [Getting Started](#getting-started)
    - [Load Plugin](#load-plugin)
    - [Usage](#usage)
      - [formhelper](#formhelper)
      - [addFilePicker](#addfilepicker)
      - [getFilePickerInfo](#getfilepickerinfo)
      - [addFileBox](#addfilebox)
  - [Installation compile kit (option)](#installation-compile-kit-option)

## Getting Started

### Load Plugin

```html
<!-- (Optional) bootstrap -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />

<!-- (Optional) font-awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />

<!-- (Required) jquery 1.11.2 ~ 3.5.x -->
<script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>

<!-- formhelper -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-formhelper/dist/css/jquery-formhelper.min.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jquery-formhelper/dist/js/jquery-formhelper.min.js"></script>
```

### Usage

#### formhelper

```javascript
$(function () {
  // create formhelper
  var formhelper = $('form.ctrl-demo').formhelper({
    maxBytes: 20 * 1024 * 1024,
    maxFiles: 20,
    language: {
      selectFile: 'Select file',
      selectingFile: 'Selecting files...',
      unselectFile: 'No files selected.',
      limitMsg: 'File size limit ({0}). Upload limit {1} files.',
      acceptMsg: 'File accept format list: {0}',
      fileSizeOverload: 'File size overload! limit size: {1}',
      fileCountOverload: 'File count overload! limit count: {1}',
    },
    onFail: function (e) {
      alert(`[${e.code}] ${e.msg}`);
    },
  });

  // submit form
  formhelper.submit('send_url/api/push', {
    id: 1,
    name: 'gunter.chou',
  });
});
```

#### addFilePicker

```javascript
$(function () {
  // insert FilePicker into form
  var fileDemo = formhelper.addFilePicker({
    // FilePicker append target, Default into formhelper $el
    container: false,
    maxBytes: 10 * 1024 * 1024,
    maxFiles: 10,
    canRemove: true,
    canModify: true,
    fileInput: {
      name: 'fileDemo[]',
      accept: ['image/*', '.pdf'],
      multiple: false,
    },
    onChange: function (config) {
      var total = formhelper.getFilePickerInfo();
      var totalText = ['Total', 'count: ' + total.count, 'size: ' + total.sizeHum];
      var demoText = ['Demo', 'count: ' + fileDemo.getCount(), 'size: ' + fileDemo.getSize(true)];

      console.log('Total', totalText.join(' | '));
      console.log('Demo', demoText.join(' | '));
    },
    onCreate: function (config) {
      console.log('create event', config);
    },
    onRemove: function (config) {
      console.log('remove event', config);
    },
  });
});
```

#### getFilePickerInfo

```javascript
$(function () {
  // return all FilePicker file size and file count
  console.log(formhelper.getFilePickerInfo());
});
```

#### addFileBox

```javascript
$(function () {
  var fileDemo = formhelper.addFilePicker();
  fileDemo.addFileBox({
    // Optional
    inputs: [
      { name: 'hideValue', value: 'demo' }
    ],
    // Required
    files: [
      {
        name: 'Gunter.png',
        size: 11179,
        link: 'https://static.wikia.nocookie.net/adventuretimewithfinnandjake/images/6/68/Gunter.png',
      }
    ],
  });
});
```

## Installation compile kit (option)

```bash
git clone git://github.com/gunter1020/jquery-formHelper.git
cd jquery-formHelper
npm install
npm run build
npm run serve
```
