import { config } from '@vue/test-utils'
import { expect } from 'vitest'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import quasarVuePlugin from 'quasar/src/vue-plugin.js'

config.global.plugins.push(quasarVuePlugin)

config.plugins.DOMWrapper.install(wrapper => {
  return {
    $style: prop => (
      prop === void 0
        ? wrapper.attributes('style')
        : wrapper.element.style[ prop ]
    ),

    $computedStyle: prop => {
      return window.getComputedStyle(wrapper.element)
        .getPropertyValue(prop)
    }
  }
})

// jsdom not supplying this
window.scrollTo = () => {}

function $any (received, expectedList) {
  if (Array.isArray(expectedList) === false) {
    throw new TypeError('The second argument must be an array of matchers!')
  }

  const pass = expectedList.some(expected => this.equals(received, expected))

  return {
    pass,
    message: () =>
      `expected ${ this.utils.printReceived(
        received
      ) } to${ this.isNot ? ' not' : '' } be any of: ${ this.utils.printExpected(
        expectedList
      ) }`
  }
}

export function $arrayValues (received, expected) {
  const pass = Array.isArray(received) === true
    && received.every(item => this.equals(item, expected))

  return {
    pass,
    message: () =>
      `expected ${ this.utils.printReceived(
        received
      ) } to${ this.isNot ? ' not' : '' } be: ${ this.utils.printExpected(
        expected
      ) }`
  }
}

export function $objectValues (received, expected) {
  const pass = (
    typeof received === 'object'
    && Object.keys(received).every(key => this.equals(received[ key ], expected))
  )

  return {
    pass,
    message: () =>
      `expected ${ this.utils.printReceived(
        received
      ) } to${ this.isNot ? ' not' : '' } have each key-value in the form defined by ${ this.utils.printExpected(
        expected
      ) }`
  }
}

expect.extend({
  $any,
  $objectValues,
  $arrayValues
})
