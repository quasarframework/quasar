import { join } from 'node:path'
import { stringifyJSON } from 'confbox'
import { merge } from 'webpack-merge'

import { AppBuilder } from '../../app-builder.js'
import { quasarSsrConfig } from './ssr-config.js'
import { createSsrManifest } from './ssr-utils.js'
import { getPinnedDeps } from '../../utils/get-pinned-deps.js'
import {
  getProdSsrRenderTemplateFileContent,
  transformProdHtmlShell
} from '../../plugins/vite.html.js'

import { buildPwaServiceWorker, injectPwaManifest } from '../pwa/pwa-utils.js'

export class QuasarModeBuilder extends AppBuilder {
  async build() {
    this.cleanArtifacts()

    await this.#copyWebserverFiles()
    await this.#writePackageJson()

    if (this.quasarConf.ssr.pwa) {
      // also update pwa-builder.js when changing here
      await injectPwaManifest(
        this.quasarConf,
        join(
          this.quasarConf.build.distDir,
          'client',
          this.quasarConf.pwa.manifestFilename
        )
      )
    }

    await Promise.all([
      this.#buildWebserver(),
      this.#buildSSRServer(),
      this.#buildSSRClient()
    ])

    this.printSummary(this.quasarConf.build.distDir, true)
  }

  async #buildWebserver() {
    const rolldownConfig = await quasarSsrConfig.webserver(this.quasarConf)
    await this.buildWithRolldown('SSR Webserver', rolldownConfig)
  }

  async #buildSSRServer() {
    const viteServerConfig = await quasarSsrConfig.viteServer(this.quasarConf)
    await this.buildWithVite('SSR Server', viteServerConfig)
  }

  async #buildSSRClient() {
    const viteClientConfig = await quasarSsrConfig.viteClient(this.quasarConf)
    await this.buildWithVite('SSR Client', viteClientConfig)

    await Promise.all([this.#writeSsrManifest(), this.#writeRenderTemplate()])

    if (this.quasarConf.ssr.pwa) {
      await this.#buildPWA()
    }
  }

  async #writeRenderTemplate() {
    const html = await this.readFile('client/index.html')
    await this.removeFile('client/index.html')

    await Promise.all([
      getProdSsrRenderTemplateFileContent(html, this.quasarConf).then(content =>
        this.writeFile('render-template.js', content)
      ),

      this.quasarConf.ssr.pwa ||
      this.quasarConf.ssr.clientSideRenderingRoutes.length !== 0
        ? transformProdHtmlShell(html, this.quasarConf).then(async content => {
            if (this.quasarConf.ssr.pwa) {
              await this.writeFile(
                `client/${this.quasarConf.ssr.pwaOfflineHtmlFilename}`,
                content
              )
            } else if (
              this.quasarConf.ssr.clientSideRenderingRoutes.length !== 0
            ) {
              await this.writeFile(`server/csr.html`, content)
            }
          })
        : null
    ])
  }

  async #writeSsrManifest() {
    const [viteSsrManifest, viteClientManifest] = await Promise.all([
      this.readFile('client/.vite/ssr-manifest.json').then(JSON.parse),
      // a user config can turn the client manifest off through
      // extendViteConf; shared-chunk CSS then simply cannot be resolved
      this.readFile('client/.vite/manifest.json').then(JSON.parse, () => void 0)
    ])

    await this.removeFile('client/.vite')

    let ssrManifest = createSsrManifest({
      viteSsrManifest,
      viteClientManifest,
      publicPath: this.quasarConf.build.publicPath
    })

    if (typeof this.quasarConf.ssr.extendSSRManifestJson === 'function') {
      const overrides =
        await this.quasarConf.ssr.extendSSRManifestJson(ssrManifest)
      if (Object(overrides) === overrides) {
        ssrManifest = merge({}, ssrManifest, overrides)
      }
    }

    await this.ctx.appExt.runAppExtensionHook(
      'extendSSRManifestJson',
      async hook => {
        hook.api.logger.log(`Running "extendSSRManifestJson(ssrManifest)"`)
        const overrides = await hook.fn(ssrManifest, hook.api)
        if (Object(overrides) === overrides) {
          ssrManifest = merge({}, ssrManifest, overrides)
        }
      }
    )

    await this.writeFile(
      'quasar.manifest.json',
      JSON.stringify(
        ssrManifest,
        null,
        this.quasarConf.build.minify !== false ? void 0 : 2
      )
    )
  }

  async #buildPWA() {
    const distDir = join(this.quasarConf.build.distDir, 'client')
    const pwaQuasarConf = {
      ...this.quasarConf,
      build: {
        ...this.quasarConf.build,
        distDir
      }
    }

    // also update pwa-builder.js & ssg-builder.js when changing here
    if (this.quasarConf.pwa.workboxMode === 'InjectManifest') {
      const rolldownConfig = await quasarSsrConfig.customSw(pwaQuasarConf)
      await this.buildWithRolldown('InjectManifest Custom SW', rolldownConfig)
    }

    // also update pwa-builder.js & ssg-builder.js when changing here
    const workboxConfig = await quasarSsrConfig.workbox(pwaQuasarConf)
    await buildPwaServiceWorker(this.quasarConf, workboxConfig)
  }

  async #copyWebserverFiles() {
    const patterns = [
      '.npmrc',
      '.yarnrc',
      'src-ssr/server-assets',
      'src-ssr/pnpm-workspace.yaml'
    ].map(filename => ({
      from: filename,
      to: '.'
    }))

    await this.copyFiles(patterns)
  }

  async #writePackageJson() {
    const {
      appPaths,
      pkg: { appPkg, ssrPkg }
    } = this.ctx

    const rootAppDeps = getPinnedDeps(appPkg.dependencies, appPaths.appDir)
    const ssrAppDeps = getPinnedDeps(ssrPkg.dependencies, appPaths.ssrDir)

    let pkg = {
      name: appPkg.name,
      version: appPkg.version,
      description: appPkg.description,
      author: appPkg.author,
      private: true,
      type: 'module',
      module: 'index.js',
      scripts: {
        start: 'node index.js'
      },
      dependencies: { ...rootAppDeps, ...ssrAppDeps },
      engines: appPkg.engines
    }

    if (typeof this.quasarConf.ssr.extendSSRPackageJson === 'function') {
      const overrides = await this.quasarConf.ssr.extendSSRPackageJson(pkg)
      if (Object(overrides) === overrides) {
        pkg = merge({}, pkg, overrides)
      }
    }

    await this.ctx.appExt.runAppExtensionHook(
      'extendSSRPackageJson',
      async hook => {
        hook.api.logger.log(`Running "extendSSRPackageJson(pkgJson)"`)
        const overrides = await hook.fn(pkg, hook.api)
        if (Object(overrides) === overrides) {
          pkg = merge({}, pkg, overrides)
        }
      }
    )

    await this.writeFile('package.json', stringifyJSON(pkg, { indent: 2 }))
  }
}
