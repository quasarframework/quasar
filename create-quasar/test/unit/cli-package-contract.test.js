import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

// The cli and app-vite packages reach into create-quasar by relative
// path: cli's e2e (cli/test/e2e/project.test.js,
// cli/vitest-e2e.config.js) spawns our bin to scaffold its test
// project and reuses our local-registry global setup, and app-vite's
// AE-lifecycle e2e (app-vite/test/ae-lifecycle/) reuses the setup plus
// publishToLocalRegistry. Their CI workflows do NOT run on
// create-quasar PRs, so this pins the contract from our side — moving
// or renaming these files must fail HERE, not in their suites at
// release time.
describe('[consumer package contract]', () => {
  test('the bin the cli e2e spawns exists', () => {
    expect(
      existsSync(join(import.meta.dirname, '../../bin/create-quasar.js'))
    ).toBe(true)
  })

  test('the local-registry setup keeps the exports the consumers use', async () => {
    const localRegistry = await import('../e2e/local-registry.js')

    expect(localRegistry.setup).toBeTypeOf('function')
    expect(localRegistry.assertLocalQuasarInstall).toBeTypeOf('function')
    expect(localRegistry.publishToLocalRegistry).toBeTypeOf('function')
  })
})
