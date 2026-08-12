/**
 * Cross-engine driver for the self-verdicting playground page at
 * /web-tests/regression-sweep (see that file for the scenario list and
 * the ?autorun&tag=&beacon= contract).
 *
 * Not part of `pnpm test` -- it needs real browsers and, optionally, a
 * macOS Simulator, so it is run on demand:
 *
 *   pnpm test:sweep                 chromium + firefox + webkit (Playwright)
 *   pnpm test:sweep --safari        + real desktop Safari via safaridriver
 *                                   (one-time: `safaridriver --enable`)
 *   pnpm test:sweep --ios           + Mobile Safari in the iOS Simulator
 *                                   (full Xcode; device via SWEEP_IOS_DEVICE,
 *                                   default "iPhone 17")
 *   pnpm test:sweep --all           everything above
 *
 * Boots the playground dev server itself; set SWEEP_SERVER_URL to reuse an
 * already-running one (same convention as E2E_SERVER_URL for e2e:ssr).
 *
 * Exits non-zero if any executed scenario fails.
 */

import { execFile, spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const rootFolder = join(import.meta.dirname, '../..')
const ROUTE = '/web-tests/regression-sweep'
const BEACON_PORT = 8480
const SAFARIDRIVER_PORT = 4447
const IOS_DEVICE = process.env.SWEEP_IOS_DEVICE || 'iPhone 17'

const args = process.argv.slice(2)
const withSafari = args.includes('--safari') || args.includes('--all')
const withIos = args.includes('--ios') || args.includes('--all')

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

let devServerChild = null
let failed = false

function printResults(name, results) {
  const passCount = results.filter(r => r.pass).length
  console.log(`\n=== ${name}: ${passCount}/${results.length} ===`)
  for (const r of results) {
    console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}  [${r.detail}]`)
  }
  if (passCount !== results.length) {
    failed = true
  }
}

function getServerUrl() {
  if (process.env.SWEEP_SERVER_URL !== void 0) {
    return process.env.SWEEP_SERVER_URL
  }

  console.log('Booting the playground dev server (SWEEP_SERVER_URL to skip)...')

  devServerChild = spawn('pnpm', ['dev'], {
    cwd: join(rootFolder, 'playground'),
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  })

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('dev server did not report an App URL within 240s'))
    }, 240_000)

    // the banner arrives colored and possibly split across chunks
    let buffer = ''
    devServerChild.stdout.on('data', chunk => {
      // oxlint-disable-next-line no-control-regex
      buffer += String(chunk).replaceAll(/\u001B\[[0-9;]*m/g, '')
      const match = buffer.match(/App URL\.*\s*(http:\/\/\S+)/)
      if (match !== null) {
        clearTimeout(timer)
        resolve(match[1].replace(/\/$/, ''))
      }
    })
  })
}

function stopDevServer() {
  if (devServerChild !== null) {
    try {
      // quasar dev spawns its own children; kill the whole group
      process.kill(-devServerChild.pid, 'SIGTERM')
    } catch {}
    devServerChild = null
  }
}

async function runPlaywrightEngines(serverUrl) {
  const { chromium, firefox, webkit } = await import('playwright')

  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch()
    try {
      const page = await browser.newPage({
        viewport: { width: 1280, height: 900 }
      })
      await page.goto(`${serverUrl}${ROUTE}?autorun&tag=${name}`)
      await page.waitForFunction('window.__done === true', null, {
        timeout: 120_000
      })
      const { results } = await page.evaluate('window.__results')
      printResults(name, results)
    } catch (err) {
      failed = true
      console.log(`\n=== ${name} ERROR: ${err.message.split('\n')[0]}`)
    } finally {
      await browser.close()
    }
  }
}

async function runSafari(serverUrl) {
  const driver = spawn('safaridriver', ['-p', String(SAFARIDRIVER_PORT)], {
    stdio: 'ignore'
  })
  const base = `http://127.0.0.1:${SAFARIDRIVER_PORT}`
  let sessionId = null

  try {
    await sleep(1000)

    const session = await fetch(`${base}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        capabilities: { alwaysMatch: { browserName: 'safari' } }
      })
    }).then(res => res.json())

    sessionId = session.value?.sessionId
    if (sessionId === void 0) {
      throw new Error(
        'no Safari session -- is "Allow remote automation" enabled? (' +
          JSON.stringify(session.value).slice(0, 120) +
          ')'
      )
    }

    await fetch(`${base}/session/${sessionId}/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: `${serverUrl}${ROUTE}?autorun&tag=safari` })
    })

    for (let i = 0; i < 60; i++) {
      const res = await fetch(`${base}/session/${sessionId}/execute/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script:
            'return window.__done === true ? JSON.stringify(window.__results) : null',
          args: []
        })
      }).then(r => r.json())

      if (res.value !== null) {
        printResults('safari', JSON.parse(res.value).results)
        return
      }
      await sleep(3000)
    }
    throw new Error('timed out waiting for the sweep to finish')
  } catch (err) {
    failed = true
    console.log(`\n=== safari ERROR: ${err.message}`)
  } finally {
    if (sessionId !== null) {
      await fetch(`${base}/session/${sessionId}`, { method: 'DELETE' }).catch(
        () => {}
      )
    }
    driver.kill()
  }
}

async function runIos(serverUrl) {
  // the simulator has no scriptable DOM access; the page reports through
  // a beacon GET whose path this throwaway collector records
  let verdictPath = null
  const collector = createServer((req, res) => {
    if (req.url.startsWith('/__verdict__')) {
      verdictPath = req.url
    }
    res.statusCode = 204
    res.end()
  })
  await new Promise(resolve => {
    collector.listen(BEACON_PORT, '127.0.0.1', resolve)
  })

  try {
    await execFileAsync('xcrun', ['simctl', 'boot', IOS_DEVICE]).catch(err => {
      if (!String(err.stderr).includes('current state: Booted')) throw err
    })
    await execFileAsync('xcrun', ['simctl', 'bootstatus', IOS_DEVICE, '-b'])

    const url =
      `${serverUrl}${ROUTE}?autorun&tag=ios` +
      `&beacon=${encodeURIComponent(`http://127.0.0.1:${BEACON_PORT}`)}`
    await execFileAsync('xcrun', ['simctl', 'openurl', 'booted', url])

    for (let i = 0; i < 60; i++) {
      // set from the collector's request callback
      if (verdictPath !== null) break
      await sleep(3000)
    }

    if (verdictPath === null) {
      throw new Error('timed out waiting for the beacon')
    }

    // /__verdict__<tag>__<n>of<m>__S1=P,...[__<encoded fail details>]
    // (the leading "/__" makes element 0 "/" and element 1 "verdict")
    const parts = verdictPath.split('__')
    const score = parts[3]
    const compact = parts[4]
    const details = parts[5]
    const [passCount, total] = score.split('of').map(Number)
    console.log(`\n=== ios (${IOS_DEVICE}): ${passCount}/${total} ===`)
    console.log(compact.split(',').join('\n'))
    if (details !== void 0) {
      console.log('fail details: ' + decodeURIComponent(details))
    }
    if (passCount !== total) {
      failed = true
    }
  } catch (err) {
    failed = true
    console.log(`\n=== ios ERROR: ${err.message.split('\n')[0]}`)
  } finally {
    collector.close()
    await execFileAsync('xcrun', ['simctl', 'shutdown', IOS_DEVICE]).catch(
      () => {}
    )
  }
}

try {
  const serverUrl = await getServerUrl()
  console.log(`Sweeping ${serverUrl}${ROUTE}`)

  await runPlaywrightEngines(serverUrl)
  if (withSafari) await runSafari(serverUrl)
  if (withIos) await runIos(serverUrl)
} finally {
  stopDevServer()
}

console.log(failed ? '\nSWEEP FAILED' : '\nSWEEP PASSED')
process.exit(failed ? 1 : 0)
