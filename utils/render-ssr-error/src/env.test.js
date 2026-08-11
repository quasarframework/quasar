import { describe, expect, test } from 'vitest'

import { getEnv } from './env.js'

function createRequest({ headers = {} } = {}) {
  return {
    headers,
    url: '/',
    method: 'GET',
    httpVersion: '1.1',
    socket: {
      encrypted: false,
      remoteAddress: '127.0.0.1',
      remotePort: 12_345
    }
  }
}

describe('getEnv', () => {
  test('parses cookies defensively and null-prototypes the env maps', () => {
    const env = getEnv(
      createRequest({
        headers: {
          cookie: 'valid=value; malformed=%E0%A4%A; empty=',
          __proto__: 'safe'
        }
      })
    )

    expect({ ...env.Cookies }).toEqual({
      valid: 'value',
      malformed: '%E0%A4%A',
      empty: ''
    })
    expect(Object.getPrototypeOf(env.Headers)).toBeNull()
    expect(Object.getPrototypeOf(env.Cookies)).toBeNull()
  })
})
