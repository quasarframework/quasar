import { describe, expect, test } from 'vitest'

import { workboxFileRE } from './pwa-config.js'

describe('[pwa-config.js]', () => {
  test('workboxFileRE matches Workbox runtime chunk URLs', () => {
    // GenerateSW emits a hashed runtime chunk next to the service worker
    expect(workboxFileRE.test('/workbox-e3b0c442.js')).toBe(true)
    expect(
      workboxFileRE.test('https://example.com/app/workbox-e3b0c442.js')
    ).toBe(true)

    expect(workboxFileRE.test('/workbox-e3b0c442.js.map')).toBe(false)
    expect(workboxFileRE.test('/index.html')).toBe(false)
  })
})
