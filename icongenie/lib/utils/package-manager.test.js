import { sync as crossSpawnSync } from 'cross-spawn'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test } from 'vitest'

import { createInstance } from './package-manager.js'

const workDir = mkdtempSync(join(tmpdir(), 'icongenie-package-manager-'))

function isInstalled(name) {
  try {
    return crossSpawnSync(name, ['--version']).status === 0
  } catch {
    return false
  }
}

// [ name, lock file, install params ]
const packageManagers = [
  ['pnpm', 'pnpm-lock.yaml', ['add']],
  ['yarn', 'yarn.lock', ['add']],
  ['npm', 'package-lock.json', ['install']],
  ['bun', 'bun.lock', ['add']]
]

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

describe('createInstance', () => {
  test('falls back to an installed package manager', () => {
    const folder = join(workDir, 'no-lock')
    mkdirSync(folder)

    const pm = createInstance(folder)

    // the test itself runs through one, so at least it is installed
    expect(typeof pm).toBe('object')
    expect(pm.appDir).toBe(folder)
    expect(pm.isInstalled()).toBe(true)
  })

  packageManagers.forEach(([name, lockFile, installParams]) => {
    test.runIf(isInstalled(name))(
      `${name}: detected from its lock file, up the folder tree`,
      () => {
        const folder = join(workDir, name)
        mkdirSync(join(folder, 'src-capacitor'), { recursive: true })
        writeFileSync(join(folder, lockFile), '')

        const pm = createInstance(join(folder, 'src-capacitor'))

        expect(pm.name).toBe(name)
        expect(pm.lockFiles).toContain(lockFile)
        expect(pm.getInstallPackageParams(['a', 'b'])).toEqual([
          ...installParams,
          'a',
          'b'
        ])
      }
    )
  })

  test.runIf(isInstalled('pnpm'))(
    'pnpm installs with the strict dependency builds off',
    () => {
      const folder = join(workDir, 'pnpm-env')
      mkdirSync(folder)
      writeFileSync(join(folder, 'pnpm-lock.yaml'), '')

      expect(createInstance(folder).extraEnv).toEqual({
        PNPM_CONFIG_STRICT_DEP_BUILDS: 'false'
      })
    }
  )
})
