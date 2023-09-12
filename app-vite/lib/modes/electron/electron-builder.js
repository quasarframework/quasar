
const { join } = require('path')

const AppBuilder = require('../../app-builder')
const config = require('./electron-config')

const { log, warn, progress } = require('../../helpers/logger')
const appPaths = require('../../app-paths')
const nodePackager = require('../../helpers/node-packager')
const getPackageJson = require('../../helpers/get-package-json')
const getFixedDeps = require('../../helpers/get-fixed-deps')

class ElectronBuilder extends AppBuilder {
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
    const viteConfig = await config.vite(this.quasarConf)
    await this.buildWithVite('Electron UI', viteConfig)

    const mainConfig = await config.main(this.quasarConf)
    await this.buildWithEsbuild('Electron Main', mainConfig)
    this.#replaceAppUrl(mainConfig.outfile)

    const preloadConfig = await config.preload(this.quasarConf)
    await this.buildWithEsbuild('Electron Preload', preloadConfig)
    this.#replaceAppUrl(preloadConfig.outfile)
  }

  // we can't do it by define() cause esbuild
  // does not accepts the syntax of the replacement
  #replaceAppUrl (file) {
    const content = this.readFile(file)
    this.writeFile(file, content.replace(/process\.env\.APP_URL/g, '"file://" + __dirname + "/index.html"'))
  }

  async #writePackageJson () {
    const pkg = require(appPaths.resolve.app('package.json'))

    if (pkg.dependencies) {
      pkg.dependencies = getFixedDeps(pkg.dependencies)
      delete pkg.dependencies[ '@quasar/extras' ]
    }

    // we don't need this (also, faster install time & smaller bundles)
    delete pkg.devDependencies
    delete pkg.browserslist
    delete pkg.scripts

    pkg.main = './electron-main.js'

    if (typeof this.quasarConf.electron.extendPackageJson === 'function') {
      this.quasarConf.electron.extendPackageJson(pkg)
    }

    this.writeFile('UnPackaged/package.json', JSON.stringify(pkg))
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
      from: appPaths.resolve.electron('icons'),
      to: './UnPackaged/icons'
    })

    this.copyFiles(patterns)
  }

  async #packageFiles () {
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
    const bundler = require('./bundler').getBundler(bundlerName)
    const pkgName = `electron-${ bundlerName }`

    return new Promise((resolve, reject) => {
      const done = progress('Bundling app with ___...', `electron-${ bundlerName }`)

      const bundlePromise = bundlerName === 'packager'
        ? bundler({
          ...bundlerConfig,
          electronVersion: getPackageJson('electron').version
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

module.exports = ElectronBuilder
