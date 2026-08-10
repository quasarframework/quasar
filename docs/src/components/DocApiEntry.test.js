import { expect, test } from 'vitest'

import {
  getEventParams,
  getMethodParams,
  getMethodReturnValue,
  getStringType
} from './DocApiEntry.js'

test('formats event signatures', () => {
  expect(getEventParams({})).toBe('() => void')
  expect(getEventParams({ params: { value: {}, evt: {} } })).toBe(
    '(value, evt) => void'
  )
})

test('formats method params, optional ones marked', () => {
  expect(getMethodParams({})).toBe(' ()')

  const method = {
    params: {
      value: { required: true },
      offset: {},
      done: {}
    }
  }
  expect(getMethodParams(method)).toBe(' (value, offset?, done?)')
  expect(getMethodParams(method, true)).toBe(' (value, offset, done)')
})

test('formats method return values', () => {
  expect(getMethodReturnValue({})).toBe(' => void')
  expect(getMethodReturnValue({ returns: { type: 'Boolean' } })).toBe(
    ' => Boolean'
  )
  expect(
    getMethodReturnValue({ returns: { type: ['Number', 'String'] } })
  ).toBe(' => Number | String')
})

test('joins union types', () => {
  expect(getStringType('Number')).toBe('Number')
  expect(getStringType(['Number', 'String'])).toBe('Number | String')
})
