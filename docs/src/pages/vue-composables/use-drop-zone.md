---
title: useDropZone composable
desc: What is useDropZone() composable and how you can use it
keys: useDropZone
badge: v2.34+
examples: useDropZone
related:
  - /vue-composables/use-file-picker
  - /vue-composables/use-object-url
  - /vue-components/file
  - /vue-components/uploader
---

The `useDropZone()` composable turns an element (or a component) into a target for files dragged from the desktop: it tells you through the reactive `isOverDropZone` Boolean when a drag hovers the zone, and hands you the dropped `File` objects through the `droppedFiles` reactive Array and the `onDrop` hook.

The dropped files go through the same validation as [QFile](/vue-components/file) and [QUploader](/vue-components/uploader) (`accept`, `maxFileSize`, `maxTotalSize`, `maxFiles` and `filter`), and the files that do not pass are reported the same way those components emit `@rejected`.

Use it when you want your own card, panel or whole page to accept dropped files, and QFile's field design or QUploader's queue would get in the way. Pair it with the [useFilePicker](/vue-composables/use-file-picker) composable on a button inside the zone, so that keyboard and touch users can supply the files too.

> [!NOTE]
> On the server-side of SSR or SSG modes, nothing can be dropped: `isOverDropZone` stays `false` and `droppedFiles` stays empty until the client takes over.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. There is no component root to fall back on and no mount to wait for, so supply a `target` (an element, or a ref or getter of one); the zone starts listening right away and nothing releases it by itself: call `stop()` (or point a reactive `target` to `null`) when you are done.

## Syntax

```js
import { useTemplateRef } from 'vue'
import { useDropZone } from 'quasar'

setup () {
  const target = useTemplateRef('target') // an Element or a component

  const {
    isOverDropZone,
    droppedFiles,
    rejectedFiles,
    resetDropZone,
    stop
  } = useDropZone({
    // all optional:
    target,                 // omit it to use the component's own root element
    disabled: false,        // stop accepting drops

    multiple: false,        // accept more than one file per drop
    accept: 'image/*,.pdf', // same format as the native "accept" attribute
    maxFileSize: 1048576,   // bytes
    maxTotalSize: 10485760, // bytes
    maxFiles: 5,
    filter (files) {        // keep only the files you return
      return files.filter(file => file.name.endsWith('.jpg'))
    },

    onDrop (files, evt) {},   // the accepted files of a drop, plus the Event
    onRejected (rejected) {}, // [{ failedPropValidation, file }, ...]
    onEnter (evt) {},         // a drag entered the zone
    onLeave (evt) {}          // it left the zone or got dropped
  })

  // ...
}
```

```ts
function useDropZone(
  options?: MaybeRefOrGetter<{
    target?: MaybeRefOrGetter<
      Element | ComponentPublicInstance | null | undefined
    >
    disabled?: boolean
    multiple?: boolean
    accept?: string
    maxFileSize?: string | number
    maxTotalSize?: string | number
    maxFiles?: string | number
    filter?: (files: readonly File[]) => readonly File[]
    onDrop?: (files: File[], evt: DragEvent) => void
    onRejected?: (
      rejected: { failedPropValidation: string; file: File }[]
    ) => void
    onEnter?: (evt: DragEvent) => void
    onLeave?: (evt: DragEvent) => void
  }>
): {
  isOverDropZone: Ref<boolean>
  droppedFiles: Ref<File[]>
  rejectedFiles: Ref<{ failedPropValidation: string; file: File }[]>
  resetDropZone: () => void
  stop: () => void
}
```

Without a `target`, the zone is the root element of the component the composable is called in, as of the moment the component gets mounted. A component rendering a fragment (multiple root nodes) has no root element to listen on, so supply a `target` there.

`isOverDropZone` becomes `true` while something is being dragged over the zone (its children included) and goes back to `false` when the drag leaves it or gets dropped; `onEnter` and `onLeave` are called on those two transitions, with the drag Event. Use it to highlight the zone.

Without `multiple`, only the first dropped file is kept (the others are not reported as rejected), the same as with QFile. Dropped folders are not opened: they show up as files without a type, which an `accept` filters out.

`droppedFiles` holds the accepted files of the latest drop. A drop where every file gets rejected leaves `droppedFiles` unchanged; `rejectedFiles` always reflects the latest drop. `resetDropZone()` empties both.

`onDrop` is called on every drop with the accepted files (an empty Array when nothing passed, or when the drag carried no files at all) and the drop Event, so the other payloads of the drag (`evt.dataTransfer.getData('text/plain')`, for example) stay within reach. `onRejected` is called only when at least one file got rejected.

The `failedPropValidation` of a rejected entry is one of `accept`, `max-file-size`, `max-total-size`, `max-files` or `filter`, naming the option that the file did not pass.

`stop()` releases the zone: the element no longer accepts drops (the browser's default handling applies again) and `isOverDropZone` goes back to `false`. The composable keeps following the options, so pointing `target` to another element re-arms it; changing any other option does not. It is especially useful when you have not specified a `target`, since the component's own root element cannot be swapped out otherwise (with a reactive `target`, setting it to `null` releases the zone just the same). There is no need to call it on your component's destruction, as the composable releases the zone by itself.

> [!WARNING]
> A file dropped anywhere else on the page makes the browser navigate to it (or download it), leaving your app. Whether to guard against that is your call: listening to `dragover` and `drop` on `window` and calling `preventDefault()` on both cancels the navigation everywhere.

## Changing the options while running

The options can be a plain Object, a Ref or a getter Function. The validation options and the hooks are read at each drop. With a Ref or a getter, the composable also tracks whatever reactive state `target` and `disabled` read and re-applies them whenever that state changes, so you never call anything to "update" it:

- toggling `disabled` releases the zone (`isOverDropZone` goes back to `false`, and the browser's default handling of a drop applies again) and re-arms it
- pointing `target` to another element (or letting a template ref change through `v-if`) follows it

```js
import { ref } from 'vue'
import { useDropZone } from 'quasar'

setup () {
  const uploading = ref(false)
  const allowVideos = ref(false)

  const { isOverDropZone, droppedFiles } = useDropZone(() => ({
    multiple: true,
    disabled: uploading.value,
    accept: allowVideos.value ? 'image/*,video/*' : 'image/*'
  }))

  // ...
}
```

## Example

The dashed box below accepts dropped images and lights up while a drag hovers it. The button inside opens the file dialog through [useFilePicker](/vue-composables/use-file-picker) with the same validation options, and both feed the same list; the rejected files are reported through notifications:

<DocExample title="Dropping files" file="Basic" />

To preview a dropped image (or hand any dropped file to an `<img>`, a `<video>` or a download link), pair it with the [useObjectUrl](/vue-composables/use-object-url) composable, which creates the object URL for the `File` and revokes it when it is no longer needed.
