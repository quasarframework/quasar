# QUploader API

Type: component

Canonical documentation: https://quasar.dev/vue-components/uploader

## Props

### `factory`

Type: `Function`

Function which should return an Object or a Promise resolving with an Object; For best performance, reference it from your scope and do not define it inline

### `url`

Type: `String | Function`

URL or path to the server which handles the upload. Takes String or factory function, which returns String. Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `'https://example.com/path'`
- `files => `https://example.com?count=${ files.length }``

### `method`

Type: `String | Function`

Default: `'POST'`

HTTP method to use for upload; Takes String or factory function which returns a String; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline

Accepted values: `'POST'`, `'PUT'`

Examples:

- `'POST'`
- `files => (files.length > 10 ? 'POST' : 'PUT')`

### `field-name`

Type: `String | Function`

Default: `file => file.name`

Field name for each file upload; This goes into the following header: 'Content-Disposition: form-data; name="__HERE__"; filename="somefile.png"; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `'backgroundFile'`
- `file => ('background' + file.name)`

### `headers`

Type: `Array | Function`

Array or a factory function which returns an array; Array consists of objects with header definitions; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `[{ name: 'Content-Type', value: 'application/json' }, { name: 'Accept', value: 'application/json' }]`
- `() => [ { name: 'X-Custom-Timestamp', value: Date.now() }]`
- `files => [ { name: 'X-Custom-Count', value: files.length }]`

### `form-fields`

Type: `Array | Function`

Array or a factory function which returns an array; Array consists of objects with additional fields definitions (used by Form to be uploaded); Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `[{ name: 'my-field', value: 'my-value' }]`
- `() => [ { name: 'my-field', value: 'my-value' }]`
- `files => [ { name: 'my-field', value: 'my-value' + files.length }]`

### `with-credentials`

Type: `Boolean | Function`

Sets withCredentials to true on the XHR that manages the upload; Takes boolean or factory function for Boolean; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `true`
- `files => (files.length === 2)`

### `send-raw`

Type: `Boolean | Function`

Send raw files without wrapping into a Form(); Takes boolean or factory function for Boolean; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `true`
- `files => (files.length > 2)`

### `batch`

Type: `Boolean | Function`

Upload files in batch (in one XHR request); Takes boolean or factory function for Boolean; Function is called right before upload; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `files => files.length > 10`

### `multiple`

Type: `Boolean`

Allow multiple file uploads

### `accept`

Type: `String`

Comma separated list of unique file type specifiers. Maps to 'accept' attribute of native input type=file element

Examples:

- `'.jpg, .pdf, image/*'`
- `'image/jpeg, .pdf'`

### `capture`

Type: `String`

Optionally, specify that a new file should be captured, and which device should be used to capture that new media of a type defined by the 'accept' prop. Maps to 'capture' attribute of native input type=file element

Accepted values: `'user'`, `'environment'`

### `max-file-size`

Type: `Number | String`

Maximum size of individual file in bytes

Examples:

- `1024`
- `'1048576'`

### `max-total-size`

Type: `Number | String`

Maximum size of all files combined in bytes

### `max-files`

Type: `Number | String`

Maximum number of files to contain

### `filter`

Type: `Function`

Custom filter for added files; Only files that pass this filter will be added to the queue and uploaded; For best performance, reference it from your scope and do not define it inline

Examples:

- `files => files.filter(file => file.size === 1024)`

### `label`

Type: `String`

Label for the uploader

Examples:

- `'Upload photo here'`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `text-color`

Type: `String`

Overrides text color (if needed); Color name from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `square`

Type: `Boolean`

Removes border-radius so borders are squared

### `flat`

Type: `Boolean`

Applies a 'flat' design (no default shadow)

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `no-thumbnails`

Type: `Boolean`

Don't display thumbnails for image files

### `auto-upload`

Type: `Boolean`

Upload files immediately when added

### `hide-upload-btn`

Type: `Boolean`

Don't show the upload button

### `thumbnail-fit`

Type: `String`

Default: `'cover'`

Added in: v2.17

How the thumbnail image will fit into the container; Equivalent of the background-size prop

Examples:

- `'cover'`
- `'contain'`
- `'auto'`
- `'50%'`

### `disable`

Type: `Boolean`

Put component in disabled mode

### `readonly`

Type: `Boolean`

Put component in readonly mode

## Slots

### `header`

Slot for custom header; Scope is the QUploader instance itself

### `list`

Slot for custom list; Scope is the QUploader instance itself

## Events

### `uploaded`

Emitted when file or batch of files is uploaded

### `failed`

Emitted when file or batch of files has encountered error while uploading

### `uploading`

Emitted when file or batch of files started uploading

### `factory-failed`

Emitted when factory function is supplied with a Promise which is rejected

### `rejected`

Emitted after files are picked and some do not pass the validation props (accept, max-file-size, max-total-size, filter, etc)

### `added`

Emitted when files are added into the list

### `removed`

Emitted when files are removed from the list

### `start`

Started working

### `finish`

Finished working (regardless of success or fail)

## Methods

### `pickFiles`

Trigger the file picker dialog; The event must come from a user interaction event handler

### `addFiles`

Add files programmatically

### `upload`

Start uploading (same as clicking the upload button)

### `abort`

Abort upload of all files (same as clicking the abort button)

### `reset`

Resets uploader to default; Empties queue, aborts current uploads

### `removeUploadedFiles`

Removes already uploaded files from the list

### `removeQueuedFiles`

Remove files that are waiting for upload to start (same as clicking the left clear button)

### `removeFile`

Remove specified file from the queue

### `updateFileStatus`

Update the status of a file

### `isAlive`

Is the component alive (activated but not unmounted); Useful to determine if you still need to compute anything going further

## Computed properties

### `files`

Type: `Array`

List of all files

### `queuedFiles`

Type: `Array`

List of files that are waiting to be uploaded

### `uploadedFiles`

Type: `Array`

List of files that have been uploaded

### `uploadedSize`

Type: `Number`

Size of all uploaded files in bytes

### `uploadSizeLabel`

Type: `String`

Label for the size total of all files

Examples:

- `'1.0MB'`

### `uploadProgressLabel`

Type: `String`

Label for the upload progress (in %)

Examples:

- `'52.76%'`

### `canAddFiles`

Type: `Boolean`

Whether new files can be added to the list

### `canUpload`

Type: `Boolean`

Whether the files can be uploaded

### `isBusy`

Type: `Boolean`

The component state is set as busy; User should not be able to interact with the component

### `isUploading`

Type: `Boolean`

The component is uploading files
