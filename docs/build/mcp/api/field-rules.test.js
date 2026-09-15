import { expect, test } from 'vitest'
import {
  buildHead,
  formatType,
  shouldDropField,
  stripBuildMarker
} from './field-rules.js'

test('formatType maps Quasar primitives to TS lowercase', () => {
  expect(formatType('String')).toBe('string')
  expect(formatType('Number')).toBe('number')
  expect(formatType('Boolean')).toBe('boolean')
  expect(formatType('Any')).toBe('any')
  expect(formatType('Object')).toBe('object')
})

test('formatType handles arrays', () => {
  expect(formatType('Array')).toBe('any[]')
})

test('formatType preserves DOM/lib types', () => {
  expect(formatType('Element')).toBe('Element')
  expect(formatType('Event')).toBe('Event')
  expect(formatType('Promise')).toBe('Promise')
})

test('formatType unions arrays', () => {
  expect(formatType(['String', 'Number'])).toBe('string | number')
})

test('formatType strips undefined from union arrays (already encoded by optional modifier)', () => {
  expect(formatType(['Function', 'undefined'])).toBe('Function')
  expect(formatType(['String', 'undefined'])).toBe('string')
})

test('formatType strips null from union arrays', () => {
  expect(formatType(['String', 'null'])).toBe('string')
})

test('formatType collapses pure undefined union to "undefined"', () => {
  expect(formatType(['undefined'])).toBe('undefined')
})

test('formatType unknown types pass through', () => {
  expect(formatType('NamedColor')).toBe('NamedColor')
})

test('buildHead for required prop with default', () => {
  const head = buildHead('size', {
    type: 'String',
    required: true,
    default: 'md'
  })
  expect(head).toBe('- `size` (string, required), default `md`')
})

test('buildHead for optional with syncable + addedIn', () => {
  const head = buildHead('inner-min', {
    type: 'Number',
    syncable: true,
    addedIn: 'v2.5.4'
  })
  expect(head).toBe(
    '- `inner-min` (number, optional, syncable) *(added v2.5.4)*'
  )
})

test('buildHead absent required maps to optional', () => {
  const head = buildHead('x', { type: 'Boolean' })
  expect(head).toBe('- `x` (boolean, optional)')
})

test('stripBuildMarker removes "# " prefix', () => {
  expect(stripBuildMarker('# v-model="myValue"')).toBe('v-model="myValue"')
})

test('stripBuildMarker leaves non-strings alone', () => {
  expect(stripBuildMarker(0)).toBe(0)
  expect(stripBuildMarker(null)).toBe(null)
})

test('shouldDropField identifies droppable fields', () => {
  expect(shouldDropField('category')).toBe(true)
  expect(shouldDropField('tsType')).toBe(true)
  expect(shouldDropField('tsInjectionPoint')).toBe(true)
  expect(shouldDropField('desc')).toBe(false)
  expect(shouldDropField('type')).toBe(false)
})
