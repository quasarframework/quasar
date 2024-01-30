import { join } from 'node:path'
import { merge } from 'webpack-merge'

import { log, warn, progress } from '../../utils/logger.js'
import { AppBuilder } from '../../app-builder.js'
import { quasarElectronConfig } from './electron-config.js'
import { getPackageJson } from '../../utils/get-package-json.js'
import { getFixedDeps } from '../../utils/get-fixed-deps.js'

export class QuasarModeBuilder extends AppBuilder {
  async build () {
    await this.#buildFiles()
    await this.#writePackageJson()
    await this.#copyElectronFiles()

    this.printSummary(join(this.quasarConf.build.distDir, 'UnPackaged'))

    if (this.argv[ 'skip-pkg' ] !== true) {
      await this.#packageFiles()
    }
  }

  async #buildFiles () {
    const viteConfig = await quasarElectronConfig.vite(this.quasarConf)
    await this.buildWithVite('Electron UI', viteConfig)

    const mainConfig = await quasarElectronConfig.main(this.quasarConf)
    await this.buildWithEsbuild('Electron Main', mainConfig)

    const preloadList = await quasarElectronConfig.preloadScriptList(this.quasarConf)
    for (const preloadScript of preloadList) {
      await this.buildWithEsbuild(`Electron Preload (${ preloadScript.scriptName })`, preloadScript.esbuildConfig)
    }
  }

  async #writePackageJson () {
    const { appPkg } = this.ctx.pkg
    const pkg = merge({}, appPkg)

    if (pkg.dependencies) {
      pkg.dependencies = getFixedDeps(pkg.dependencies, this.ctx.appPaths.appDir)
      delete pkg.dependencies[ '@quasar/extras' ]
    }

    // we don't need this (also, faster install time & smaller bundles)
    delete pkg.devDependencies
    delete pkg.browserslist
    delete pkg.scripts

    pkg.main = `./electron-main.${ this.quasarConf.metaConf.packageTypeBasedExtension }`

    if (typeof this.quasarConf.electron.extendPackageJson === 'function') {
      this.quasarConf.electron.extendPackageJson(pkg)
    }

    this.writeFile(
      'UnPackaged/package.json',
      this.quasarConf.metaConf.debugging === true
        ? JSON.stringify(pkg, null, 2)
        : JSON.stringify(pkg)
    )
  }

  async #copyElectronFiles () {
    const patterns = [
      '.npmrc',
      'package-lock.json',
      '.yarnrc',
      'yarn.lock',
      'pnpm-lock.yaml',
      'bun.lockb'
    ].map(filename => ({
      from: filename,
      to: './UnPackaged'
    }))

    patterns.push({
      from: this.ctx.appPaths.resolve.electron('icons'),
      to: './UnPackaged/icons'
    })

    this.copyFiles(patterns)
  }

  async #packageFiles () {
    const { appPaths, cacheProxy } = this.ctx

    const nodePackager = await cacheProxy.getModule('nodePackager')
    nodePackager.install({
      cwd: join(this.quasarConf.build.distDir, 'UnPackaged'),
      params: this.quasarConf.electron.unPackagedInstallParams,
      displayName: 'UnPackaged folder production',
      env: 'production'
    })

    if (typeof this.quasarConf.electron.beforePackaging === 'function') {
      log('Running beforePackaging()')
      log()

      const result = this.quasarConf.electron.beforePackaging({
        appPaths,
        unpackagedDir: join(this.quasarConf.build.distDir, 'UnPackaged')
      })

      if (result && result.then) {
        await result
      }

      log()
      log('[SUCCESS] Done running beforePackaging()')
    }

    const bundlerName = this.quasarConf.electron.bundler
    const bundlerConfig = this.quasarConf.electron[ bundlerName ]

    const { getBundler } = await cacheProxy.getModule('electron')
    const bundlerResult = await getBundler(bundlerName)
    const bundler = bundlerResult.default || bundlerResult
    const pkgName = `electron-${ bundlerName }`

    return new Promise((resolve, reject) => {
      const done = progress('Bundling app with ___...', `electron-${ bundlerName }`)

      const bundlePromise = bundlerName === 'packager'
        ? bundler({
          ...bundlerConfig,
          electronVersion: getPackageJson('electron', appPaths.appDir).version
        })
        : bundler.build(bundlerConfig)

      bundlePromise
        .then(() => {
          log()
          done(`${ pkgName } built the app`)
          log()
          resolve()
        })
        .catch(err => {
          log()
          warn(`${ pkgName } could not build`, 'FAIL')
          log()
          console.error(err + '\n')
          reject()
        })
    })
  }
}
