const
  fs = require('fs'),
  path = require('path'),
  compileTemplate = require('lodash.template')

const
  appPaths = require('../../app-paths'),
  getPackageJson = require('../../helpers/get-package-json'),
  { getIndexHtml } = require('../../ssr/html-template')

function getFixedAppDeps (appPkg) {
  const deps = appPkg.dependencies

  if (!deps) {
    return {}
  }

  const appDeps = { ...deps }

  Object.keys(deps).forEach(name => {
    const pkg = getPackageJson(name)
    appDeps[name] = pkg ? pkg.version : deps[name]
  })

  return appDeps
}

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
        appDeps = getFixedAppDeps(appPkg),
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
        source: () => new Buffer(pkg),
        size: () => Buffer.byteLength(pkg)
      }

      callback()
    })
  }
}
