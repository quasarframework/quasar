import { describe, expect, test } from 'vitest'

import { encodeForDiff } from './encode-for-diff.js'

describe('[encode-for-diff.js]', () => {
  test('encodes equal configurations identically', () => {
    const make = () => ({
      list: [1, 'two', { three: true }],
      fn: (a, b) => a + b,
      re: /some-[a-z]+/
    })

    expect(encodeForDiff(make())).toBe(encodeForDiff(make()))
  })

  test('function implementation changes alter the encoding', () => {
    expect(encodeForDiff({ fn: () => 1 })).not.toBe(
      encodeForDiff({ fn: () => 2 })
    )
  })

  test('encodes regular expressions by their source', () => {
    expect(encodeForDiff({ re: /abc/ })).toContain('abc')
    expect(encodeForDiff({ re: /abc/ })).not.toBe(encodeForDiff({ re: /abd/ }))
  })
})
