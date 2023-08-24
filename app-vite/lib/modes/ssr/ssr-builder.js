
import { join } from 'node:path'
import { writeFileSync } from 'node:fs'
import { merge } from 'webpack-merge'

import { AppBuilder } from '../../app-builder.js'
import { quasarSsrConfig } from './ssr-config.js'
import { cliPkg } from '../../utils/cli-runtime.js'
import { getFixedDeps } from '../../utils/get-fixed-deps.js'
import { getProdSsrTemplateFn, transformProdSsrPwaOfflineHtml } from '../../utils/html-template.js'

import { injectPwaManifest, buildPwaServiceWorker } from '../pwa/utils.js'

export class QuasarModeBuilder extends AppBuilder {
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
      if (this.quasarConf.pwa.workboxMode === 'InjectManifest') {
        const esbuildConfig = await quasarSsrConfig.customSw(this.quasarConf)
        await this.buildWithEsbuild('InjectManifest Custom SW', esbuildConfig)
      }

      // also update pwa-builder.js when changing here
      const workboxConfig = await quasarSsrConfig.workbox(this.quasarConf)
      await buildPwaServiceWorker(this.quasarConf, workboxConfig)

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
    const { appPkg } = this.ctx.pkg

    const localAppPkg = merge({}, appPkg)
    const appDeps = getFixedDeps(localAppPkg.dependencies || {}, this.ctx.appPaths.appDir)

    const pkg = {
      name: localAppPkg.name,
      version: localAppPkg.version,
      description: localAppPkg.description,
      author: localAppPkg.author,
      private: true,
      type: 'module',
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

  async #writeRenderTemplate (clientDir) {
    const htmlFile = join(clientDir, 'index.html')
    const html = this.readFile(htmlFile)

    const templateFn = getProdSsrTemplateFn(html, this.quasarConf)

    const prefix = this.ctx.pkg.appPkg.type === 'module'
      ? 'export default '
      : 'module.exports='

    this.writeFile(
      'render-template.js',
      `${ prefix }${ templateFn.source }`
    )

    if (this.quasarConf.ssr.pwa === true) {
      this.writeFile(
        `client/${ this.quasarConf.ssr.pwaOfflineHtmlFilename }`,
        transformProdSsrPwaOfflineHtml(html, this.quasarConf)
      )
    }

    this.removeFile(htmlFile)
  }
}
