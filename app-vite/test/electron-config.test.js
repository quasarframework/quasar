import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import { quasarElectronConfig } from '../lib/modes/electron/electron-config.js'

function setPlatform(platform) {
  Object.defineProperty(process, 'platform', {
    configurable: true,
    enumerable: true,
    value: platform
  })
}

function createQuasarConf(rootDir) {
  const electronDir = join(rootDir, 'src-electron')
  const entryDir = join(rootDir, '.quasar')

  return {
    build: {
      alias: {},
      define: {},
      minify: false,
      sourcemap: false,
      target: { node: 'node24' }
    },
    ctx: {
      appExt: {
        runAppExtensionHook: async () => {}
      },
      appPaths: {
        electronDir,
        resolve: {
          electron: path => join(electronDir, path),
          entry: path => join(entryDir, path)
        }
      },
      dev: true
    },
    electron: {},
    metaConf: {
      clientEnvDefineList: {}
    },
    sourceFiles: {
      electronMain: join(electronDir, 'electron-main.js')
    }
  }
}

test('bootstraps the project Dock icon on macOS development builds', async t => {
  const originalPlatform = process.platform
  const rootDir = await mkdtemp(join(tmpdir(), 'quasar-electron-config-'))
  const iconPath = join(rootDir, 'src-electron/electron-assets/icons/icon.png')

  t.after(async () => {
    setPlatform(originalPlatform)
    await rm(rootDir, { recursive: true })
  })

  await mkdir(join(rootDir, 'src-electron/electron-assets/icons'), {
    recursive: true
  })
  await writeFile(iconPath, '')
  setPlatform('darwin')

  const quasarConf = createQuasarConf(rootDir)
  const config = await quasarElectronConfig.main(quasarConf)
  const virtualEntry = config.plugins.find(
    plugin => plugin.name === 'quasar:virtual-entry'
  )
  const code = virtualEntry.load(
    quasarConf.ctx.appPaths.resolve.entry('electron/q.entry.main.js')
  )

  assert.match(code, /import \{ app as quasarElectronApp \} from 'electron'/)
  assert.match(
    code,
    new RegExp(
      `quasarElectronApp\\.dock\\.setIcon\\(${JSON.stringify(iconPath)}\\)`
    )
  )
  assert.match(
    code,
    /await import\('\.\/\.\.\/\.\.\/src-electron\/electron-main\.js'\)/
  )
})
