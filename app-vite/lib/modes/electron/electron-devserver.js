import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { fatal, log, warn } from '../../utils/logger.js'
import { spawn } from '../../utils/spawn.js'
import { getPackagePath } from '../../utils/get-package-path.js'
import { updateHtmlVariables } from '../../plugins/vite.html.js'
import { quasarElectronConfig } from './electron-config.js'

function delay(time) {
  const { promise, resolve } = Promise.withResolvers()
  setTimeout(resolve, time)
  return promise
}

export class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #watcherList = []
  #killedPid = false
  #electronExecutable

  constructor(opts) {
    super(opts)

    const electronPkgPath = getPackagePath(
      'electron/package.json',
      this.ctx.appPaths.electronDir
    )
    const electronPkg = JSON.parse(readFileSync(electronPkgPath, 'utf8'))

    this.#electronExecutable = join(
      dirname(electronPkgPath),
      electronPkg.bin.electron
    )

    this.registerDiff('electron', (quasarConf, diffMap) => [
      quasarConf.devServer,
      quasarConf.electron.extendElectronMainConf,
      quasarConf.electron.extendElectronPreloadConf,
      quasarConf.electron.inspectPort,
      quasarConf.electron.preloadScripts,
      quasarConf.sourceFiles.electronMain,
      quasarConf.metaConf.clientEnvDefineList,

      // extends 'rolldown' diff
      ...diffMap.rolldown(quasarConf)
    ])
  }

  run(quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('htmlTemplate', quasarConf)) {
      this.clientNeedsReload = true
      updateHtmlVariables(quasarConf)
    }

    if (diff('vite', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#runVite(quasarConf))
    }

    if (diff('electron', quasarConf)) {
      this.clientNeedsReload = false
      return queue(() => this.#runElectronFiles(quasarConf))
    }

    if (this.clientNeedsReload) this.reloadClient()
  }

  async #runVite(quasarConf) {
    const viteConfig = await quasarElectronConfig.vite(quasarConf)
    const server = await createServer(viteConfig)

    await this.rebootClient(server)
  }

  async #runElectronFiles(quasarConf) {
    await this.clearWatcherList(this.#watcherList, () => {
      this.#watcherList.length = 0
    })

    let isReady = false

    const cfgMain = await quasarElectronConfig.main(quasarConf)
    const cfgPreloadList =
      await quasarElectronConfig.preloadScriptList(quasarConf)

    const cfgList = [
      { banner: 'Electron Main', cfg: cfgMain },
      ...cfgPreloadList.map(preloadScript => ({
        banner: `Electron Preload (${preloadScript.scriptName})`,
        cfg: preloadScript.rolldownConfig
      }))
    ].map(({ banner, cfg }) =>
      this.watchWithRolldown(banner, cfg, () => {
        if (isReady) {
          this.#runElectron(quasarConf)
        }
      }).then(watcher => {
        this.#watcherList.push(watcher)
      })
    )

    return Promise.all(cfgList).then(() => {
      isReady = true
      return this.#runElectron(quasarConf)
    })
  }

  async #runElectron(quasarConf) {
    if (this.#pid) {
      log('Shutting down Electron process...')
      process.kill(this.#pid)

      this.#pid = 0
      this.#killedPid = true

      // on some OSes a small delay is needed
      // so that resources are freed on kill
      await delay(100)
    }

    const electronEntryDir = this.ctx.appPaths.resolve.entry('electron')
    const { name, productName, version, desktopName } = this.ctx.pkg.appPkg

    // Electron only loads application metadata when launched with an app
    // directory. Passing the compiled main file directly makes development
    // builds inherit Electron's name, version and Linux desktop identity.
    writeFileSync(
      join(electronEntryDir, 'package.json'),
      JSON.stringify({
        name,
        productName,
        version,
        desktopName,
        main: './electron-main.js',
        type: 'module'
      })
    )

    this.#pid = spawn(
      this.#electronExecutable,
      [
        '--inspect=' + quasarConf.electron.inspectPort,
        electronEntryDir,
        ...this.argv._
      ],
      { cwd: this.ctx.appPaths.appDir },
      code => {
        if (this.#killedPid) {
          this.#killedPid = false
          return
        }

        warn()
        fatal(
          code
            ? `Electron process ended with error code: ${code}`
            : 'Electron process was killed. Exiting...'
        )
      }
    )
  }
}
