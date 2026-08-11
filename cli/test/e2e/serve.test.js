import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { request } from 'node:https'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { binFile, run, withServer } from './e2e-utils.js'

// the certificates in play are self-signed,
// so certificate validation must be skipped
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = request(url, { rejectUnauthorized: false }, res => {
      let body = ''
      res.on('data', chunk => {
        body += chunk
      })
      res.on('end', () => resolve({ status: res.statusCode, body }))
    })

    req.on('error', reject)
    req.end()
  })
}

const workDir = mkdtempSync(join(tmpdir(), 'quasar-cli-serve-'))
const distDir = join(workDir, 'dist')
const proxyFile = join(workDir, 'proxy-config.mjs')

mkdirSync(join(distDir, 'sub'), { recursive: true })
writeFileSync(
  join(distDir, 'index.html'),
  '<html><body>INDEX-PAGE</body></html>'
)
writeFileSync(
  join(distDir, 'custom.html'),
  '<html><body>CUSTOM-PAGE</body></html>'
)
writeFileSync(join(distDir, 'sub/file.txt'), 'SUB-FILE')
writeFileSync(
  proxyFile,
  'export default ({ app }) => {\n' +
    "  app.get('/proxy-marker', c => c.text('PROXIED-RESPONSE'))\n" +
    '}\n'
)

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

let portCounter = 4870
const serveArgs = (extraArgs = []) => ({
  args: [
    'serve',
    distDir,
    '--hostname',
    '127.0.0.1',
    '--port',
    String(++portCounter),
    ...extraArgs
  ],
  cwd: workDir
})

describe('[e2e] serve', () => {
  test('serves the static folder', async () => {
    await withServer(serveArgs(), async ({ url, getOutput }) => {
      const index = await fetch(url)
      expect(index.status).toBe(200)
      expect(await index.text()).toContain('INDEX-PAGE')

      const asset = await fetch(`${url}/sub/file.txt`)
      expect(asset.status).toBe(200)
      expect(await asset.text()).toBe('SUB-FILE')

      const missing = await fetch(`${url}/missing.txt`)
      expect(missing.status).toBe(404)

      // requests get logged unless --silent is used
      expect(getOutput()).toContain('[GET]')
    })
  })

  test('serves a custom index file', async () => {
    await withServer(serveArgs(['--index', 'custom.html']), async ({ url }) => {
      const index = await fetch(url)
      expect(index.status).toBe(200)
      expect(await index.text()).toContain('CUSTOM-PAGE')
    })
  })

  test('suppresses request logs with --silent', async () => {
    await withServer(serveArgs(['--silent']), async ({ url, getOutput }) => {
      await fetch(url)
      expect(getOutput()).not.toContain('[GET]')
    })
  })

  test('falls back to the index in history mode', async () => {
    await withServer(serveArgs(['--history']), async ({ url }) => {
      // a client-side route only exists in the SPA router
      const spaRoute = await fetch(`${url}/some/spa/route`, {
        headers: { accept: 'text/html' }
      })
      expect(spaRoute.status).toBe(200)
      expect(await spaRoute.text()).toContain('INDEX-PAGE')

      // existing files still get served
      const asset = await fetch(`${url}/sub/file.txt`, {
        headers: { accept: 'text/html' }
      })
      expect(await asset.text()).toBe('SUB-FILE')

      // non-html requests don't get the fallback
      const missing = await fetch(`${url}/missing.txt`)
      expect(missing.status).toBe(404)
    })
  })

  test('sends CORS headers with --cors', async () => {
    await withServer(serveArgs(['--cors']), async ({ url }) => {
      const response = await fetch(url)
      expect(response.headers.get('access-control-allow-origin')).toBe('*')
    })
  })

  test('extends the server through a proxy definition file', async () => {
    await withServer(serveArgs(['--proxy', proxyFile]), async ({ url }) => {
      const proxied = await fetch(`${url}/proxy-marker`)
      expect(proxied.status).toBe(200)
      expect(await proxied.text()).toBe('PROXIED-RESPONSE')

      // static serving still works alongside the proxy routes
      const index = await fetch(url)
      expect(index.status).toBe(200)
    })
  })

  test('serves over TLS with a generated certificate', async () => {
    await withServer(serveArgs(['--https']), async ({ url }) => {
      expect(url).toMatch(/^https:/)

      const index = await httpsGet(url)
      expect(index.status).toBe(200)
      expect(index.body).toContain('INDEX-PAGE')
    })
  })

  test('serves over TLS with a provided certificate', async () => {
    // the ssl-certificate package produces a single pem holding
    // both the private key and the certificate
    const { getCertificate } = await import('@quasar/ssl-certificate')
    const pem = await getCertificate({
      log: () => {},
      fatal: msg => {
        throw new Error(msg)
      }
    })

    const pemFile = join(workDir, 'ssl-server.pem')
    writeFileSync(pemFile, pem)

    await withServer(
      serveArgs(['--https', '--cert', pemFile, '--key', pemFile]),
      async ({ url }) => {
        const index = await httpsGet(url)
        expect(index.status).toBe(200)
        expect(index.body).toContain('INDEX-PAGE')
      }
    )
  })

  test('fails on missing SSL key/cert files', async () => {
    const { code, output } = await run(
      process.execPath,
      [
        binFile,
        ...serveArgs(['--https', '--cert', 'nope.pem', '--key', 'nope.pem'])
          .args
      ],
      workDir
    )
    expect(code).toBe(1)
    expect(output).toContain('SSL key file not found')
  })

  test('fails on a missing index file in history mode', async () => {
    const { code, output } = await run(
      process.execPath,
      [binFile, ...serveArgs(['--history', '--index', 'nope.html']).args],
      workDir
    )
    expect(code).toBe(1)
    expect(output).toContain('Index file not found')
  })

  test('fails on a missing proxy definition file', async () => {
    const { code, output } = await run(
      process.execPath,
      [binFile, ...serveArgs(['--proxy', './nope.mjs']).args],
      workDir
    )
    expect(code).toBe(1)
    expect(output).toContain('Proxy definition file not found')
  })
})
