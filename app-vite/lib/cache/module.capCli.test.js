import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { createInstance as createCapCli } from './module.capCli.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-cap-cli-')))

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

describe('[module.capCli.js]', () => {
  const capacitorDir = join(rootDir, 'cap-app')

  // fake @capacitor/cli installed in the capacitor dir
  const capPkgDir = join(capacitorDir, 'node_modules', '@capacitor', 'cli')
  mkdirSync(join(capPkgDir, 'bin'), { recursive: true })
  writeFileSync(
    join(capPkgDir, 'package.json'),
    JSON.stringify({ name: '@capacitor/cli', version: '8.1.0' })
  )
  writeFileSync(join(capPkgDir, 'bin', 'capacitor'), '')

  /**
   * A "not installed" counterpart cannot be asserted in-process:
   * vitest points NODE_PATH at the monorepo pnpm store, so
   * @capacitor/cli resolves even from a bare temp dir
   * (see cli/AGENTS.md gotchas).
   */
  test('resolves the capacitor bin and major version', () => {
    const instance = createCapCli({ appPaths: { capacitorDir } })

    expect(instance.capBin).toBe(
      join(capacitorDir, 'node_modules', '@capacitor/cli', 'bin', 'capacitor')
    )
    expect(instance.capVersion).toBe(8)
  })
})
