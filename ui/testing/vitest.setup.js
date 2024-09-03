import { config } from '@vue/test-utils'
import { expect } from 'vitest'

import { isRef, isReactive } from 'vue'

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
      const result = window.getComputedStyle(wrapper.element)
      return prop === void 0
        ? result
        : result.getPropertyValue(prop)
    }
  }
})

// jsdom not supplying this
window.scrollTo = () => {}

/**
 * Examples:
 *   expect(variable).$any([ 'x', 'y', 1, /z/, ... ])
 *   expect(variable).$any([ expect.any(String), expect.any(Number) ])
 *   expect.$any([ 'x', 'y', 1, /z/, ... ])
 *   expect.$any([ expect.any(String), expect.any(Number), 'xyz' ])
 */
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

/**
 * Examples:
 *   expect(arr).$arrayValues({ ... })
 *   expect.$arrayValues({ ... })
 */
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

/**
 * Examples:
 *   expect(obj).$objectValues({ ... })
 *   expect.$objectValues({ ... })
 */
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

/**
 * Examples:
 *   expect(variable).$ref()
 *   expect.$ref()
 *   expect.$ref(<someValue>)
 *   expect.$ref(expect.any(Number))
 */
export function $ref (received, expected) {
  const pass = (
    isRef(received)
    && (expected === void 0 || this.equals(received.value, expected))
  )

  return {
    pass,
    message: () =>
      `expected ${ this.utils.printReceived(
        received.value
      ) } to${ this.isNot ? ' not' : '' } be a ref/computed${ expected !== void 0
        ? ` and be equal to ${ this.utils.printExpected(expected) }`
        : ''
      }`
  }
}

/**
 * Examples:
 *   expect(variable).$reactive()
 *   expect.$reactive()
 *   expect.$reactive(<someValue>)
 *   expect.$reactive(expect.any(Boolean))
 */
export function $reactive (received, expected) {
  const pass = (
    isReactive(received)
    && (expected === void 0 || this.equals(received, expected))
  )

  return {
    pass,
    message: () =>
      `expected ${ this.utils.printReceived(
        received
      ) } to${ this.isNot ? ' not' : '' } be reactive${ expected !== void 0
        ? ` and be equal to ${ this.utils.printExpected(expected) }`
        : ''
      }`
  }
}

expect.extend({
  $any,
  $objectValues,
  $arrayValues,
  $ref,
  $reactive
})
