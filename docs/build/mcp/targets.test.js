import { expect, test } from 'vitest'

import { TARGETS, targetIncludes } from './targets.js'

test('a section root covers every page under it', () => {
  expect(targetIncludes(TARGETS.ui, 'vue-components/button')).toBe(true)
  expect(targetIncludes(TARGETS.ui, 'vue-components')).toBe(true)
  expect(targetIncludes(TARGETS.ui, 'vue-componentsx/button')).toBe(false)
})

test('a full route covers that page only', () => {
  expect(targetIncludes(TARGETS.ui, 'start/umd')).toBe(true)
  expect(targetIncludes(TARGETS.ui, 'security/dos-and-donts')).toBe(true)
  expect(targetIncludes(TARGETS.ui, 'start/quasar-cli')).toBe(false)
  expect(targetIncludes(TARGETS['app-vite'], 'start/quasar-cli')).toBe(true)
})

test('the CLI docs belong to app-vite, the component docs to ui', () => {
  expect(
    targetIncludes(TARGETS['app-vite'], 'quasar-cli-vite/upgrade-guide')
  ).toBe(true)
  expect(targetIncludes(TARGETS.ui, 'quasar-cli-vite/upgrade-guide')).toBe(
    false
  )
  expect(targetIncludes(TARGETS['app-vite'], 'vue-components/button')).toBe(
    false
  )
})

test('site-only sections belong to no target', () => {
  for (const key of [
    'api-explorer',
    'how-to-contribute/contribution-guide',
    'why-donate',
    'quasar-cli-webpack/upgrade-guide',
    'start/quick-start',
    'security/report-a-vulnerability'
  ]) {
    expect(targetIncludes(TARGETS.ui, key), key).toBe(false)
    expect(targetIncludes(TARGETS['app-vite'], key), key).toBe(false)
  }
})

test('only the ui slice renders the API descriptors', () => {
  expect(TARGETS.ui.api).toBe(true)
  expect(TARGETS['app-vite'].api).toBeUndefined()
})
