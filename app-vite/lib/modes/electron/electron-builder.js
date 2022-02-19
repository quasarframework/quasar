
const AppBuilder = require('../../builder')
const config = require('./electron-config')

const { log, info, warn, fatal, success } = require('../../helpers/logger')
const { spawn } = require('../../helpers/spawn')
const appPaths = require('../../app-paths')
const nodePackager = require('../../helpers/node-packager')
const getPackageJson = require('../../helpers/get-package-json')
const getFixedDeps = require('../../helpers/get-fixed-deps')

class ElectronBuilder extends AppBuilder {
  async build () {
    await this.#buildFiles()
    await this.#writePackageJson()
    await this.#copyElectronFiles()
    await this.#packageFiles()
  }

  async #buildFiles () {
    const viteConfig = config.vite(this.quasarConf)
    await this.buildWithVite('Renderer', viteConfig)

    const mainConfig = config.main(this.quasarConf)
    await this.buildWithEsbuild('Main thread', mainConfig)

    const preloadConfig = config.preload(this.quasarConf)
    await this.buildWithEsbuild('Preload thread', preloadConfig)
  }

  async #writePackageJson () {
    const pkg = require(appPaths.resolve.app('package.json'))

    if (pkg.dependencies) {
      pkg.dependencies = getFixedDeps(pkg.dependencies)
      delete pkg.dependencies['@quasar/extras']
    }

    // we don't need this (also, faster install time & smaller bundles)
    delete pkg.devDependencies
    delete pkg.browserslist
    delete pkg.scripts

    pkg.main = './electron-main.js'

    if (this.quasarConf.electron.extendPackageJson) {
      this.quasarConf.electron.extendPackageJson(pkg)
    }

    this.writeFile('package.json', JSON.stringify(pkg))
  }

  async #copyElectronFiles () {
    const patterns = [
      '.npmrc',
      'package-lock.json',
      '.yarnrc',
      'yarn.lock',
    ].map(filename => ({
      from: filename,
      to: '.'
    }))

    patterns.push({
      from: appPaths.resolve.electron('icons'),
      to: './icons'
    })

    this.copyFiles(patterns)
  }

  #packageFiles () {
    return new Promise(resolve => {
      spawn(
        nodePackager,
        [ 'install', '--production' ].concat(this.quasarConf.electron.unPackagedInstallParams),
        { cwd: this.quasarConf.build.distDir },
        code => {
          if (code) {
            fatal(`${nodePackager} failed installing dependencies`, 'FAIL')
          }
          resolve()
        }
      )
    }).then(async () => {
      if (typeof this.quasarConf.electron.beforePackaging === 'function') {
        log('Running beforePackaging()')
        log()

        const result = this.quasarConf.electron.beforePackaging({
          appPaths,
          unpackagedDir: this.quasarConf.build.distDir
        })

        if (result && result.then) {
          await result
        }

        log()
        log('[SUCCESS] Done running beforePackaging()')
      }
    }).then(() => {
      const bundlerName = this.quasarConf.electron.bundler
      const bundlerConfig = this.quasarConf.electron[bundlerName]
      const bundler = require('./bundler').getBundler(bundlerName)
      const pkgName = `electron-${bundlerName}`

      return new Promise((resolve, reject) => {
        info(`Bundling app with electron-${bundlerName}...`, 'WAIT')
        log()

        const startTime = Date.now()

        const bundlePromise = bundlerName === 'packager'
          ? bundler({
            ...bundlerConfig,
            electronVersion: getPackageJson('electron').version
          })
          : bundler.build(bundlerConfig)

        bundlePromise
          .then(() => {
            const diffTime = +new Date() - startTime
            log()
            success(`${pkgName} built the app • ${diffTime}ms`, 'SUCCESS')
            log()
            resolve()
          })
          .catch(err => {
            log()
            warn(`${pkgName} could not build`, 'FAIL')
            log()
            console.error(err + '\n')
            reject()
          })
      })
    })
  }
}

module.exports = ElectronBuilder
