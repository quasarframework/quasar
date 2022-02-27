
const { join } = require('path')

const AppBuilder = require('../../app-builder')
const config = require('./ssr-config')
const appPaths = require('../../app-paths')
const getFixedDeps = require('../../helpers/get-fixed-deps')
const { getProdSsrTemplateFn } = require('../../helpers/html-template')

class SsrBuilder extends AppBuilder {
  async build () {
    await this.#buildWebserver()
    await this.#copyWebserverFiles()
    await this.#writePackageJson()

    const viteClientConfig = config.viteClient(this.quasarConf)
    await this.buildWithVite('Client', viteClientConfig)

    this.moveFile(
      viteClientConfig.build.outDir + '/ssr-manifest.json',
      'quasar.manifest.json'
    )

    await this.#writeRenderTemplate(viteClientConfig.build.outDir)

    const viteServerConfig = config.viteServer(this.quasarConf)
    await this.buildWithVite('Server', viteServerConfig)
  }

  async #buildWebserver () {
    const esbuildConfig = config.webserver(this.quasarConf)
    await this.buildWithEsbuild('Webserver', esbuildConfig)
  }

  async #copyWebserverFiles () {
    const patterns = [
      '.npmrc',
      '.yarnrc'
    ].map(filename => ({
      from: filename,
      to: '.'
    }))

    this.copyFiles(patterns)
  }

  async #writePackageJson () {
    const appPkg = require(appPaths.resolve.app('package.json'))
    const { dependencies: cliDeps } = require(appPaths.resolve.cli('package.json'))

    if (appPkg.dependencies !== void 0) {
      delete appPkg.dependencies['@quasar/extras']
    }

    const appDeps = getFixedDeps(appPkg.dependencies || {})

    const pkg = {
      name: appPkg.name,
      version: appPkg.version,
      description: appPkg.description,
      author: appPkg.author,
      private: true,
      scripts: {
        start: 'node index.js'
      },
      dependencies: Object.assign(appDeps, {
        'compression': cliDeps.compression,
        'express': cliDeps.express,
        'serialize-javascript': cliDeps['serialize-javascript']
      }),
      engines: appPkg.engines,
      browserslist: appPkg.browserslist,
      quasar: { ssr: true }
    }

    if (this.quasarConf.ssr.extendPackageJson) {
      this.quasarConf.ssr.extendPackageJson(pkg)
    }

    this.writeFile('package.json', JSON.stringify(pkg, null, 2))
  }

  async #writeRenderTemplate (clientDir) {
    const htmlFile = join(clientDir, 'index.html')
    const html = this.readFile(htmlFile)

    const templateFn = getProdSsrTemplateFn(html, this.quasarConf)

    this.writeFile('render-template.js', `module.exports=${templateFn.source}`)
    this.removeFile(htmlFile)
  }
}

module.exports = SsrBuilder
