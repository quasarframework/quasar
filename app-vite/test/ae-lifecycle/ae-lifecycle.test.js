import { spawn } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect } from 'vitest'

import { env as baseEnv, createStepTest } from '../e2e-utils.js'
import qe2eMarkers from '../fixtures/quasar-app-extension-qe2e/src/markers.js'
import { assertLocalQuasarInstall } from '../../../create-quasar/test/e2e/local-registry.js'

// The AE PACKAGE lifecycle — "quasar ext add/remove" resolving the
// fixture extension from the local registry through a real package
// manager (the scripts lifecycle is unit-covered in
// lib/app-extension/AppExtensionInstance.test.js and lib/cmd/ext.test.js
// with a symlinked fixture; here the package is truly installed).
//
// The host app is copied from test/fixtures/ae-host-app into a temp dir
// and its dependencies (the monorepo's own quasar/app-vite/extras,
// served by the local registry) are REALLY installed — so the CLI under
// test is the packaged @quasar/app-vite tarball, not the repo checkout.
// The fixture's dependency ranges must keep matching the monorepo
// versions; a major bump makes the install step fail loudly.

// The fixture publishes under the org-owned @quasar scope (see
// global-setup.js) — this also makes the lifecycle exercise the SCOPED
// ext-id path against a real registry, while bare-name parsing stays
// covered by the unit suites. The CLI derives the package name from the
// ext id (@quasar/qe2e -> @quasar/quasar-app-extension-qe2e).
const extId = '@quasar/qe2e'
const extPackageName = '@quasar/quasar-app-extension-qe2e'

// the spawned CLI must resolve packages like a real user's install:
// vitest points NODE_PATH at the monorepo pnpm store
const env = { ...baseEnv }
delete env.NODE_PATH

const workDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'app-vite-ae-lifecycle-'))
)
const appDir = join(workDir, 'ae-host-app')
cpSync(join(import.meta.dirname, '../fixtures/ae-host-app'), appDir, {
  recursive: true
})

// the CLI of the INSTALLED @quasar/app-vite package (see above)
const installedBin = join(appDir, 'node_modules/@quasar/app-vite/bin/quasar.js')

const extensionsFile = join(appDir, 'quasar.extensions.json')
const installedExtDir = join(appDir, 'node_modules', extPackageName)
const renderedDir = join(appDir, qe2eMarkers.renderedDirName)

const appPackageJson = () =>
  JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8'))

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true })
})

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: appDir, env })

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
        repro: `\n\nTo reproduce manually:\n  cd ${appDir}\n  ${cmd} ${args.join(' ')}\n`
      })
    })
  })
}

const runQuasar = args => run(process.execPath, [installedBin, ...args])

const stepTest = createStepTest()

describe('[e2e] AE package lifecycle', () => {
  stepTest('installs the host app through the local registry', async () => {
    const { code, output, repro } = await run('pnpm', ['install'])

    expect(code, output + repro).toBe(0)
    expect(existsSync(installedBin), repro).toBe(true)

    // the packager detection below must resolve to pnpm
    expect(existsSync(join(appDir, 'pnpm-lock.yaml')), repro).toBe(true)

    // the install must have used the local monorepo packages,
    // never published ones
    assertLocalQuasarInstall(appDir)
  })

  stepTest('reports no installed extensions', async () => {
    const { code, output, repro } = await runQuasar(['ext'])

    expect(code, output + repro).toBe(0)
    expect(output, repro).toContain('No App Extensions are installed')
  })

  stepTest(
    '"ext add" installs the package and runs its install flow',
    async () => {
      const { code, output, repro } = await runQuasar(['ext', 'add', extId])

      expect(code, output + repro).toBe(0)

      // a REAL registry install: pnpm materializes the package as a link
      // into the app's own .pnpm virtual store — unlike the unit and
      // playground suites, which symlink the repo fixture directly
      expect(existsSync(installedExtDir), output + repro).toBe(true)
      const realInstalledDir = realpathSync(installedExtDir)
      expect(realInstalledDir, repro).toContain(join('node_modules', '.pnpm'))
      expect(realInstalledDir, repro).not.toBe(
        realpathSync(
          join(import.meta.dirname, '../fixtures/quasar-app-extension-qe2e')
        )
      )

      // registered as a devDependency of the host app
      expect(
        appPackageJson().devDependencies[extPackageName],
        repro
      ).toBeDefined()

      // the prompts script answers got stored
      expect(JSON.parse(readFileSync(extensionsFile, 'utf8')), repro).toEqual({
        [extId]: { greeting: qe2eMarkers.promptGreeting }
      })

      // the install script rendered its templates folder, interpolating
      // the prompts answers and applying the underscore name mappings
      expect(
        readFileSync(join(renderedDir, 'greeting.txt'), 'utf8'),
        repro
      ).toContain(`greeting=${qe2eMarkers.promptGreeting}`)
      expect(existsSync(join(renderedDir, '.dotfile.txt')), repro).toBe(true)
      expect(existsSync(join(renderedDir, '_dotfile.txt')), repro).toBe(false)
      expect(existsSync(join(renderedDir, '_underscore.txt')), repro).toBe(true)

      // the install script exit log got printed
      expect(output, repro).toContain(qe2eMarkers.installExitLog)
    }
  )

  stepTest('lists the installed extension', async () => {
    const { code, output, repro } = await runQuasar(['ext'])

    expect(code, output + repro).toBe(0)
    expect(output, repro).toContain('Installed App Extensions:')
    expect(output, repro).toContain(extId)
  })

  stepTest(
    '"ext remove" uninstalls the package and runs its uninstall flow',
    async () => {
      const { code, output, repro } = await runQuasar(['ext', 'remove', extId])

      expect(code, output + repro).toBe(0)

      // the uninstall script removed what install rendered, and logged
      expect(existsSync(renderedDir), output + repro).toBe(false)
      expect(output, repro).toContain(qe2eMarkers.uninstallExitLog)

      // deregistered and truly uninstalled
      expect(
        JSON.parse(readFileSync(extensionsFile, 'utf8')),
        repro
      ).not.toHaveProperty(extId)
      expect(
        appPackageJson().devDependencies?.[extPackageName],
        repro
      ).toBeUndefined()
      expect(existsSync(installedExtDir), repro).toBe(false)
    }
  )

  stepTest(
    '"ext add" with a pinned version resolves it through the registry',
    async () => {
      const { code, output, repro } = await runQuasar([
        'ext',
        'add',
        `${extId}@0.0.1`
      ])

      expect(code, output + repro).toBe(0)
      expect(output, repro).toContain(qe2eMarkers.installExitLog)

      // the requested version got installed
      expect(
        JSON.parse(readFileSync(join(installedExtDir, 'package.json'), 'utf8'))
          .version,
        repro
      ).toBe('0.0.1')
    }
  )
})
