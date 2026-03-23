import { join } from 'node:path'
import { writeFileSync } from 'node:fs'
import { merge } from 'webpack-merge'
import { stringifyJSON } from 'confbox'

import { AppBuilder } from '../../app-builder.js'
import { quasarSsrConfig } from './ssr-config.js'
import { cliPkg } from '../../utils/cli-runtime.js'
import { getFixedDeps } from '../../utils/get-fixed-deps.js'
import {
  getProdSsrTemplateFn,
  transformProdSsrPwaOfflineHtml
} from '../../utils/html-template.js'

import { injectPwaManifest, buildPwaServiceWorker } from '../pwa/utils.js'

const ssrManifestIdQueryRE = /vue\?vue/
const ssrManifestIdQueryReplaceRE = /vue\?vue.*$/

export class QuasarModeBuilder extends AppBuilder {
  async build() {
    await this.#buildWebserver()
    await this.#copyWebserverFiles()
    await this.#writePackageJson()

    if (this.quasarConf.ssr.pwa === true) {
      // also update pwa-builder.js when changing here
      injectPwaManifest(this.quasarConf)
    }

    const viteClientConfig = await quasarSsrConfig.viteClient(this.quasarConf)
    await this.buildWithVite('SSR Client', viteClientConfig)

    this.#writeSsrManifest()

    this.removeFile(join(viteClientConfig.build.outDir, '.vite'))

    await this.#writeRenderTemplate(viteClientConfig.build.outDir)

    if (this.quasarConf.ssr.pwa === true) {
      // we need to detour the distDir temporarily
      const originalDistDir = this.quasarConf.build.distDir
      this.quasarConf.build.distDir = join(
        this.quasarConf.build.distDir,
        'client'
      )

      // also update pwa-builder.js when changing here
      writeFileSync(
        join(
          this.quasarConf.build.distDir,
          this.quasarConf.pwa.manifestFilename
        ),
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

  async #buildWebserver() {
    const esbuildConfig = await quasarSsrConfig.webserver(this.quasarConf)
    await this.buildWithEsbuild('SSR Webserver', esbuildConfig)
  }

  #copyWebserverFiles() {
    const patterns = ['.npmrc', '.yarnrc'].map(filename => ({
      from: filename,
      to: '.'
    }))

    this.copyFiles(patterns)
  }

  #writePackageJson() {
    const { appPkg } = this.ctx.pkg

    const localAppPkg = merge({}, appPkg)
    const appDeps = getFixedDeps(
      localAppPkg.dependencies || {},
      this.ctx.appPaths.appDir
    )

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
      pkg.dependencies['serialize-javascript'] =
        cliPkg.dependencies['serialize-javascript']
    }

    if (typeof this.quasarConf.ssr.extendPackageJson === 'function') {
      this.quasarConf.ssr.extendPackageJson(pkg)
    }

    this.writeFile('package.json', stringifyJSON(pkg, { indent: 2 }))
  }

  async #writeRenderTemplate(clientDir) {
    const htmlFile = join(clientDir, 'index.html')
    const html = this.readFile(htmlFile)

    const templateFn = await getProdSsrTemplateFn(html, this.quasarConf)

    this.writeFile('render-template.js', `export default ${templateFn.source}`)

    if (this.quasarConf.ssr.pwa === true) {
      this.writeFile(
        `client/${this.quasarConf.ssr.pwaOfflineHtmlFilename}`,
        await transformProdSsrPwaOfflineHtml(html, this.quasarConf)
      )
    }

    this.removeFile(htmlFile)
  }

  #writeSsrManifest() {
    const viteManifest = JSON.parse(
      this.readFile('client/.vite/ssr-manifest.json')
    )

    const ssrManifest = {}

    /**
     * See https://github.com/quasarframework/quasar/issues/17864
     * Need to strip out the query part of the IDs introduced by @vitejs/plugin-vue,
     *   eg: `?vue&type=script&setup=true&lang.ts`
     *   eg: `?vue&type=style&index=0&lang.scss`
     *
     * Otherwise we will have multiple entries for the same file,
     * but NONE will match the actual production ID of the file.
     *
     * Example with original viteManifest:
     *  "src/components/UsedOnTwoPlaces.vue?vue&type=script&setup=true&lang.ts": [
          "/assets/UsedOnTwoPlaces.vue_vue_type_style_index_0_lang-CCF7vrwS.js",
          "/assets/UsedOnTwoPlaces-CLKnUPw2.css"
        ],
        "src/components/UsedOnTwoPlaces.vue?vue&type=style&index=0&lang.scss": [
          "/assets/UsedOnTwoPlaces.vue_vue_type_style_index_0_lang-CCF7vrwS.js",
          "/assets/UsedOnTwoPlaces-CLKnUPw2.css"
        ],
     */
    for (let [key, value] of Object.entries(viteManifest)) {
      if (ssrManifestIdQueryRE.test(key) === true) {
        key = key.replace(ssrManifestIdQueryReplaceRE, 'vue')
        if (ssrManifest[key] !== void 0) continue
      }

      ssrManifest[key] = value
    }

    this.writeFile(
      'quasar.manifest.json',
      JSON.stringify(
        ssrManifest,
        null,
        this.quasarConf.build.minify !== false ? void 0 : 2
      )
    )
  }
}
