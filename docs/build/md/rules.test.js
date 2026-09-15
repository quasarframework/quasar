import { expect, test } from 'vitest'
import { sharedMdOptions } from './md-rules.js'

test('sharedMdOptions matches the live site config', () => {
  expect(sharedMdOptions).toStrictEqual({
    html: true,
    linkify: false,
    typographer: true
  })
})
