import { describe, expect, test, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Vue Transformations', () => {
  describe.each([
    [ 'With <script>', 'regular-script' ],
    [ 'With <script setup>', 'script-setup' ]
  ])('%s', (_, folder) => {
    test.each([
      [ 'BasicTest' ],
      [ 'ImportsTest' ],
      [ 'AliasedImports' ],
      [ 'CustomComp' ],
      [ 'CustomWithImports' ],
      [ 'CustomWithAliasedImports' ],
      [ 'OnlyCustomWithImports' ],
      [ 'OnlyCustomWithAliasedImports' ],
      [ 'MixedCase' ],
      [ 'MixedCaseWithDuplicates' ],
      [ 'MixedCaseWithDuplicatesAndAliasedImports' ],
      [ 'ExtendBtn' ]
    ])('transforms %s.vue', async filename => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

      // also avoid test component logs
      vi.spyOn(console, 'log').mockImplementation(() => undefined)

      const { default: TestComponent } = await import(`playground/${ folder }/${ filename }.vue`)
      const wrapper = mount(TestComponent)

      expect(
        wrapper.html()
      ).not.toMatch(/^<[qQ]/)

      expect(consoleError).not.toHaveBeenCalled()
      expect(consoleWarn).not.toHaveBeenCalled()
    })
  })
})
