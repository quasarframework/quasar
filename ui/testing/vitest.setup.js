import { config } from '@vue/test-utils'
import { expect } from 'vitest'

import { isReactive, isRef } from 'vue'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import quasarVuePlugin from 'quasar/src/vue-plugin.js'

const originalConsoleError = console.error
console.error = (...args) => {
  originalConsoleError(...args)
  throw new Error(`Test failed due to console.error: ${args.join(' ')}`)
}

const originalConsoleWarn = console.warn
console.warn = (...args) => {
  originalConsoleWarn(...args)
  throw new Error(`Test failed due to console.warn: ${args.join(' ')}`)
}

config.global.plugins.push(quasarVuePlugin)

config.plugins.DOMWrapper.install(wrapper => ({
  $style: prop =>
    prop === void 0 ? wrapper.attributes('style') : wrapper.element.style[prop],

  $computedStyle: prop => {
    const result = window.getComputedStyle(wrapper.element)
    return prop === void 0 ? result : result.getPropertyValue(prop)
  }
}))

// jsdom not supplying this
window.scrollTo = () => {}

/**
 * Examples:
 *   expect(variable).$any([ 'x', 'y', 1, /z/, ... ])
 *   expect(variable).$any([ expect.any(String), expect.any(Number) ])
 *   expect.$any([ 'x', 'y', 1, /z/, ... ])
 *   expect.$any([ expect.any(String), expect.any(Number), 'xyz' ])
 */
function $any(received, expectedList) {
  if (!Array.isArray(expectedList)) {
    throw new TypeError('The second argument must be an array of matchers!')
  }

  const pass = expectedList.some(expected => this.equals(received, expected))

  return {
    pass,
    message: () =>
      `expected ${this.utils.printReceived(
        received
      )} to${this.isNot ? ' not' : ''} be any of: ${this.utils.printExpected(expectedList)}`
  }
}

const vuePropOptionKeys = new Set(['type', 'required', 'default', 'validator'])

function isVuePropType(value, allowTrue = false) {
  return (
    value === null ||
    typeof value === 'function' ||
    (allowTrue === true && value === true) ||
    (Array.isArray(value) &&
      value.every(type => type === null || typeof type === 'function'))
  )
}

function isVuePropDefinition(value) {
  if (isVuePropType(value)) {
    return true
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const keys = Object.keys(value)

  return (
    keys.every(key => vuePropOptionKeys.has(key)) &&
    (value.type === void 0 || isVuePropType(value.type, true)) &&
    (value.required === void 0 || typeof value.required === 'boolean') &&
    (value.validator === void 0 || typeof value.validator === 'function')
  )
}

/**
 * Examples:
 *   expect(component.props).$props()
 *   expect(composableProps).$props()
 */
export function $props(received) {
  const isObject =
    received !== null &&
    typeof received === 'object' &&
    Array.isArray(received) === false
  const invalidKeys = isObject
    ? Object.keys(received).filter(
        key =>
          key.startsWith('$') || isVuePropDefinition(received[key]) === false
      )
    : []
  const pass = isObject && invalidKeys.length === 0

  return {
    pass,
    message: () =>
      `expected ${this.utils.printReceived(
        received
      )} to${this.isNot ? ' not' : ''} be an object containing valid Vue prop definitions${
        invalidKeys.length !== 0
          ? `; invalid prop keys: ${this.utils.printReceived(invalidKeys)}`
          : ''
      }`
  }
}

function isVueEmitsDefinition(value) {
  if (Array.isArray(value)) {
    return value.every(eventName => typeof eventName === 'string')
  }

  return (
    value !== null &&
    typeof value === 'object' &&
    Object.values(value).every(
      validator => validator === null || typeof validator === 'function'
    )
  )
}

/**
 * Examples:
 *   expect(component.emits).$emits()
 *   expect(composableEmits).$emits()
 */
export function $emits(received) {
  const pass = isVueEmitsDefinition(received)

  return {
    pass,
    message: () =>
      `expected ${this.utils.printReceived(
        received
      )} to${this.isNot ? ' not' : ''} be a valid Vue emits definition`
  }
}

/**
 * Examples:
 *   expect(arr).$arrayValues({ ... })
 *   expect.$arrayValues({ ... })
 */
export function $arrayValues(received, expected) {
  const pass =
    Array.isArray(received) &&
    received.every(item => this.equals(item, expected))

  return {
    pass,
    message: () =>
      `expected ${this.utils.printReceived(
        received
      )} to${this.isNot ? ' not' : ''} be: ${this.utils.printExpected(expected)}`
  }
}

/**
 * Examples:
 *   expect(obj).$objectValues({ ... })
 *   expect.$objectValues({ ... })
 */
export function $objectValues(received, expected) {
  const pass =
    typeof received === 'object' &&
    Object.keys(received).every(key => this.equals(received[key], expected))

  return {
    pass,
    message: () =>
      `expected ${this.utils.printReceived(
        received
      )} to${this.isNot ? ' not' : ''} have each key-value in the form defined by ${this.utils.printExpected(
        expected
      )}`
  }
}

/**
 * Examples:
 *   expect(variable).$ref()
 *   expect.$ref()
 *   expect.$ref(<someValue>)
 *   expect.$ref(expect.any(Number))
 */
export function $ref(received, expected) {
  const pass =
    isRef(received) &&
    (expected === void 0 || this.equals(received.value, expected))

  return {
    pass,
    message: () =>
      `expected ${this.utils.printReceived(
        received.value
      )} to${this.isNot ? ' not' : ''} be a ref/computed${
        expected !== void 0
          ? ` and be equal to ${this.utils.printExpected(expected)}`
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
export function $reactive(received, expected) {
  const pass =
    isReactive(received) &&
    (expected === void 0 || this.equals(received, expected))

  return {
    pass,
    message: () =>
      `expected ${this.utils.printReceived(received)} to${this.isNot ? ' not' : ''} be reactive${
        expected !== void 0
          ? ` and be equal to ${this.utils.printExpected(expected)}`
          : ''
      }`
  }
}

expect.extend({
  $any,
  $emits,
  $props,
  $objectValues,
  $arrayValues,
  $ref,
  $reactive
})
