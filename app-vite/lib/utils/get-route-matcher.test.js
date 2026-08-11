import { describe, expect, test } from 'vitest'

import { getRouteMatcher } from './get-route-matcher.js'

describe('[get-route-matcher.js]', () => {
  test('matches routes against the given patterns', () => {
    const matches = getRouteMatcher(['/about', '/users/**'])

    expect(matches('/about')).toBe(true)
    expect(matches('/users/42/profile')).toBe(true)
    expect(matches('/contact')).toBe(false)
  })

  test('tolerates trailing slashes on routes', () => {
    const matches = getRouteMatcher(['/about'])

    expect(matches('/about/')).toBe(true)
    expect(matches('/about///')).toBe(true)
  })

  test('the root route only matches its own pattern', () => {
    expect(getRouteMatcher(['/'])('/')).toBe(true)
    expect(getRouteMatcher(['/about'])('/')).toBe(false)
  })
})
