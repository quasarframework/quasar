import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { expect, test } from 'vitest'

export const binFile = join(import.meta.dirname, '../../bin/quasar.js')

export const env = {
  ...process.env,
  FORCE_COLOR: '0',
  NO_UPDATE_NOTIFIER: '1',
  // See https://github.com/yarnpkg/yarn/issues/9015
  SKIP_YARN_COREPACK_CHECK: '1'
}
// vitest points NODE_PATH at the monorepo's pnpm store, which would
// let the CLI resolve host packages that a real user would not have
delete env.NODE_PATH
// simulate a direct invocation (not through a package manager script)
delete env.npm_config_user_agent
delete env.npm_lifecycle_event

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
    child.on('close', code => resolve({ code, output }))
  })
}

export const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

// A combo's tests build on each other's outcome, so once a step
// fails, the remaining ones are skipped instead of producing
// cascading noise. Returns a per-combo test registrar enforcing that.
export function createStepTest() {
  let failed = false

  return function stepTest(title, fn, { runIf = true } = {}) {
    test.runIf(runIf)(title, async ctx => {
      if (failed) ctx.skip('a previous step of this suite failed')

      try {
        await fn()
      } catch (err) {
        failed = true
        throw err
      }
    })
  }
}

// spawns a long-running quasar command (e.g. serve), waits for it to
// announce its URL, then hands control to the callback and kills the
// process afterwards
export async function withServer({ args, cwd }, callback) {
  const child = spawn(process.execPath, [binFile, ...args], { cwd, env })

  let output = ''
  child.stdout.on('data', chunk => {
    output += chunk
  })
  child.stderr.on('data', chunk => {
    output += chunk
  })

  try {
    const deadline = Date.now() + 30_000
    let url

    for (;;) {
      url = output.match(/URLs? in use\.*\s+(\S+)/)?.[1]
      if (url !== void 0) break

      if (child.exitCode !== null) {
        throw new Error(`The server exited early:\n${output}`)
      }
      if (Date.now() > deadline) {
        throw new Error(`The server did not start in time:\n${output}`)
      }

      await sleep(100)
    }

    await callback({ url, getOutput: () => output })
  } finally {
    child.kill('SIGTERM')

    // the process must honor SIGTERM (it closes the server and exits)
    const deadline = Date.now() + 5000
    while (child.exitCode === null && Date.now() < deadline) {
      await sleep(100)
    }

    expect(child.exitCode, 'server did not exit on SIGTERM').not.toBeNull()
  }
}
