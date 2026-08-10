import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { join, normalize } from 'node:path'

const playgroundDir = normalize(join(import.meta.dirname, '../../playground'))

export function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, () => {
      const { port } = server.address()
      server.close(() => {
        resolve(port)
      })
    })
  })
}

/**
 * Resolves the server to audit: an externally provided one through
 * E2E_SERVER_URL (an already-running `quasar dev -m ssr` session —
 * skips the boot AND arrives with warm page compiles), or a freshly
 * booted one otherwise.
 */
export async function resolveServer() {
  const external = process.env.E2E_SERVER_URL

  if (external !== void 0 && external.length !== 0) {
    const baseUrl = external.replace(/\/$/, '')

    let res
    try {
      res = await fetch(`${baseUrl}/`)
    } catch (err) {
      throw new Error(
        `E2E_SERVER_URL (${baseUrl}) is not reachable: ${err.message}`,
        { cause: err }
      )
    }
    if (res.status !== 200) {
      throw new Error(`E2E_SERVER_URL (${baseUrl}) answered with ${res.status}`)
    }

    // an SPA-mode dev server would make the sweep pass vacuously:
    // nothing is server-rendered, so hydration (the thing under
    // test) never runs
    const html = await res.text()
    if (/<div id="?q-app"?>\s*<\/div>/.test(html)) {
      throw new Error(
        `E2E_SERVER_URL (${baseUrl}) serves a client-only shell — ` +
          'point it at a `quasar dev -m ssr` session'
      )
    }

    // not ours to stop
    return { baseUrl, stop: () => {} }
  }

  const port = await getFreePort()
  const stop = await startSsrDevServer(port)
  return { baseUrl: `http://localhost:${port}`, stop }
}

/**
 * Boots `quasar dev -m ssr` for the playground and resolves when it
 * serves. Returns a stop() that kills the whole process group (the CLI
 * spawns its own children). Boot failures carry the tail of the
 * server's own output — without it, a CI flake is undebuggable.
 */
export async function startSsrDevServer(port, timeout = 210_000) {
  const child = spawn(
    'pnpm',
    ['exec', 'quasar', 'dev', '-m', 'ssr', '-p', String(port)],
    {
      cwd: playgroundDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
      // the playground's devServer.open would pop a browser per run
      env: { ...process.env, QUASAR_PLAYGROUND_NO_OPEN: '1' }
    }
  )

  let outputTail = ''
  const collect = chunk => {
    outputTail = (outputTail + chunk).slice(-8192)
  }
  child.stdout.on('data', collect)
  child.stderr.on('data', collect)

  let exited = false
  child.on('exit', () => {
    exited = true
  })

  const stop = () => {
    if (!exited) {
      try {
        process.kill(-child.pid, 'SIGTERM')
      } catch {}
    }
  }

  const bootError = reason =>
    new Error(`${reason}\n--- server output tail ---\n${outputTail}`)

  const deadline = Date.now() + timeout

  for (;;) {
    if (exited) {
      throw bootError('The SSR dev server exited before becoming ready')
    }
    if (Date.now() > deadline) {
      stop()
      throw bootError(`The SSR dev server did not serve within ${timeout}ms`)
    }

    try {
      const res = await fetch(`http://localhost:${port}/`)
      if (res.status === 200) {
        // parsed by test/parallel.js to stagger the concurrent build
        // past the dev server's `quasar clean`-sensitive boot phase
        console.log('[e2e-ssr] dev server ready')
        return stop
      }
    } catch {}

    await new Promise(resolve => {
      setTimeout(resolve, 1000)
    })
  }
}
