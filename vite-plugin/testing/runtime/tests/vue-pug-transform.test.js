import { describe, expect, test, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Vue + Pug Transformations', () => {
  test.each([
    [ 'BasicTest' ],
    [ 'ImportsTest' ],
    [ 'AliasedImports' ],
    [ 'CustomWithImports' ],
    [ 'CustomWithAliasedImports' ],
    [ 'MixedCase' ],
    [ 'MixedCaseWithDuplicates' ],
    [ 'MixedCaseWithDuplicatesAndAliasedImports' ],
    [ 'ExtendBtn' ]
  ])('transforms %s.vue', async filename => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    // also avoid test component logs
    vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const { default: TestComponent } = await import(`playground/js-pug/${ filename }.vue`)
    const wrapper = mount(TestComponent)

    expect(
      wrapper.html()
    ).not.toMatch(/^<[qQ]/)

    expect(consoleError).not.toHaveBeenCalled()
    expect(consoleWarn).not.toHaveBeenCalled()
  })
})
