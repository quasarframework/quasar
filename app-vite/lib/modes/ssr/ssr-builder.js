
const { join } = require('path')

const AppBuilder = require('../../app-builder')
const config = require('./ssr-config')
const appPaths = require('../../app-paths')
const getFixedDeps = require('../../helpers/get-fixed-deps')
const getTemplateFn = require('./get-template-fn')

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

    await this.#writeHtmlTemplate(viteClientConfig.build.outDir)

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

  async #writeHtmlTemplate (clientDir) {
    const htmlFile = appPaths.resolve.app(this.quasarConf.build.htmlFilename)
    const manifestFile = join(clientDir, '/manifest.json')

    const html = this.readFile(htmlFile)
    const manifest = require(manifestFile)

    const templateFn = getTemplateFn(this.quasarConf, html, manifest)

    this.writeFile('render-template.js', `module.exports=${templateFn.source}`)
    this.removeFile(manifestFile)
  }
}

module.exports = SsrBuilder
