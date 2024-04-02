import { config } from '@vue/test-utils'
import { expect } from 'vitest'

import { $toBeOneOfTypes, $objectWithEachKeyContaining } from './specs/specs.utils.js'

import '@quasar/extras/material-icons/material-icons.css'
import '../src/css/index.sass'

import installQuasar from '../src/install-quasar.js'
import * as plugins from '../src/plugins.js'

config.global.plugins.push({
  install: app => installQuasar(app, { plugins })
})

config.plugins.DOMWrapper.install(wrapper => {
  return {
    $style: prop => (
      prop === void 0
        ? wrapper.attributes('style')
        : wrapper.element.style[ prop ]
    ),
    $computedStyle: prop => window.getComputedStyle(wrapper.element).getPropertyValue(prop)
  }
})

// jsdom not supplying this
window.scrollTo = () => {}

expect.extend({
  $toBeOneOfTypes,
  $objectWithEachKeyContaining
})
