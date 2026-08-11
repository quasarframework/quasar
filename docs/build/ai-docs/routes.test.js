import { expect, test } from 'vitest'
import { sourceToMenuKey, sourceToOutputPath } from './routes.js'

test('flat page', () => {
  expect(sourceToOutputPath('vue-components/knob.md')).toBe(
    'vue-components/knob.md'
  )
})

test('collapsed dir/dir-name.md', () => {
  expect(sourceToOutputPath('vue-components/menu/menu.md')).toBe(
    'vue-components/menu.md'
  )
})

test('nested path uncollapsed', () => {
  expect(
    sourceToOutputPath('quasar-cli-vite/developing-ssr/introduction.md')
  ).toBe('quasar-cli-vite/developing-ssr/introduction.md')
})

test('sourceToMenuKey strips .md', () => {
  expect(sourceToMenuKey('vue-components/knob.md')).toBe('vue-components/knob')
})

test('sourceToMenuKey collapses dir/dir.md', () => {
  expect(sourceToMenuKey('vue-components/menu/menu.md')).toBe(
    'vue-components/menu'
  )
})
