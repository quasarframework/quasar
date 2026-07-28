import assert from 'node:assert/strict'

import renderSSRError from '../src/index.js'
import { getEnv } from '../src/env.js'

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

{
  const secret = 'quasar-ssr-error-test-secret'
  process.env.QUASAR_SSR_ERROR_TEST_SECRET = secret

  try {
    const { errorHtml } = renderSSRError({
      err: new Error('test error'),
      req: createRequest(),
      rootFolder: process.cwd()
    })

    assert.equal(errorHtml.includes(secret), false)
    assert.equal(errorHtml.includes('Shell environment variables'), false)
  } finally {
    delete process.env.QUASAR_SSR_ERROR_TEST_SECRET
  }
}

{
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

  assert.equal(errorHtml.includes(hostileValue), false)
  assert.equal(
    errorHtml.includes(String.raw`\u003C/ScRiPt\u003E\u003Cscript\u003E`),
    true
  )
}

{
  const env = getEnv(
    createRequest({
      headers: {
        cookie: 'valid=value; malformed=%E0%A4%A; empty=',
        __proto__: 'safe'
      }
    })
  )

  assert.deepEqual(
    { ...env.Cookies },
    {
      valid: 'value',
      malformed: '%E0%A4%A',
      empty: ''
    }
  )
  assert.equal(Object.getPrototypeOf(env.Headers), null)
  assert.equal(Object.getPrototypeOf(env.Cookies), null)
}

console.log('render-ssr-error security tests passed')
