import { expect, test } from 'vitest'
import { existsSync } from 'node:fs'
import { join, normalize } from 'node:path'

import tutorials from './tutorials.js'

const publicDir = normalize(join(import.meta.dirname, '../../public'))

// the course/video targets are external urls; images are either
// external too or served from public/
test('tutorial entries carry title, description, url and image', () => {
  const buckets = Object.values(tutorials)
  expect(buckets.length).toBeGreaterThan(0)

  for (const entries of buckets) {
    for (const entry of entries) {
      expect(entry.t, entry.u).toBeTruthy()
      expect(entry.d, entry.t).toBeTruthy()
      expect(entry.u, entry.t).toMatch(/^https?:\/\//)

      if (entry.i.startsWith('/')) {
        expect(existsSync(join(publicDir, entry.i)), entry.t).toBe(true)
      } else {
        expect(entry.i, entry.t).toMatch(/^https?:\/\//)
      }
    }
  }
})
