import { existsSync } from 'node:fs'
import { basename, join } from 'node:path'

import {
  createNodeRolldownConfig,
  createViteConfig,
  extendRolldownConfig,
  extendViteConfig
} from '../../config-tools.js'

import { quasarRolldownVirtualEntry } from '../../plugins/rolldown.virtual-entry.js'

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
async function preloadScript(quasarConf, name) {
  /**
   * We will be compiling to commonjs format because Electron requires
   * ESM preload scripts to run with sandbox disabled, which is a security risk
   * (Sandboxed preload scripts are run as plain JavaScript without an ESM context)
   *
   * However, should we decide going with ESM preload scripts at some point,
   * we need to change the compiled file extension to .mjs (which is also an Electron requirement)
   */

  const scriptName = basename(name)
  const cfg = createNodeRolldownConfig(quasarConf, {
    compileId: `electron-preload-${scriptName}`,
    format: 'cjs',
    shippedToClient: true
  })
  const { appPaths } = quasarConf.ctx

  if (process.platform === 'win32') {
    /**
     * Required for Windows, otherwise Rolldown will fail to build
     * because it will report that matched alias "#q-app/electron/preload"
     * cannot be resolved (even though #q-app alias is defined).
     * The order of aliases also matters, as '#q-app' needs to be defined
     * only after the more specific ones.
     */
    cfg.resolve.alias = {
      '#q-app/electron/preload': '@quasar/app-vite/electron/preload',
      ...cfg.resolve.alias
    }
  }

  cfg.external = ['electron']
  cfg.resolve.modules = [
    appPaths.resolve.electron('node_modules'),
    'node_modules'
  ]

  cfg.input = appPaths.resolve.electron(name)
  cfg.output.file = quasarConf.ctx.dev
    ? appPaths.resolve.entry(`electron/${scriptName}.cjs`)
    : join(quasarConf.build.distDir, `UnPackaged/${scriptName}.cjs`)

  return {
    scriptName,
    rolldownConfig: await extendRolldownConfig(
      cfg,
      quasarConf.electron,
      quasarConf.ctx,
      'extendElectronPreloadConf'
    )
  }
}

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export const quasarElectronConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-electron',
      shippedToClient: true
    })

    cfg.optimizeDeps.exclude = ['electron']

    if (quasarConf.ctx.prod) {
      cfg.build.outDir = join(quasarConf.build.distDir, 'UnPackaged')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  // returns a Promise
  main: quasarConf => {
    const cfg = createNodeRolldownConfig(quasarConf, {
      compileId: 'electron-main',
      format: 'esm',
      shippedToClient: true
    })
    const { appPaths } = quasarConf.ctx

    if (process.platform === 'win32') {
      /**
       * Required for Windows, otherwise Rolldown will fail to build
       * because it will report that matched alias "#q-app/electron/main"
       * cannot be resolved (even though #q-app alias is defined).
       * The order of aliases also matters, as '#q-app' needs to be defined
       * only after the more specific ones.
       */
      cfg.resolve.alias = {
        '#q-app/electron/main': '@quasar/app-vite/electron/main',
        ...cfg.resolve.alias
      }
    }

    if (quasarConf.ctx.dev) {
      const inputFile = appPaths.resolve.entry('electron/q.entry.main.js')

      /**
       * macOS ignores BrowserWindow's icon for the Dock and otherwise displays
       * Electron.app's icon in development. The runtime NativeImage API
       * supports PNG rather than the ICNS asset used during packaging.
       */
      const macOSDockIconPath =
        process.platform === 'darwin'
          ? appPaths.resolve.electron('electron-assets/icons/icon.png')
          : void 0

      cfg.plugins ||= []
      cfg.plugins.push(
        /**
         * We need to create a virtual entry file that imports the actual main file.
         * This is for Rolldown to correctly handle the relative import paths.
         * Related:
         *    makeAbsoluteExternalsRelative: true,
         *    external: [...]
         */
        quasarRolldownVirtualEntry({
          inputFile,
          targetFile: quasarConf.sourceFiles.electronMain,
          beforeImportCode:
            macOSDockIconPath === void 0 ||
            existsSync(macOSDockIconPath) === false
              ? void 0
              : `import { app as quasarElectronApp } from 'electron'\n\nquasarElectronApp.dock.setIcon(${JSON.stringify(macOSDockIconPath)})`
        })
      )

      cfg.input = inputFile
      cfg.external = [
        'electron',
        /node_modules[\\/](?!.*@quasar[+/\\]app-vite)/
      ]
    } else {
      cfg.input = quasarConf.sourceFiles.electronMain
      cfg.external = [
        'electron',
        ...Object.keys(quasarConf.ctx.pkg.electronPkg.dependencies || {})
      ]
    }

    cfg.output.file = quasarConf.ctx.dev
      ? appPaths.resolve.entry('electron/electron-main.js')
      : join(quasarConf.build.distDir, 'UnPackaged/electron-main.js')

    cfg.resolve.modules = [
      appPaths.resolve.electron('node_modules'),
      'node_modules'
    ]

    return extendRolldownConfig(
      cfg,
      quasarConf.electron,
      quasarConf.ctx,
      'extendElectronMainConf'
    )
  },

  async preloadScriptList(quasarConf) {
    const list = []

    for (const name of quasarConf.electron.preloadScripts) {
      list.push(await preloadScript(quasarConf, name))
    }

    return list
  }
}

export const modeConfig = quasarElectronConfig
