---
title: useFilePicker composable
desc: What is useFilePicker() composable and how you can use it
keys: useFilePicker
badge: v2.34+
examples: useFilePicker
related:
  - /vue-composables/use-drop-zone
  - /vue-directives/drop-zone
  - /vue-composables/use-object-url
  - /vue-components/file
  - /vue-components/uploader
---

The `useFilePicker()` composable opens the browser's file dialog from your own code and hands you the picked `File` objects, without rendering a file input. You call `openFilePicker()` from a click handler (or any other user interaction) and get the files back as a Promise, through the `pickedFiles` reactive Array and through the `onChange` hook.

The picked files go through the same validation as [QFile](/vue-components/file) and [QUploader](/vue-components/uploader) (`accept`, `maxFileSize`, `maxTotalSize`, `maxFiles` and `filter`), and the files that do not pass are reported the same way those components emit `@rejected`.

Use it when you want a button, a menu entry, a keyboard shortcut or a card to pick files, and QFile's field design or QUploader's queue would get in the way. To accept dropped files as well, pair it with the [useDropZone](/vue-composables/use-drop-zone) composable, which shares its validation options.

> [!NOTE]
> On the server-side of SSR or SSG modes, the file dialog cannot be opened: `openFilePicker()` resolves to `null` and `pickedFiles` stays empty until the client takes over.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. It works the same there, and there is nothing to release.

## Syntax

```js
import { useFilePicker } from 'quasar'

setup () {
  const {
    pickedFiles,
    rejectedFiles,
    openFilePicker,
    resetFilePicker
  } = useFilePicker({
    // all optional:
    multiple: false,        // allow picking more than one file
    accept: 'image/*,.pdf', // same format as the native "accept" attribute
    capture: 'environment', // 'user' or 'environment'; asks mobile devices for the camera
    directory: false,       // pick a folder instead of files

    maxFileSize: 1048576,   // bytes
    maxTotalSize: 10485760, // bytes
    maxFiles: 5,
    filter (files) {        // keep only the files you return
      return files.filter(file => file.name.endsWith('.jpg'))
    },

    onChange (files) {},      // the accepted files of a selection
    onRejected (rejected) {}, // [{ failedPropValidation, file }, ...]
    onCancel () {}            // the dialog was dismissed
  })

  // ...
}
```

```ts
function useFilePicker(
  options?: MaybeRefOrGetter<{
    multiple?: boolean
    accept?: string
    capture?: 'user' | 'environment'
    directory?: boolean
    maxFileSize?: string | number
    maxTotalSize?: string | number
    maxFiles?: string | number
    filter?: (files: readonly File[]) => readonly File[]
    onChange?: (files: File[]) => void
    onRejected?: (
      rejected: { failedPropValidation: string; file: File }[]
    ) => void
    onCancel?: () => void
  }>
): {
  pickedFiles: Ref<File[]>
  rejectedFiles: Ref<{ failedPropValidation: string; file: File }[]>
  openFilePicker: (overrides?: UseFilePickerOptions) => Promise<File[] | null>
  resetFilePicker: () => void
}
```

`openFilePicker()` must be called as a direct consequence of a user interaction (a click or keyup handler, for example). Browsers refuse to show the file dialog otherwise, including from an `async` callback that already awaited something.

The Promise returned by `openFilePicker()` resolves with the accepted files (an empty Array when every picked file got rejected) or with `null` when the user dismisses the dialog. It also resolves with `null` when `openFilePicker()` gets called again before the previous dialog reported, or when your component gets destroyed.

`pickedFiles` holds the accepted files of the latest selection. A selection where every file gets rejected leaves `pickedFiles` unchanged; `rejectedFiles` always reflects the latest selection. `resetFilePicker()` empties both.

`onChange` is called only when at least one file got accepted, `onRejected` only when at least one file got rejected (both can be called for the same selection), and `onCancel` when the dialog was dismissed.

Setting `directory` picks a folder: the Array holds every file inside it (recursively), with each file's path relative to the picked folder available as `file.webkitRelativePath`. The `multiple` option does not matter in this case. Safari's dialog also lets the user pick individual files here; those come with an empty `webkitRelativePath`.

The `failedPropValidation` of a rejected entry is one of `accept`, `max-file-size`, `max-total-size`, `max-files` or `filter`, naming the option that the file did not pass.

## Changing the options

The options can be a plain Object, a Ref or a getter Function, and they are read each time `openFilePicker()` is called. You can also hand over overrides to `openFilePicker()` itself, which take precedence for that one call:

```js
import { ref } from 'vue'
import { useFilePicker } from 'quasar'

setup () {
  const allowVideos = ref(false)

  const { openFilePicker } = useFilePicker(() => ({
    multiple: true,
    accept: allowVideos.value ? 'image/*,video/*' : 'image/*'
  }))

  function pickAvatar () {
    // only one image for the avatar, whatever the current options say
    return openFilePicker({ multiple: false, accept: 'image/*' })
  }

  // ...
}
```

## Example

A button that opens the file dialog for images, lists what was accepted, and reports the rejected files and a dismissed dialog through notifications:

<DocExample title="Picking files" file="Basic" />

The same picker can serve different needs by handing overrides to `openFilePicker()`. The second button picks a whole folder and lists the paths relative to it:

<DocExample title="Per-call overrides and folders" file="Overrides" />

To preview a picked image (or hand any picked file to an `<img>`, a `<video>` or a download link), pair it with the [useObjectUrl](/vue-composables/use-object-url) composable, which creates the object URL for the `File` and revokes it when it is no longer needed.
