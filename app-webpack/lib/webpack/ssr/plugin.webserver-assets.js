const fs = require('node:fs')
const { sources } = require('webpack')
const { merge } = require('webpack-merge')

const appPaths = require('../../app-paths.js')
const { appPkg, cliPkg } = require('../../app-pkg.js')
const { getFixedDeps } = require('../../utils/get-fixed-deps.js')
const { getIndexHtml } = require('../../ssr/html-template.js')

module.exports.WebserverAssetsPlugin = class WebserverAssetsPlugin {
  constructor (cfg = {}) {
    this.cfg = cfg
    this.initPackageJson()
    this.initHtmlTemplate()
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap('package.json', compilation => {
      compilation.emitAsset('package.json', new sources.RawSource(this.pkg))
      compilation.emitAsset('render-template.js', new sources.RawSource(this.htmlTemplate))
    })
  }

  initPackageJson () {
    const localAppPkg = merge({}, appPkg)

    if (localAppPkg.dependencies !== void 0) {
      delete localAppPkg.dependencies[ '@quasar/extras' ]
    }

    const appDeps = getFixedDeps(localAppPkg.dependencies || {})
    const cliDeps = getFixedDeps(cliPkg.dependencies)

    const pkg = {
      name: localAppPkg.name,
      version: localAppPkg.version,
      description: localAppPkg.description,
      author: localAppPkg.author,
      private: true,
      scripts: {
        start: 'node index.js'
      },
      dependencies: Object.assign(
        appDeps,
        {
          compression: '^1.0.0',
          express: '^4.0.0',
          '@quasar/ssr-helpers': cliDeps[ '@quasar/ssr-helpers' ]
        },
        this.cfg.build.transpile === true
          ? { '@quasar/babel-preset-app': cliDeps[ '@quasar/babel-preset-app' ] }
          : {}
      ),
      engines: appPkg.engines,
      browserslist: appPkg.browserslist,
      quasar: { ssr: true }
    }

    if (this.cfg.ssr.extendPackageJson) {
      this.cfg.ssr.extendPackageJson(pkg)
    }

    this.pkg = JSON.stringify(pkg, null, 2)
  }

  initHtmlTemplate () {
    const htmlFile = appPaths.resolve.app(this.cfg.sourceFiles.indexHtmlTemplate)
    const renderTemplate = getIndexHtml(fs.readFileSync(htmlFile, 'utf-8'), this.cfg)
    this.htmlTemplate = `module.exports=${ renderTemplate.source }`
  }
}
