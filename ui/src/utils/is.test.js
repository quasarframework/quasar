import { describe, test, expect } from 'vitest'

import is from './is.js'

describe('[is API]', () => {
  describe('[Functions]', () => {
    describe('[(function)deepEqual]', () => {
      test.each([
        [ 'Number', 5, 5 ],
        [ 'String', 'a', 'a' ],
        [ 'Boolean', true, true ],
        [ 'Null', null, null ],
        [ 'Undefined', undefined, undefined ],
        [ 'NaN', NaN, NaN ],
        [ 'Infinity', Infinity, Infinity ],
        [ 'Date', new Date(150), new Date(150) ],
        [ 'RegExp', /./, /./ ],
        [ 'Array', [ 1, 2, 3 ], [ 1, 2, 3 ] ],
        [ 'Map', new Map([ [ 1, 'one' ], [ 2, 'two' ] ]), new Map([ [ 1, 'one' ], [ 2, 'two' ] ]) ],
        [ 'Deep Map', new Map([ [ 1, { a: { b: { c: { d: 5 } } } } ], [ 2, 'two' ] ]), new Map([ [ 1, { a: { b: { c: { d: 5 } } } } ], [ 2, 'two' ] ]) ],
        [ 'Object', { a: true, b: false }, { a: true, b: false } ],
        [ 'Deep object', { a: { b: { c: { d: 5 } } } }, { a: { b: { c: { d: 5 } } } } ],
        [ 'Array', [ 1, 2, 3 ], [ 1, 2, 3 ] ],
        [ 'Deep array', [ 1, { a: true, b: { c: 1 } } ], [ 1, { a: true, b: { c: 1 } } ] ],
        [ 'Set', new Set([ 1, 2, 3 ]), new Set([ 1, 2, 3 ]) ]
      ])('deepEqual(%s) matching', (_, a, b) => {
        expect(
          is.deepEqual(a, b)
        ).toBe(true)
      })

      test.each([
        [ '5, 6', 5, 6 ],
        [ '5, str(5)', 5, '5' ],
        [ '5, null', 5, null ],
        [ '5, undefined', 5, undefined ],
        [ '5, NaN', 5, NaN ],
        [ '5, Infinity', 5, Infinity ],
        [ '5, {}', 5, {} ],
        [ '5, []', 5, [] ],
        [ '5, Date', 5, new Date() ],
        [ '5, /./', 5, /./ ],
        [ '5, Map()', 5, new Map([ [ 5, 'five' ] ]) ],
        [ '5, Set()', 5, new Set([ 5 ]) ],
        [ '5, Fn', 5, () => 5 ]
      ])('deepEqual(%s)', (_, a, b) => {
        expect(
          is.deepEqual(a, b)
        ).toBe(false)
      })
    })

    describe('[(function)object]', () => {
      test.each([
        [ '{}', {}, true ],
        [ '{ a: true }', { a: true }, true ],
        [ '[]', [], false ],
        [ '5', 5, false ],
        [ 'null', null, false ],
        [ 'undefined', undefined, false ],
        [ 'NaN', NaN, false ],
        [ 'Infinity', Infinity, false ],
        [ 'Symbol()', Symbol('q'), false ]
      ])('has correct return value for %s', (_, value, expected) => {
        expect(
          is.object(value)
        ).toBe(expected)
      })
    })

    describe('[(function)date]', () => {
      test.each([
        [ 'new Date()', new Date(), true ],
        [ 'Date.now()', Date.now(), false ],
        [ '5', 5, false ],
        [ '{}', {}, false ],
        [ 'null', null, false ],
        [ 'undefined', undefined, false ],
        [ 'NaN', NaN, false ],
        [ 'Infinity', Infinity, false ],
        [ 'Symbol()', Symbol('q'), false ]
      ])('has correct return value for %s', (_, value, expected) => {
        expect(
          is.date(value)
        ).toBe(expected)
      })
    })

    describe('[(function)regexp]', () => {
      test.each([
        [ '/./', /./, true ],
        [ 'new RegExp()', new RegExp(), true ],
        [ 'RegExp()', RegExp(), true ],
        [ '5', 5, false ],
        [ '{}', {}, false ],
        [ 'null', null, false ],
        [ 'undefined', undefined, false ],
        [ 'NaN', NaN, false ],
        [ 'Infinity', Infinity, false ],
        [ 'Symbol()', Symbol('q'), false ]
      ])('has correct return value for %s', (_, value, expected) => {
        expect(
          is.regexp(value)
        ).toBe(expected)
      })
    })

    describe('[(function)number]', () => {
      test.each([
        [ '5', 5, true ],
        [ '5.5', 5.5, true ],
        [ 'NaN', NaN, false ],
        [ 'Infinity', Infinity, false ],
        [ 'Symbol()', Symbol('q'), false ],
        [ '{}', {}, false ],
        [ 'null', null, false ],
        [ 'undefined', undefined, false ]
      ])('has correct return value for %s', (_, value, expected) => {
        expect(
          is.number(value)
        ).toBe(expected)
      })
    })
  })
})
