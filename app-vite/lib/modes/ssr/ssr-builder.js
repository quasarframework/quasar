
const { join } = require('path')

const AppBuilder = require('../../app-builder')
const config = require('./ssr-config')
const appPaths = require('../../app-paths')
const getFixedDeps = require('../../helpers/get-fixed-deps')
const { getIndexHtml } = require('./html-template')

class SsrBuilder extends AppBuilder {
  async build () {
    await this.#buildWebserver()
    await this.#copyWebserverFiles()
    await this.#writePackageJson()

    const viteClientConfig = config.viteClient(this.quasarConf)
    await this.buildWithVite('Client', viteClientConfig)

    this.moveFile('client/ssr-manifest.json', 'ssr-manifest.json')

    await this.#writeHtmlTemplate()

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
        'compression': '^1.0.0',
        'express': '^4.0.0'
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

  async #writeHtmlTemplate () {
    const htmlFile = join(this.quasarConf.build.distDir, 'client', this.quasarConf.build.htmlFilename)
    const renderTemplate = getIndexHtml(this.readFile(htmlFile), this.quasarConf)

    this.writeFile('render-template.js', `module.exports=${renderTemplate.source}`)

    // remove the original; not needed and in the way
    // when static serving the client folder
    this.removeFile(htmlFile)
  }
}

module.exports = SsrBuilder
