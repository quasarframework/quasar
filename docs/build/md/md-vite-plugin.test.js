import { expect, test, vi } from 'vitest'

import { mdVitePlugin } from './md-vite-plugin.js'

const plugin = mdVitePlugin(false)

const PAGE = '---\ntitle: T\n---\n## Usage\n'

test('transforms only .md modules', () => {
  // the rust-side filter gates the handler in production — a wrong
  // filter means the handler never runs at all
  const { id } = plugin.transform.filter

  expect(id.test('/src/pages/start/pick-quasar-flavour.md')).toBe(true)
  // an actual extension, not any id merely ending in "md" (the
  // pre-filter regex had an unescaped dot)
  expect(id.test('/src/scripts/build.cmd')).toBe(false)
})

// @vitejs/plugin-vue hot-updates a file by diffing the SFC blocks it parses
// out of it against the ones it compiled last time. Read a .md page off disk
// and there are no blocks to find, so the diff says nothing changed and the
// browser is never told - every save after the first went missing this way.
test('reads a page as the SFC it compiles to, not as the markdown on disk', async () => {
  const ctx = {
    file: '/src/pages/some/page.md',
    read: () => Promise.resolve(PAGE)
  }

  plugin.handleHotUpdate(ctx)
  const read = await ctx.read()

  expect(read).toContain('<template>')
  expect(read).toContain('<script setup>')
  expect(read, 'the markdown itself must not be what is compared').not.toBe(
    PAGE
  )
})

test('leaves anything that is not a page to be read as it is', async () => {
  const ctx = {
    file: '/src/components/DocPage.vue',
    read: () => Promise.resolve('raw')
  }

  plugin.handleHotUpdate(ctx)

  expect(await ctx.read()).toBe('raw')
})

test('parsing a page to be diffed does not report its ids a second time', async () => {
  // the transform runs again straight after and is the one that reports
  const colliding = '---\ntitle: T\n---\n## Usage\n\n## Usage\n'
  const ctx = {
    file: '/src/pages/some/page.md',
    read: () => Promise.resolve(colliding)
  }
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

  plugin.handleHotUpdate(ctx)
  await ctx.read()
  const calls = spy.mock.calls
  spy.mockRestore()

  expect(calls).toEqual([])
})
