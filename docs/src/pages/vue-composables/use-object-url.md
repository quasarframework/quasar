---
title: useObjectUrl composable
desc: What is useObjectUrl() composable and how you can use it
keys: useObjectUrl
badge: v2.34+
examples: useObjectUrl
related:
  - /vue-composables/use-file-picker
  - /vue-components/file
  - /vue-components/img
  - /vue-components/uploader
---

The `useObjectUrl()` composable turns a `Blob` (a `File` included) or a `MediaSource` into a reactive object URL that you can hand to an `<img>`, a `<video>`, a QImg or a download link. Object URLs must be revoked once they are no longer needed, otherwise the browser keeps the underlying data in memory for as long as the page lives; the composable takes care of that. It revokes the URL whenever the source changes and when your component gets destroyed.

Use it to preview a picked file before uploading it, to show an image received as a Blob from an API, or to play a media stream.

> [!NOTE]
> On the server-side of SSR or SSG modes, `url` stays `null`: there is no `URL.createObjectURL()` there and, in practice, no Blob to point at either.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. It works the same there, but nothing revokes the URL by itself: set the source to `null` or call `stop()` when you are done.

## Syntax

```js
import { useObjectUrl } from 'quasar'

setup () {
  const { url, stop } = useObjectUrl(source)

  // ...
}
```

```ts
function useObjectUrl(
  source?: MaybeRefOrGetter<Blob | MediaSource | null | undefined>
): {
  url: Ref<string | null>
  stop: () => void
}
```

`source` can be a plain value, a Ref or a getter Function. Plain values are read once. With a Ref or a getter, the composable tracks whatever reactive state it reads: each time it yields a different object, the previous URL gets revoked and a new one is created; `null` or `undefined` revokes the current URL and leaves `url` at `null`. A getter that re-runs but returns the same object keeps the URL, so an image already displayed with it does not reload.

`url` holds the object URL (`blob:...`) of the current source or `null`. `stop()` revokes the current URL and ends the tracking for good; you will rarely need it inside a component, as the composable revokes the URL by itself when the component gets destroyed.

> [!WARNING]
> Revoking an object URL makes it unusable from that moment on. Anything that still needs the data (an `<img>` that has not finished loading, a link the user has not clicked yet) must get the new `url` value; do not keep copies of an old one around.

## Example

Picking an image with the [useFilePicker](/vue-composables/use-file-picker) composable and previewing it with QImg. Picking another image replaces the preview and revokes the URL of the previous one:

<DocExample title="Previewing a picked file" file="Basic" />
