import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from 'vitest'

export const binFile = join(import.meta.dirname, '../../bin/create-quasar.js')

export const env = {
  ...process.env,
  NO_UPDATE_NOTIFIER: '1',
  // See https://github.com/yarnpkg/yarn/issues/9015
  SKIP_YARN_COREPACK_CHECK: '1',
  // deterministic git behavior for the scaffolding's repo initialization:
  // no user/system config (so no GPG signing or hooks that could hang the
  // run) and a fixed commit identity
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_SYSTEM: '/dev/null',
  GIT_AUTHOR_NAME: 'Test',
  GIT_AUTHOR_EMAIL: 'test@example.com',
  GIT_COMMITTER_NAME: 'Test',
  GIT_COMMITTER_EMAIL: 'test@example.com',
  // set by the local-registry global setup: every package manager the
  // tests spawn must resolve through the local monorepo registry
  ...(process.env.E2E_REGISTRY_URL !== void 0
    ? {
        npm_config_registry: process.env.E2E_REGISTRY_URL,
        YARN_REGISTRY: process.env.E2E_REGISTRY_URL,
        // pnpm and yarn 1 ignore the env vars above — the controlled
        // home's .npmrc/.yarnrc are the authoritative redirection
        HOME: process.env.E2E_REGISTRY_HOME,
        USERPROFILE: process.env.E2E_REGISTRY_HOME
      }
    : {})
}
// Deliberately NO prefer-offline overrides here: the package managers'
// persistent local caches already avoid re-downloading tarballs, while
// forcing offline metadata can resolve against stale registry data and
// produce broken installs — scaffolding must be tested with the same
// fresh resolution users get. (CI achieves cache reuse with actions/cache.)
// simulate a direct invocation (not through a package manager's
// "create" command), so --install accepts a package manager name
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

// A combo's tests build on each other's outcome (scaffold → lint →
// build → dev server), so once a step fails, the remaining ones are
// skipped instead of producing cascading noise.
// Returns a per-combo test registrar enforcing that.
export function createStepTest() {
  let failed = false

  return function stepTest(title, fn, { runIf = true } = {}) {
    test.runIf(runIf)(title, async ctx => {
      if (failed) ctx.skip('a previous step of this combo failed')

      try {
        await fn()
      } catch (err) {
        failed = true
        throw err
      }
    })
  }
}

// returns a fn that renders the commands recreating a combo's setup by
// hand, so a failure can be reproduced outside of the test harness
export function makeRepro(scaffoldArgs, projectFolderName) {
  return step =>
    '\n\nTo reproduce this combo manually:' +
    '\n  cd $(mktemp -d)' +
    `\n  node ${binFile} ${scaffoldArgs.join(' ')}` +
    (step ? `\n  cd ${projectFolderName}\n  ${step}` : '') +
    '\n'
}

// The devServer browser-open setting as rendered by the
// templates/{app,ae}/*/BASE/**/quasar.config.* files. No breadcrumb
// comments over there: those files are rendered into user projects,
// where such a comment would be noise — this constant is the single
// documented coupling point instead.
const devServerOpenSetting = 'open: true'

export function disableDevServerOpen(configFile) {
  const config = readFileSync(configFile, 'utf8')

  // guard against the template dropping/renaming the setting,
  // which would silently start opening browser windows again
  expect(config).toContain(devServerOpenSetting)

  writeFileSync(configFile, config.replace(devServerOpenSetting, 'open: false'))
}

// boots the dev server, waits for it to announce its URL,
// verifies it answers with the app page, then kills the process tree
export async function testDevServer(cmd, args, cwd, repro = '') {
  const child = spawn(cmd, args, {
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
    const deadline = Date.now() + 120_000
    let url

    for (;;) {
      url = output.match(/https?:\/\/[\w.-]+:\d+\//)?.[0]
      if (url !== void 0) break

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
    const response = await fetch(url, { headers: { accept: 'text/html' } })
    expect(response.status, repro).toBe(200)
    expect(await response.text(), repro).toContain('<html')
  } finally {
    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {}

    await sleep(1000)

    try {
      process.kill(-child.pid, 'SIGKILL')
    } catch {}
  }
}
