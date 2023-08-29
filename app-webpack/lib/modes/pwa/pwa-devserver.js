const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const { AppDevserver } = require('../../app-devserver.js')
const { openBrowser } = require('../../utils/open-browser.js')
const { quasarPwaConfig } = require('./pwa-config.js')

module.exports.QuasarModeDevserver = class QuasarModeDevserver extends AppDevserver {
  #server
  #pwaServiceWorkerWatcher

  constructor (opts) {
    super(opts)

    // also adapt ssr-devserver.js when changing here
    this.registerDiff('webpackPWA', (quasarConf, diffMap) => [
      quasarConf.pwa.workboxMode,
      quasarConf.pwa.swFilename,
      quasarConf.pwa.manifestFilename,
      quasarConf.pwa.extendManifestJson,
      quasarConf.pwa.useCredentialsForManifestTag,
      quasarConf.pwa.injectPwaMetaTags,
      quasarConf.build.htmlFilename, // non-ssr only
      quasarConf.pwa[
        quasarConf.pwa.workboxMode === 'GenerateSW'
          ? 'extendGenerateSWOptions'
          : 'extendInjectManifestOptions'
      ],

      // extends 'webpack' diff
      ...diffMap.webpack(quasarConf)
    ])

    // also update ssr-devserver.js when changing here
    this.registerDiff('customServiceWorker', (quasarConf, diffMap) => [
      quasarConf.pwa.workboxMode,
      quasarConf.pwa.workboxMode === 'InjectManifest'
        ? [
            quasarConf.build,
            quasarConf.pwa.extendInjectManifestOptions,
            quasarConf.pwa.swFilename,
            quasarConf.pwa.extendPWACustomSWConf,
            quasarConf.sourceFiles.pwaServiceWorker,

            // extends 'esbuild' diff
            ...diffMap.esbuild(quasarConf)
          ]
        : ''
    ])
  }

  run (quasarConf, __isRetry) {
    const { diff, queue } = super.run(quasarConf, __isRetry)

    // also update ssr-devserver.js when changing here
    if (diff('customServiceWorker', quasarConf) === true) {
      return queue(() => this.#compileCustomServiceWorker(quasarConf, queue))
    }

    // also update ssr-devserver.js when changing here
    if (diff('webpackPWA', quasarConf) === true) {
      return queue(() => this.#runWebpack(quasarConf, diff('webpackUrl', quasarConf)))
    }
  }

  async #runWebpack (quasarConf, urlDiffers) {
    if (this.#server) {
      await this.#server.stop()
      this.#server = null
    }

    const webpackConf = await quasarPwaConfig.webpack(quasarConf)

    let started = false

    return new Promise(resolve => {
      const compiler = webpack(webpackConf)

      compiler.hooks.done.tap('done-compiling', stats => {
        if (started === true) { return }

        // start dev server if there are no errors
        if (stats.hasErrors() === true) {
          return
        }

        started = true
        resolve()

        this.printBanner(quasarConf)

        if (urlDiffers === true && quasarConf.metaConf.openBrowser) {
          const { metaConf } = quasarConf
          openBrowser({
            url: metaConf.APP_URL,
            opts: metaConf.openBrowser !== true ? metaConf.openBrowser : false
          })
        }
      })

      // start building & launch server
      this.#server = new WebpackDevServer(quasarConf.devServer, compiler)
      this.#server.start()
    })
  }

  // also update ssr-devserver.js when changing here
  async #compileCustomServiceWorker (quasarConf) {
    if (this.#pwaServiceWorkerWatcher) {
      await this.#pwaServiceWorkerWatcher.close()
    }

    if (quasarConf.pwa.workboxMode === 'InjectManifest') {
      const esbuildConfig = await quasarPwaConfig.customSw(quasarConf)
      await this.watchWithEsbuild('InjectManifest Custom SW', esbuildConfig, () => {})
        .then(esbuildCtx => {
          this.#pwaServiceWorkerWatcher = { close: esbuildCtx.dispose }
        })
    }
  }
}
