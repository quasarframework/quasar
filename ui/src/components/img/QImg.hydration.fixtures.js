import { h } from 'vue'

import { QImg } from 'quasar'

// Rendered on BOTH sides of the hydration round-trip (server via the
// built server bundle, client via ui/src) — see
// /ui/test/hydration/hydrate.js. Must render deterministically.

// a real image with a deterministic natural size, so the pre-hydration
// load settles before the client reconciles it
export const src =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"></svg>'
  )

// undecodable image data, so the browser fires a real error event
export const brokenSrc = 'data:image/png;base64,invalid'

// the client-side emits (the server ignores the listeners)
export const emitted = []

const listeners = {
  onLoad: loadedSrc => emitted.push(['load', loadedSrc]),
  onError: evt => emitted.push(['error', evt])
}

// a known box shape (ratio) server-renders the image
export const basic = {
  render: () => h(QImg, { src, ratio: 1, ...listeners })
}

export const withPlaceholder = {
  render: () => h(QImg, { src, placeholderSrc: src, ratio: 1, ...listeners })
}

export const noSpinner = {
  render: () => h(QImg, { src, ratio: 1, noSpinner: true })
}

export const withHeight = {
  render: () => h(QImg, { src, height: '90px' })
}

// an unknown box shape defers the image until hydrated...
export const deferred = {
  render: () => h(QImg, { src, ...listeners })
}

// ...unless opted in
export const optIn = {
  render: () => h(QImg, { src, ssrPrerender: true, ...listeners })
}

export const broken = {
  render: () =>
    h(
      QImg,
      { src: brokenSrc, errorSrc: src, ratio: 1, ...listeners },
      { error: () => 'failed' }
    )
}
