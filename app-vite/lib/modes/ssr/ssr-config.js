
const { join } = require('path')

const {
  createViteConfig, extendViteConfig, mergeViteConfig,
  extendEsbuildConfig
} = require('../../config-tools')

const appPaths = require('../../app-paths')
const parseEnv = require('../../parse-env')

const { dependencies:cliDepsObject } = require(appPaths.resolve.cli('package.json'))
const appPkgFile = appPaths.resolve.app('package.json')
const cliDeps = Object.keys(cliDepsObject)

module.exports = {
  viteClient: quasarConf => {
    let cfg = createViteConfig(quasarConf, 'ssr-client')

    cfg = mergeViteConfig(cfg, {
      define: {
        'process.env.CLIENT': true,
        'process.env.SERVER': false
      },
      server: {
        middlewareMode: true
      },
      build: {
        ssrManifest: true,
        outDir: join(quasarConf.build.distDir, 'client')
      }
    })

    // dev has js entry-point, while prod has index.html
    if (quasarConf.ctx.dev) {
      cfg.build.rollupOptions = cfg.build.rollupOptions || {}
      cfg.build.rollupOptions.input = appPaths.resolve.app('.quasar/client-entry.js')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  viteServer: quasarConf => {
    let cfg = createViteConfig(quasarConf, 'ssr-server')

    cfg = mergeViteConfig(cfg, {
      target: quasarConf.build.target.node,
      define: {
        'process.env.CLIENT': false,
        'process.env.SERVER': true
      },
      server: {
        hmr: false, // let client config deal with it
        middlewareMode: 'ssr'
      },
      ssr: {
        noExternal: [
          /\/esm\/.*\.js$/,
          /\.(es|esm|esm-browser|esm-bundler).js$/
        ]
      },
      build: {
        ssr: true,
        outDir: join(quasarConf.build.distDir, 'server'),
        rollupOptions: {
          input: appPaths.resolve.app('.quasar/server-entry.js')
        }
      }
    })

    return extendViteConfig(cfg, quasarConf, { isServer: true })
  },

  webserver: quasarConf => {
    // fetch fresh copy; user might have installed something new
    delete require.cache[appPkgFile]
    const { dependencies:appDeps = {}, devDependencies:appDevDeps = {} } = require(appPkgFile)

    const external = [
      ...cliDeps,
      ...Object.keys(appDeps),
      ...Object.keys(appDevDeps)
    ]

    const cfg = {
      platform: 'node',
      target: quasarConf.build.target.node,
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
      cfg.entryPoints = [ appPaths.resolve.app('.quasar/ssr-dev-webserver.js') ]
      cfg.outfile = appPaths.resolve.app('.quasar/ssr/compiled-dev-webserver.js')
    }
    else {
      cfg.external = [
        ...cfg.external,
        'vue/server-renderer',
        'vue/compiler-sfc',
        './render-template.js',
        './quasar.manifest.json',
        './server/server-entry.js'
      ]

      cfg.entryPoints = [ appPaths.resolve.app('.quasar/ssr-prod-webserver.js') ]
      cfg.outfile = join(quasarConf.build.distDir, 'index.js')
    }

    return extendEsbuildConfig(cfg, quasarConf.ssr, 'SSRWebserver')
  }
}
