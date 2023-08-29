const { merge } = require('webpack-merge')

const { AppBuilder } = require('../../app-builder.js')
const { quasarSsrConfig } = require('./ssr-config.js')
const { cliPkg } = require('../../utils/cli-runtime.js')
const { getFixedDeps } = require('../../utils/get-fixed-deps.js')
const { getSsrHtmlTemplateFn } = require('../../utils/html-template.js')

module.exports.QuasarModeBuilder = class QuasarModeBuilder extends AppBuilder {
  async build () {
    await this.#buildWebserver()
    await this.#copyWebserverFiles()
    await this.#writePackageJson()

    // also update pwa-builder.js when changing here
    if (this.quasarConf.pwa.workboxMode === 'InjectManifest') {
      const esbuildConfig = await quasarSsrConfig.customSw(this.quasarConf)
      await this.buildWithEsbuild('InjectManifest Custom SW', esbuildConfig)
    }

    const webpackClientConf = await quasarSsrConfig.webpackClient(this.quasarConf)
    await this.buildWithWebpack('SSR Client-side', webpackClientConf)

    await this.#writeRenderTemplate(this.quasarConf, webpackClientConf.output.path)

    const webpackServerConf = await quasarSsrConfig.webpackServer(this.quasarConf)
    await this.buildWithWebpack('SSR Server-side', webpackServerConf)

    this.printSummary(this.quasarConf.build.distDir, true)
  }

  async #buildWebserver () {
    const esbuildConfig = await quasarSsrConfig.webserver(this.quasarConf)
    await this.buildWithEsbuild('SSR Webserver', esbuildConfig)
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
    const { appPkg } = this.ctx.pkg

    const localAppPkg = merge({}, appPkg)
    const appDeps = getFixedDeps(localAppPkg.dependencies || {}, this.ctx.appPaths.appDir)

    const pkg = {
      name: localAppPkg.name,
      version: localAppPkg.version,
      description: localAppPkg.description,
      author: localAppPkg.author,
      private: true,
      type: 'commonjs',
      module: 'index.js',
      scripts: {
        start: 'node index.js'
      },
      dependencies: Object.assign(appDeps, {
        compression: cliPkg.dependencies.compression,
        express: cliPkg.dependencies.express
      }),
      engines: localAppPkg.engines,
      browserslist: localAppPkg.browserslist,
      quasar: { ssr: true }
    }

    if (this.quasarConf.ssr.manualStoreSerialization !== true) {
      pkg.dependencies[ 'serialize-javascript' ] = cliPkg.dependencies[ 'serialize-javascript' ]
    }

    if (typeof this.quasarConf.ssr.extendPackageJson === 'function') {
      this.quasarConf.ssr.extendPackageJson(pkg)
    }

    this.writeFile('package.json', JSON.stringify(pkg, null, 2))
  }

  async #writeRenderTemplate () {
    const htmlFile = this.ctx.appPaths.resolve.app(
      this.quasarConf.sourceFiles.indexHtmlTemplate
    )

    const html = this.readFile(htmlFile)
    const templateFn = getSsrHtmlTemplateFn(html, this.quasarConf)

    this.writeFile(
      'render-template.js',
      `module.exports=${ templateFn.source }`
    )
  }
}
