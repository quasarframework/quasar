import { describe, expect, test } from 'vitest'

import renderSSRError from './index.js'

function createRequest({ headers = {}, url = '/', method = 'GET' } = {}) {
  return {
    headers,
    url,
    method,
    httpVersion: '1.1',
    socket: {
      encrypted: false,
      remoteAddress: '127.0.0.1',
      remotePort: 12_345
    }
  }
}

describe('renderSSRError', () => {
  test('does not leak shell environment variables into the error page', () => {
    const secret = 'quasar-ssr-error-test-secret'
    process.env.QUASAR_SSR_ERROR_TEST_SECRET = secret

    try {
      const { errorHtml } = renderSSRError({
        err: new Error('test error'),
        req: createRequest(),
        rootFolder: process.cwd()
      })

      expect(errorHtml.includes(secret)).toBe(false)
      expect(errorHtml.includes('Shell environment variables')).toBe(false)
    } finally {
      delete process.env.QUASAR_SSR_ERROR_TEST_SECRET
    }
  })

  test('escapes hostile markup from the error and request headers', () => {
    const hostileValue = '</ScRiPt><script>globalThis.injected=true</script>'
    const { errorHtml } = renderSSRError({
      err: new Error(hostileValue),
      req: createRequest({
        headers: {
          'x-test-value': hostileValue
        }
      }),
      rootFolder: process.cwd()
    })

    expect(errorHtml.includes(hostileValue)).toBe(false)
    expect(
      errorHtml.includes(String.raw`\u003C/ScRiPt\u003E\u003Cscript\u003E`)
    ).toBe(true)
  })
})
