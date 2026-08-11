import { expect, test } from 'vitest'

import { sponsors } from './sponsors.js'

// the logo files live on cdn.quasar.dev (per SponsorTile.vue), so only
// the entry shape is verifiable here
test('sponsor entries carry a logo file name, name and link', () => {
  const entries = Object.values(sponsors).flat()
  expect(entries.length).toBeGreaterThan(0)

  for (const entry of entries) {
    expect(entry.src, entry.name).toMatch(/\.(svg|png)$/)
    expect(entry.name).toBeTruthy()
    expect(entry.href, entry.name).toMatch(/^https?:\/\//)
  }
})
