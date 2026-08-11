import { expect, test } from 'vitest'

import { mdVitePlugin } from './md-vite-plugin.js'

const plugin = mdVitePlugin(false)

test('transforms only .md modules', () => {
  // the rust-side filter gates the handler in production — a wrong
  // filter means the handler never runs at all
  const { id } = plugin.transform.filter

  expect(id.test('/src/pages/start/pick-quasar-flavour.md')).toBe(true)
  // an actual extension, not any id merely ending in "md" (the
  // pre-filter regex had an unescaped dot)
  expect(id.test('/src/scripts/build.cmd')).toBe(false)
})
