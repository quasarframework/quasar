import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { log, warn, fatal } from '../../utils/logger.js'
import { spawn } from '../../utils/spawn.js'
import { getPackagePath } from '../../utils/get-package-path.js'
import { quasarElectronConfig } from './electron-config.js'

function wait (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #server
  #stopMain
  #stopPreload
  #killedPid = false
  #electronExecutable

  constructor (opts) {
    super(opts)

    const electronPkgPath = getPackagePath('electron/package.json', this.ctx.appPaths.appDir)
    const electronPkg = JSON.parse(
      readFileSync(electronPkgPath, 'utf-8')
    )

    this.#electronExecutable = join(dirname(electronPkgPath), electronPkg.bin.electron)

    this.registerDiff('electron', (quasarConf, diffMap) => [
      quasarConf.devServer,
      quasarConf.electron.extendElectronMainConf,
      quasarConf.electron.extendElectronPreloadConf,
      quasarConf.electron.inspectPort,
      quasarConf.sourceFiles.electronMain,
      quasarConf.sourceFiles.electronPreload,

      // extends 'esbuild' diff
      ...diffMap.esbuild(quasarConf)
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    if (diff('vite', quasarConf)) {
      return queue(() => this.#runVite(quasarConf))
    }

    if (diff('electron', quasarConf)) {
      return queue(() => this.#runElectronFiles(quasarConf))
    }
  }

  async #runVite (quasarConf) {
    if (this.#server) {
      this.#server.close()
    }

    const viteConfig = await quasarElectronConfig.vite(quasarConf)

    this.#server = await createServer(viteConfig)
    await this.#server.listen()
  }

  async #runElectronFiles (quasarConf) {
    if (this.#stopMain) {
      this.#stopMain()
      this.#stopMain = null
    }

    if (this.#stopPreload) {
      this.#stopPreload()
      this.#stopPreload = null
    }

    let mainReady = false
    let preloadReady = false

    const cfgMain = await quasarElectronConfig.main(quasarConf)
    const cfgPreload = await quasarElectronConfig.preload(quasarConf)

    return Promise.all([
      this.watchWithEsbuild('Electron Main', cfgMain, () => {
        if (preloadReady === true) {
          this.#runElectron(quasarConf)
        }
      }).then(esbuildCtx => {
        mainReady = true
        this.#stopMain = esbuildCtx.dispose
      }),

      this.watchWithEsbuild('Electron Preload', cfgPreload, () => {
        if (mainReady === true) {
          this.#runElectron(quasarConf)
        }
      }).then(esbuildCtx => {
        preloadReady = true
        this.#stopPreload = esbuildCtx.dispose
      })
    ]).then(() => {
      return this.#runElectron(quasarConf)
    })
  }

  async #runElectron (quasarConf) {
    if (this.#pid) {
      log('Shutting down Electron process...')
      process.kill(this.#pid)

      this.#pid = 0
      this.#killedPid = true

      // on some OSes a small delay is needed
      // so that resources are freed on kill
      await wait(100)
    }

    this.#pid = spawn(
      this.#electronExecutable,
      [
        '--inspect=' + quasarConf.electron.inspectPort,
        this.ctx.appPaths.resolve.entry('electron-main.cjs')
      ].concat(this.argv._),
      { cwd: this.ctx.appPaths.appDir },
      code => {
        if (this.#killedPid === true) {
          this.#killedPid = false
        }
        else if (code) {
          warn()
          fatal(`Electron process ended with error code: ${ code }`)
        }
        else { // else it wasn't killed by us
          warn()
          fatal('Electron process was killed. Exiting...')
        }
      }
    )
  }
}
