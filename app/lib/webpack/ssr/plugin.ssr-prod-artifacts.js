const fs = require('fs')

const appPaths = require('../../app-paths')
const getFixedDeps = require('../../helpers/get-fixed-deps')
const { getIndexHtml } = require('../../ssr/html-template')

module.exports = class SsrProdArtifacts {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.emit.tapAsync('ssr-artifacts', (compiler, callback) => {
      /*
       * /template.html
       */
      const htmlFile = appPaths.resolve.app(this.cfg.sourceFiles.indexHtmlTemplate)
      const htmlTemplate = getIndexHtml(fs.readFileSync(htmlFile, 'utf-8'), this.cfg)

      compiler.assets['../template.html'] = {
        source: () => Buffer.from(htmlTemplate, 'utf8'),
        size: () => Buffer.byteLength(htmlTemplate)
      }

      /*
       * /package.json
       */
      const appPkg = require(appPaths.resolve.app('package.json'))
      const cliPkg = require(appPaths.resolve.cli('package.json'))

      if (appPkg.dependencies !== void 0) {
        delete appPkg.dependencies['@quasar/extras']
      }

      const appDeps = getFixedDeps(appPkg.dependencies || {})
      const cliDeps = cliPkg.dependencies

      let pkg = {
        name: appPkg.name,
        version: appPkg.version,
        description: appPkg.description,
        author: appPkg.author,
        private: true,
        scripts: {
          start: 'node index.js'
        },
        dependencies: Object.assign(
          appDeps,
          {
            'compression': '^1.0.0',
            'express': '^4.0.0',
            'lru-cache': cliDeps['lru-cache'],
            'vue': cliDeps.vue,
            'vue-server-renderer': cliDeps['vue-server-renderer'],
            'vue-router': cliDeps['vue-router']
          },
          this.cfg.build.transpile === true
            ? { '@quasar/babel-preset-app': cliDeps['@quasar/babel-preset-app'] }
            : {}
        ),
        engines: appPkg.engines,
        browserslist: appPkg.browserslist,
        quasar: { ssr: true }
      }

      if (this.cfg.store) {
        pkg.dependencies.vuex = cliDeps.vuex
      }

      if (this.cfg.ssr.extendPackageJson) {
        this.cfg.ssr.extendPackageJson(pkg)
      }

      pkg = JSON.stringify(pkg, null, 2)
      compiler.assets['../package.json'] = {
        source: () => Buffer.from(pkg, 'utf8'),
        size: () => Buffer.byteLength(pkg)
      }

      callback()
    })
  }
}
