import { existsSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect } from 'vitest'

import { run, runQuasar } from './e2e-utils.js'
import { definePlaygroundSuite } from './playground-suite.js'

const playgroundDir = join(import.meta.dirname, '../playground-ts')

describe('[e2e] playground-ts', () => {
  const stepTest = definePlaygroundSuite({ playgroundDir, scriptExt: 'ts' })

  // the shared suite leaves the auto-installed (hono) SSR mode behind;
  // cover mode removal and the explicit --webserver param on top of it
  stepTest('removes SSR mode', async () => {
    const { code, output, repro } = await runQuasar(
      ['mode', 'remove', 'ssr', '--yes'],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)
    expect(existsSync(join(playgroundDir, 'src-ssr')), repro).toBe(false)
  })

  stepTest('adds SSR mode with an explicit webserver', async () => {
    // self-sufficient (even in filtered runs): a fresh add needs the
    // generated folder absent
    rmSync(join(playgroundDir, 'src-ssr'), { recursive: true, force: true })

    const { code, output, repro } = await runQuasar(
      ['mode', 'add', 'ssr', '--webserver', 'fastify'],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)

    expect(existsSync(join(playgroundDir, 'src-ssr/server.ts')), repro).toBe(
      true
    )
    const pkg = JSON.parse(
      readFileSync(join(playgroundDir, 'src-ssr/package.json'), 'utf8')
    )
    expect(pkg.dependencies, repro).toHaveProperty('fastify')
  })

  // proves the generated .quasar types actually typecheck, with all
  // mode folders installed by the suite above
  stepTest('typechecks the app against the generated types', async () => {
    const { code, output, repro } = await run(
      'pnpm',
      ['typecheck'],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)
  })
})
