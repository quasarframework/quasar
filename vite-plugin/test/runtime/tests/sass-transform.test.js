import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'

import {
  plainTestPadding,
  playgroundVariables,
  uiDefaults
} from '../../fixture-values.js'

import 'quasar/src/css/index.sass'

import { QToolbar } from 'quasar'
import PaddingTest from '@/components/sass-transform/PaddingTest.vue'
import PlainTest from '@/components/sass-transform/PlainTest.vue'
import TransitiveTest from '@/components/sass-transform/TransitiveTest.vue'

describe('Sass Transform', () => {
  test('variables file is taken into account', () => {
    const wrapper = mount(QToolbar)

    const { element } = wrapper.get('div')
    expect(window.getComputedStyle(element).getPropertyValue('padding')).toBe(
      playgroundVariables.toolbarPadding
    )
  })

  test('correctly uses sass variables', () => {
    const wrapper = mount(PaddingTest)

    const { element } = wrapper.get('div.my-div')
    expect(window.getComputedStyle(element).getPropertyValue('padding')).toBe(
      playgroundVariables.toolbarPadding
    )
  })

  test('transitive variables and breakpoints resolve correctly', () => {
    const wrapper = mount(TransitiveTest)

    const { element } = wrapper.get('div.my-transitive-div')
    const style = window.getComputedStyle(element)

    // $flex-gutter-sm = $space-base * .5 = 8px
    expect(style.getPropertyValue('padding')).toBe(uiDefaults.flexGutterSm)
    // viewport is 1280px wide, so the $breakpoint-sm-min media query is
    // active; $flex-gutter-xs = $space-base * .25 = 4px
    expect(style.getPropertyValue('margin')).toBe(uiDefaults.flexGutterXs)
  })

  test('style blocks without sass variables still work', () => {
    const wrapper = mount(PlainTest)

    const { element } = wrapper.get('div.my-plain-div')
    expect(window.getComputedStyle(element).getPropertyValue('padding')).toBe(
      plainTestPadding
    )
  })
})
