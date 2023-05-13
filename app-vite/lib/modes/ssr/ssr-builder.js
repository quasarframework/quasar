
const { join } = require('node:path')
const { writeFileSync } = require('node:fs')
const { merge } = require('webpack-merge')

const { AppBuilder } = require('../../app-builder.js')
const { quasarSsrConfig } = require('./ssr-config.js')
const { appPkg, cliPkg } = require('../../app-pkg.js')
const { getFixedDeps } = require('../../utils/get-fixed-deps.js')
const { getProdSsrTemplateFn, transformProdSsrPwaOfflineHtml } = require('../../utils/html-template.js')

const { injectPwaManifest, buildPwaServiceWorker } = require('../pwa/utils.js')

module.exports.QuasarModeBuilder = class QuasarModeBuilder extends AppBuilder {
  async build () {
    await this.#buildWebserver()
    await this.#copyWebserverFiles()
    await this.#writePackageJson()

    if (this.quasarConf.ssr.pwa === true) {
      // also update pwa-builder.js when changing here
      injectPwaManifest(this.quasarConf)
    }

    const viteClientConfig = await quasarSsrConfig.viteClient(this.quasarConf)
    await this.buildWithVite('SSR Client', viteClientConfig)

    this.moveFile(
      viteClientConfig.build.outDir + '/ssr-manifest.json',
      'quasar.manifest.json'
    )

    await this.#writeRenderTemplate(viteClientConfig.build.outDir)

    if (this.quasarConf.ssr.pwa === true) {
      // we need to detour the distDir temporarily
      const originalDistDir = this.quasarConf.build.distDir
      this.quasarConf.build.distDir = join(this.quasarConf.build.distDir, 'client')

      // also update pwa-builder.js when changing here
      writeFileSync(
        join(this.quasarConf.build.distDir, this.quasarConf.pwa.manifestFilename),
        JSON.stringify(
          this.quasarConf.htmlVariables.pwaManifest,
          null,
          this.quasarConf.build.minify !== false ? void 0 : 2
        ),
        'utf-8'
      )

      // also update pwa-builder.js when changing here
      if (this.quasarConf.pwa.workboxMode === 'injectManifest') {
        const esbuildConfig = await quasarSsrConfig.customSw(this.quasarConf)
        await this.buildWithEsbuild('injectManifest Custom SW', esbuildConfig)
      }

      // also update pwa-builder.js when changing here
      const workboxConfig = await quasarSsrConfig.workbox(this.quasarConf)
      await buildPwaServiceWorker(this.quasarConf.pwa.workboxMode, workboxConfig)

      // restore distDir
      this.quasarConf.build.distDir = originalDistDir
    }

    const viteServerConfig = await quasarSsrConfig.viteServer(this.quasarConf)
    await this.buildWithVite('SSR Server', viteServerConfig)

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
    const localAppPkg = merge({}, appPkg)
    const appDeps = getFixedDeps(localAppPkg.dependencies || {})

    const pkg = {
      name: localAppPkg.name,
      version: localAppPkg.version,
      description: localAppPkg.description,
      author: localAppPkg.author,
      private: true,
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

  async #writeRenderTemplate (clientDir) {
    const htmlFile = join(clientDir, 'index.html')
    const html = this.readFile(htmlFile)

    const templateFn = getProdSsrTemplateFn(html, this.quasarConf)

    this.writeFile('render-template.js', `module.exports=${ templateFn.source }`)

    if (this.quasarConf.ssr.pwa === true) {
      this.writeFile(
        `client/${ this.quasarConf.ssr.ssrPwaHtmlFilename }`,
        transformProdSsrPwaOfflineHtml(html, this.quasarConf)
      )
    }

    this.removeFile(htmlFile)
  }
}
