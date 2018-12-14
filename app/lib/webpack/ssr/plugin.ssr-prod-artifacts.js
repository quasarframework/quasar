const
  fs = require('fs'),
  path = require('path'),
  compileTemplate = require('lodash.template')

const
  appPaths = require('../../app-paths'),
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
        source: () => new Buffer(htmlTemplate),
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
        source: () => new Buffer(ssrTemplate),
        size: () => Buffer.byteLength(ssrTemplate)
      }

      /*
       * /index.js
       */
      const index = `require('./server/${this.cfg.ssr.__index}')`
      compiler.assets[`../${this.cfg.ssr.__index}`] = {
        source: () => new Buffer(index),
        size: () => Buffer.byteLength(index)
      }

      /*
       * /package.json
       */
      const
        appPkg = require(appPaths.resolve.app('package.json')),
        cliPkg = require(appPaths.resolve.cli('package.json')),
        deps = cliPkg.dependencies

      let pkg = {
        name: appPkg.name,
        version: appPkg.version,
        description: appPkg.description,
        author: appPkg.author,
        private: true,
        scripts: {
          start: 'node index.js'
        },
        dependencies: Object.assign(appPkg.dependencies || {}, {
          '@babel/runtime': deps['@babel/runtime'],
          'compression': '^1.0.0',
          'core-js': require(appPaths.resolve.app('node_modules/core-js/package.json')).version,
          'express': '^4.0.0',
          'lru-cache': deps['lru-cache'],
          'vue': deps.vue,
          'vue-server-renderer': deps['vue-server-renderer'],
          'vue-router': deps['vue-router']
        }),
        engines: appPkg.engines,
        quasar: { ssr: true }
      }

      if (this.cfg.store) {
        pkg.dependencies.vuex = deps.vuex
      }

      pkg = JSON.stringify(pkg, null, 2)
      compiler.assets['../package.json'] = {
        source: () => new Buffer(pkg),
        size: () => Buffer.byteLength(pkg)
      }

      callback()
    })
  }
}
