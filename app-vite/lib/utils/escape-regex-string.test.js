import { describe, expect, test } from 'vitest'

import { escapeRegexString } from './escape-regex-string.js'

describe('[escape-regex-string.js]', () => {
  test('escapes all regex special characters', () => {
    const raw = String.raw`a.b*c?d(e)f[g]h{i}j|k^l$m+n\o`
    const re = new RegExp(`^${escapeRegexString(raw)}$`)

    expect(re.test(raw)).toBe(true)
    expect(re.test(String.raw`aXb*c?d(e)f[g]h{i}j|k^l$m+n\o`)).toBe(false)
  })

  test('escapes dashes so the result is safe inside character classes', () => {
    const escaped = escapeRegexString('a-z')
    expect(escaped).toContain(String.raw`\x2d`)
    expect(new RegExp(`[${escaped}]`).test('-')).toBe(true)
    expect(new RegExp(`[${escaped}]`).test('m')).toBe(false)
  })
})
