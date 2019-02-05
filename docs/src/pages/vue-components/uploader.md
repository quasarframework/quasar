---
title: Uploader
---
Quasar supplies a way for you to upload files through the QUploader component.

## Installation
<doc-installation components="QUploader" />

## Usage

::: warning
QUploader requires a back-end server to receive the files. The examples below will not actually upload.
:::

::: tip
QUploader is `drag and drop` compliant.
:::

### Design

<doc-example title="Basic" file="QUploader/Basic" />

<doc-example title="Dark" file="QUploader/Dark" />

### Uploading multiple files

By default, multiple files will be uploaded individually (one thread per file). Should you want all files to be uploaded in a single thread, use the `batch` property (second QUploader in the example below).

<doc-example title="Multiple" file="QUploader/Multiple" />

### Restricting upload

<doc-example title="Basic restrictions" file="QUploader/RestrictionBasic" />

::: tip
In the example above, we're using `accept` property. Its value must be a comma separated list of unique file type specifiers. Maps to 'accept' attribute of native input type=file element. [More info](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers).
:::

You can also apply custom filters (which are executed after user picks files):

<doc-example title="Filter" file="QUploader/RestrictionFilter" />

### Handling upload

<doc-example title="Auto upload on file selection" file="QUploader/UploadAuto" />

<doc-example title="Custom upload URL" file="QUploader/UploadURL" />

::: tip
You can also customize the HTTP headers and HTTP method through `headers` and `method` props. Check QUploader API section.
:::

### Slots

In the example below we're showing the equivalent of the default header:

<doc-example title="Custom header" file="QUploader/SlotHeader" />

<doc-example title="Custom files list" file="QUploader/SlotList" />

## Server endpoint

QUploader works by default with the HTTP(S) protocol to upload files (but it's not limited to it as you'll see in the section following this one).

Below is a basic server example written in Nodejs. It does nothing other than receiving the files, so consider it as a starting point.

::: tip
It is by no means required to use a Nodejs server like above -- you can handle file upload however you want, as long as the method you are using fits the HTTP protocol. Example with [PHP](https://secure.php.net/manual/en/features.file-upload.php).
:::

```js
const
  express = require('express'),
  app = express(),
  formidable = require('formidable'),
  path = require('path'),
  fs = require('fs'),
  throttle = require('express-throttle-bandwidth')

const
  port = process.env.PORT || 4444,
  folder = path.join(__dirname, 'files')

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder)
}

app.set('port', port)
app.use(throttle(1024 * 128)) // throttling bandwidth

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm()

  form.uploadDir = folder
  form.parse(req, (_, fields, files) => {
    console.log('\n-----------')
    console.log('Fields', fields)
    console.log('Received:', Object.keys(files))
    console.log()
  })
  res.send('Thank you')
})

app.listen(port, () => {
  console.log('\nUpload server running on http://localhost:' + port)
})
```

## Supporting other services
QUploader currently supports uploading through the HTTP protocol. But you can extend the component to support other services as well. Like Firebase for example. Here's how you can do it.

Below is an example with the API that you need to supply. You'll be creating a new Vue component that extends the Base of QUploader that you can then import and use in your website/app.

::: tip
For the default XHR implementation, check out [source code](https://github.com/quasarframework/quasar/blob/dev/quasar/src/components/uploader/uploader-xhr-mixin.js).
:::

::: warning Help appreciated
We'd be more than happy to accept PRs on supporting other upload services as well, so others can benefit.
:::

```js
// MyUploader.js
import { QUploaderBase } from 'quasar'

export default {
  name: 'MyUploader',

  mixins: [ UploaderBase ],

  computed: {
    isIdle () {
      // return ...
    },

    isUploading () {
      // return ...
    }
  },

  methods: {
    abort () {
      // ...
    },

    upload () {
      // ...
    }
  }
}
```

For the UMD version, you can extend `Quasar.components.QUploaderBase`.

## QUploader API
<doc-api file="QUploader" />
