# jquery-formhelper

## Getting Started

### Load Plugin

```html
<!-- formhelper -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-formhelper/dist/css/jquery-formhelper.min.css" />
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jquery-formhelper/dist/js/jquery-formhelper.min.js"></script>
```

### Usage

#### formhelper

```javascript
$(function () {
  // create formhelper
  var formhelper = $('form.ctrl-demo').formhelper();

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
  // insert filePicker into form
  var fileDemo = formhelper.addFilePicker({
    canRemove: true,
    canModify: false,
    fileInput: {
      name: 'fileDemo[]',
      accept: '',
      multiple: false,
    },
    onChange: function () {
      var total = formhelper.getFilePickerInfo();
      var totalText = ['Total', 'count: ' + total.count, 'size: ' + total.sizeHum];
      var demoText = ['Demo', 'count: ' + fileDemo.getCount(), 'size: ' + fileDemo.getSize(true)];

      console.log('Total', totalText.join(' | '));
      console.log('Demo', demoText.join(' | '));
    },
    onCreate: function () {
      console.log('create event');
    },
    onRemove: function () {
      console.log('remove event');
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

## Installation compile kit (option)

```bash
git clone git://github.com/gunter1020/jquery-formHelper.git
cd jquery-formHelper
npm install
npm install -g grunt-cli
grunt release
```
