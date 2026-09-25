---
title: v-drop-zone directive
desc: Vue directive that turns the DOM element it is applied to into a target for dropped files.
keys: drop-zone,v-drop-zone
badge: v2.34+
examples: DropZone
related:
  - /vue-composables/use-drop-zone
  - /vue-composables/use-file-picker
  - /vue-components/file
  - /vue-components/uploader
---

"DropZone" is a Quasar directive that turns the DOM element (or component) that it is applied to into a target for files dragged from the desktop, calling a method with the dropped `File` objects and flagging the element with a CSS class while a drag hovers it.

It is the template-side form of the [useDropZone](/vue-composables/use-drop-zone) composable. Its Object form validates the dropped files the way [QFile](/vue-components/file) does (`accept`, size and count limits, `filter`); the composable adds reactive state, the enter/leave hooks and a target of your choosing, so reach for it when you need any of those.

<DocApi file="DropZone" />

## Usage

The directive's value is the handler Function. It takes two parameters: the Array of dropped `File` objects and the drop Event (its `dataTransfer` holds the other payloads of the drag, such as text or links). The handler is called on every drop, with an empty Array when the drag carried no files.

While something is being dragged over the element (its children included), the element carries the `q-drop-zone--over` CSS class, which draws a dashed outline inside the element by default (the same feedback as QFile and QUploader).

> [!TIP]
> A drop zone alone is not reachable by keyboard or touch users. Place a button inside it (or next to it) that opens the file dialog, through [QFile](/vue-components/file) or the [useFilePicker](/vue-composables/use-file-picker) composable.

### Basic

Only the first dropped file is handed over by default. With the `multiple` modifier (ex: `v-drop-zone.multiple`), the handler receives every dropped file:

<DocExample title="Basic" file="Basic" />

### Styling

The default feedback is a dashed `currentColor` outline. To change it for every drop zone of your app, restyle `.q-drop-zone--over` in your global CSS. For one element, hand over your own class through the `activeClass` option of the Object form instead; the default class (and its outline) is not applied then:

<DocExample title="Custom hover style" file="Styled" />

### Validation

The Object form carries the handler next to the validation options of [QFile](/vue-components/file): `accept`, `maxFileSize`, `maxTotalSize`, `maxFiles` (per drop) and `filter`, plus `multiple` (which takes precedence over the modifier). Only the files that pass are handed to `handler`; the ones that do not are reported to `onRejected` as `{ failedPropValidation, file }` entries, the same way QFile emits `@rejected`. The options are read at each drop, so an inline Object literal works and can change at runtime:

<DocExample title="Validating the dropped files" file="Validation" />

### Disable

Passing in Boolean `false` (or `undefined`) instead of a Function (or an Object without a `handler`) disables the directive: the element stops accepting drops (the browser's default handling of a drop applies again) until a handler is supplied again. The DOM element is untouched in the process, so whatever it wraps keeps its state.

<DocExample title="Disable" file="Disable" />

> [!WARNING]
> A file dropped anywhere else on the page makes the browser navigate to it (or download it), leaving your app. Whether to guard against that is your call: listening to `dragover` and `drop` on `window` and calling `preventDefault()` on both cancels the navigation everywhere.
