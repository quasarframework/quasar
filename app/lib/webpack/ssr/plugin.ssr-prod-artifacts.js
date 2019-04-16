const
  fs = require('fs'),
  path = require('path'),
  compileTemplate = require('lodash.template')

const
  appPaths = require('../../app-paths'),
  getFixedDeps = require('../../helpers/get-fixed-deps'),
  { getIndexHtml } = require('../../ssr/html-template')

module.exports = class SsrProdArtifacts {
  constructor (cfg = {}) {
    this.cfg = cfg
  }

  apply (compiler) {
    compiler.hooks.emit.tapAsync('ssr-artifacts', (compiler, callback) => {
      /*
       * /template.html
       */
      const
        htmlFile = appPaths.resolve.app(this.cfg.sourceFiles.indexHtmlTemplate),
        htmlTemplate = getIndexHtml(fs.readFileSync(htmlFile, 'utf-8'), this.cfg)

      compiler.assets['../template.html'] = {
        source: () => Buffer.from(htmlTemplate, 'utf8'),
        size: () => Buffer.byteLength(htmlTemplate)
      }

      /*
       * /ssr.js
       */
      const
        ssrFile = path.join(__dirname, 'template.ssr.js'),
        ssrTemplate = compileTemplate(fs.readFileSync(ssrFile, 'utf-8'))({
          opts: this.cfg.ssr.__templateOpts,
          flags: this.cfg.ssr.__templateFlags
        })

      compiler.assets['../ssr.js'] = {
        source: () => Buffer.from(ssrTemplate, 'utf8'),
        size: () => Buffer.byteLength(ssrTemplate)
      }

      /*
       * /index.js
       */
      const index = `require('./server/${this.cfg.ssr.__index}')`
      compiler.assets[`../${this.cfg.ssr.__index}`] = {
        source: () => Buffer.from(index, 'utf8'),
        size: () => Buffer.byteLength(index)
      }

      /*
       * /package.json
       */
      const
        appPkg = require(appPaths.resolve.app('package.json')),
        cliPkg = require(appPaths.resolve.cli('package.json')),
        appDeps = getFixedDeps(appPkg.dependencies),
        cliDeps = cliPkg.dependencies

      let pkg = {
        name: appPkg.name,
        version: appPkg.version,
        description: appPkg.description,
        author: appPkg.author,
        private: true,
        scripts: {
          start: 'node index.js'
        },
        dependencies: Object.assign(appDeps, {
          '@quasar/babel-preset-app': cliDeps['@quasar/babel-preset-app'],
          'compression': '^1.0.0',
          'express': '^4.0.0',
          'lru-cache': cliDeps['lru-cache'],
          'vue': cliDeps.vue,
          'vue-server-renderer': cliDeps['vue-server-renderer'],
          'vue-router': cliDeps['vue-router']
        }),
        engines: appPkg.engines,
        quasar: { ssr: true }
      }

      if (this.cfg.store) {
        pkg.dependencies.vuex = cliDeps.vuex
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
