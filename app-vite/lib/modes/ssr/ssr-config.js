
const { join } = require('path')

const createViteConfig = require('../../create-vite-config')

const appPaths = require('../../app-paths')
const parseEnv = require('../../parse-env')

const { dependencies:appDeps = {}, devDependencies:appDevDeps = {} } = require(appPaths.resolve.app('package.json'))
const { dependencies:cliDeps = {} } = require(appPaths.resolve.cli('package.json'))

const external = [
  ...Object.keys(cliDeps),
  ...Object.keys(appDeps),
  ...Object.keys(appDevDeps)
]

module.exports = {
  viteClient: quasarConf => {
    const cfg = createViteConfig(quasarConf, 'ssr-client')

    cfg.define['process.env.CLIENT'] = true
    cfg.define['process.env.SERVER'] = false

    cfg.server = { middlewareMode: true }

    cfg.build.ssrManifest = true
    cfg.build.outDir = join(quasarConf.build.distDir, 'client')

    return cfg
  },

  viteServer: quasarConf => {
    const cfg = createViteConfig(quasarConf, 'ssr-server')

    cfg.define['process.env.CLIENT'] = false
    cfg.define['process.env.SERVER'] = true

    cfg.publicDir = false // let client config deal with it

    cfg.server = {
      hmr: false,
      middlewareMode: 'ssr'
    }

    cfg.ssr = {
      noExternal: [
        /\/esm\/.*\.js$/,
        /\.(es|esm|esm-browser|esm-bundler).js$/
      ]
    }

    cfg.build.ssr = appPaths.resolve.app('.quasar/server-entry.js')
    cfg.build.outDir = join(quasarConf.build.distDir, 'server')

    return cfg
  },

  webserver: quasarConf => {
    const cfg = {
      platform: 'node',
      target: 'node12',
      format: 'cjs',
      bundle: true,
      sourcemap: quasarConf.metaConf.debugging ? 'inline' : false,
      external,
      minify: quasarConf.build.minify !== false,
      define: parseEnv(quasarConf.build.env, quasarConf.build.rawDefine)
    }

    cfg.define['process.env.CLIENT'] = false
    cfg.define['process.env.SERVER'] = true

    if (quasarConf.ctx.dev) {
      cfg.entryPoints = [ appPaths.resolve.app('.quasar/ssr-middlewares.js') ]
      cfg.outfile = appPaths.resolve.app('.quasar/ssr/compiled-middlewares.js')
    }
    else {
      // if ( TODO
      //   existsSync(prodExportFile.js) === false &&
      //   existsSync(prodExportFile.ts) === false
      // ) {
      //   chain.resolve.alias.set('src-ssr/production-export', prodExportFile.fallback)
      // }

      cfg.external = [
        ...cfg.external,
        'vue/server-renderer',
        'vue/compiler-sfc',
        './render-template.js',
        './ssr-manifest.json',
        './server/server-entry.js',
        'compression',
        'express'
      ]

      cfg.entryPoints = [ appPaths.resolve.app('.quasar/ssr-prod-webserver.js') ]
      cfg.outfile = join(quasarConf.build.distDir, 'index.js')
    }

    return cfg
  }
}
