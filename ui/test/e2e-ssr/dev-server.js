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
        return stop
      }
    } catch {}

    await new Promise(resolve => {
      setTimeout(resolve, 1000)
    })
  }
}
