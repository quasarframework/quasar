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

const ssrMiddlewareEntry = appPaths.resolve.app('.quasar/ssr-middlewares.js')
const ssrMiddlewareOutput = appPaths.resolve.app('.quasar/ssr/compiled-middlewares.js')

module.exports = {
  viteClient: quasarConf => {
    const cfg = createViteConfig(quasarConf, 'ssr-client')

    cfg.define['process.env.CLIENT'] = true
    cfg.define['process.env.SERVER'] = false

    cfg.server = { middlewareMode: true }

    cfg.build.ssr = appPaths.resolve.app('.quasar/entry-client.js')
    cfg.build.manifest = true

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

    cfg.build.ssr = appPaths.resolve.app('.quasar/entry-server.js')
    cfg.build.ssrManifest = true

    return cfg
  },

  webserver: quasarConf => {
    return {
      platform: 'node',
      target: 'node12',
      format: 'cjs',
      bundle: true,
      sourcemap: quasarConf.metaConf.debugging ? 'inline' : false,
      external,
      minify: quasarConf.build.minify !== false,
      define: parseEnv(quasarConf.build.env, quasarConf.build.rawDefine),
      entryPoints: [ ssrMiddlewareEntry ],
      outfile: ssrMiddlewareOutput
    }
  }
}
