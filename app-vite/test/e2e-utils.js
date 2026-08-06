import { spawn, spawnSync } from 'node:child_process'
import { createServer } from 'node:net'
import { join } from 'node:path'
import { expect, test } from 'vitest'

export const quasarBin = join(import.meta.dirname, '../bin/quasar.js')

// The spawned CLI must behave as it does for a real user:
// vitest sets NODE_ENV=test, which "quasar dev"/"quasar build" would
// otherwise inherit instead of defaulting to development/production
export const env = { ...process.env, NO_COLOR: '1' }
delete env.NODE_ENV

const reproFor = (cwd, command) =>
  `\n\nTo reproduce manually:\n  cd ${cwd}\n  ${command}\n`

export function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, env })

    let output = ''
    child.stdout.on('data', chunk => {
      output += chunk
    })
    child.stderr.on('data', chunk => {
      output += chunk
    })

    child.on('error', reject)
    child.on('close', code => {
      resolve({
        code,
        output,
        repro: reproFor(cwd, `${cmd} ${args.join(' ')}`)
      })
    })
  })
}

export function runQuasar(args, cwd) {
  return run(process.execPath, [quasarBin, ...args], cwd)
}

export const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

// A playground's tests build on each other's outcome (prepare → build →
// serve), so once a step fails, the remaining ones are skipped instead
// of producing cascading noise.
// Returns a per-playground test registrar enforcing that.
export function createStepTest() {
  let failed = false

  return function stepTest(title, fn, { runIf = true } = {}) {
    test.runIf(runIf)(title, async ctx => {
      if (failed) ctx.skip('a previous step of this playground failed')

      try {
        await fn()
      } catch (err) {
        failed = true
        throw err
      }
    })
  }
}

// whether a binary is available on the PATH (e.g. the globally
// installed cordova CLI); used to gate steps needing external tooling
export function hasBin(bin) {
  return spawnSync(bin, ['--version'], { stdio: 'ignore' }).error === void 0
}

export function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.on('error', reject)
    server.listen(0, () => {
      const { port } = server.address()
      server.close(() => {
        resolve(port)
      })
    })
  })
}

function killTree(child) {
  return (async () => {
    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {}

    await sleep(1000)

    try {
      process.kill(-child.pid, 'SIGKILL')
    } catch {}
  })()
}

// Boots the dev server, waits for it to signal readiness, verifies it
// answers with the app page, then kills the process tree;
// returns { html, output } for further, mode-specific assertions.
// By default readiness means the announced App URL (which is then
// fetched); a mode not announcing one passes its own readyRe and the
// url to fetch instead. onReady(origin) runs extra checks while the
// server is still up; settleMs > 0 additionally verifies the dev
// process is still alive that long after serving — a crashing
// app-runner child (e.g. Electron) takes the whole dev process down.
export async function testDevServer(
  quasarArgs,
  cwd,
  {
    // anchored to the running banner's line — a bare URL match would
    // require a trailing slash or risk matching unrelated output, and
    // Electron's App URL has no trailing slash (empty publicPath)
    readyRe = /App URL\.+ (https?:\/\/[\w.-]+:\d+\S*)/,
    url,
    onReady,
    settleMs = 0
  } = {}
) {
  const repro = reproFor(cwd, `node ${quasarBin} ${quasarArgs.join(' ')}`)
  const child = spawn(process.execPath, [quasarBin, ...quasarArgs], {
    cwd,
    env,
    // its own process group, so the whole tree can be killed afterwards
    detached: true
  })

  let output = ''
  child.stdout.on('data', chunk => {
    output += chunk
  })
  child.stderr.on('data', chunk => {
    output += chunk
  })

  try {
    // generous: a cold run may first install the mode's deps
    // (e.g. the Electron binary)
    const deadline = Date.now() + 240_000
    let fetchUrl

    for (;;) {
      const readyMatch = output.match(readyRe)
      if (readyMatch !== null) {
        fetchUrl = url ?? readyMatch[1] ?? readyMatch[0]
        break
      }

      if (child.exitCode !== null) {
        throw new Error(`The dev server exited early:\n${output}${repro}`)
      }
      if (Date.now() > deadline) {
        throw new Error(
          `The dev server did not start in time:\n${output}${repro}`
        )
      }

      await sleep(500)
    }

    // the accept header is required for Vite to answer with the app page;
    // see https://github.com/jeffbski/wait-on/issues/78#issuecomment-867813529
    const response = await fetch(fetchUrl, { headers: { accept: 'text/html' } })
    expect(response.status, output + repro).toBe(200)
    const html = await response.text()

    await onReady?.({
      origin: new URL(fetchUrl).origin,
      // for steps interacting with the live server (e.g. triggering a
      // quasar.config reload) that need to await a specific CLI reaction
      waitForOutput: async (re, timeoutMs = 30_000) => {
        const outputDeadline = Date.now() + timeoutMs
        while (!re.test(output)) {
          if (child.exitCode !== null) {
            throw new Error(
              `The dev process exited while waiting for ${re}:\n${output}${repro}`
            )
          }
          if (Date.now() > outputDeadline) {
            throw new Error(
              `Expected dev output not seen: ${re}\n${output}${repro}`
            )
          }
          await sleep(250)
        }
      }
    })

    if (settleMs !== 0) {
      await sleep(settleMs)
      if (child.exitCode !== null) {
        throw new Error(
          `The dev process exited right after serving:\n${output}${repro}`
        )
      }
    }

    return { html, output }
  } finally {
    await killTree(child)
  }
}

// Boots a production SSR webserver from an already-installed output folder,
// polls it until it answers, then kills the process tree;
// returns the served HTML for further assertions.
// onReady(origin) runs extra requests while the server is still up.
export async function testSsrProdServer(cwd, port, { onReady } = {}) {
  const repro = reproFor(cwd, `PORT=${port} node index.js`)
  const child = spawn(process.execPath, ['index.js'], {
    cwd,
    env: { ...env, PORT: String(port) },
    // its own process group, so the whole tree can be killed afterwards
    detached: true
  })

  let output = ''
  child.stdout.on('data', chunk => {
    output += chunk
  })
  child.stderr.on('data', chunk => {
    output += chunk
  })

  try {
    const deadline = Date.now() + 60_000
    let response

    for (;;) {
      if (child.exitCode !== null) {
        throw new Error(`The SSR server exited early:\n${output}${repro}`)
      }
      if (Date.now() > deadline) {
        throw new Error(
          `The SSR server did not start in time:\n${output}${repro}`
        )
      }

      try {
        response = await fetch(`http://127.0.0.1:${port}/`, {
          headers: { accept: 'text/html' }
        })
        break
      } catch {
        await sleep(500)
      }
    }

    expect(response.status, output + repro).toBe(200)
    const html = await response.text()

    await onReady?.(`http://127.0.0.1:${port}`)

    return html
  } finally {
    await killTree(child)
  }
}
