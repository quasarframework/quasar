import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'

import { plainTestPadding, uiDefaults } from '../../fixture-values.js'

import 'quasar/src/css/index.sass'

import { QToolbar } from 'quasar'
import TransitiveTest from '@/components/sass-transform/TransitiveTest.vue'
import PlainTest from '@/components/sass-transform/PlainTest.vue'

describe('Default variables (no custom variables file)', () => {
  test('framework css is served (through the prebuilt css alias) with default values', () => {
    const wrapper = mount(QToolbar)

    const { element } = wrapper.get('div')
    // the framework default, as opposed to the custom file's 100px
    // override that the other suites assert
    expect(window.getComputedStyle(element).getPropertyValue('padding')).toBe(
      uiDefaults.toolbarPadding
    )
  })

  test('targeted injection works from the precomputed parse alone', () => {
    const wrapper = mount(TransitiveTest)

    const { element } = wrapper.get('div.my-transitive-div')
    const style = window.getComputedStyle(element)

    // $flex-gutter-sm = $space-base * .5 = 8px (framework defaults)
    expect(style.getPropertyValue('padding')).toBe(uiDefaults.flexGutterSm)
    // viewport is 1280px wide, so the $breakpoint-sm-min media query
    // ($sizes through "@use sass:map") is active
    expect(style.getPropertyValue('margin')).toBe(uiDefaults.flexGutterXs)
  })

  test('variable-less style blocks still skip injection safely', () => {
    const wrapper = mount(PlainTest)

    const { element } = wrapper.get('div.my-plain-div')
    expect(window.getComputedStyle(element).getPropertyValue('padding')).toBe(
      plainTestPadding
    )
  })
})
