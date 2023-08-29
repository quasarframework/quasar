const { existsSync } = require('node:fs')
const { join, sep, normalize } = require('node:path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const {
  createWebpackChain, extendWebpackChain,
  createNodeEsbuildConfig, extendEsbuildConfig
} = require('../../config-tools.js')

const { getBuildSystemDefine } = require('../../utils/env.js')
const { injectWebpackHtml } = require('../../utils/html-template.js')

const { quasarPwaConfig, injectWebpackPwa } = require('../pwa/pwa-config.js')
const { QuasarSSRClientPlugin } = require('./plugin.webpack.client-side.js')
const { QuasarSSRServerPlugin } = require('./plugin.webpack.server-side.js')

function getModuleDirs (dir) {
  const folders = []

  while (dir.length && dir[ dir.length - 1 ] !== sep) {
    const newFolder = join(dir, 'node_modules')
    if (existsSync(newFolder)) {
      folders.push(newFolder)
    }

    dir = normalize(join(dir, '..'))
  }

  return folders
}

const quasarSsrConfig = {
  webpackClient: async quasarConf => {
    const { ctx } = quasarConf

    const webpackChain = await createWebpackChain(quasarConf, {
      compileId: 'webpack-ssr-client',
      threadName: 'SSR Client-side'
    })

    if (ctx.prod) {
      webpackChain.output
        .path(
          join(quasarConf.build.distDir, 'client')
        )

      webpackChain.plugin('quasar-ssr-client')
        .use(QuasarSSRClientPlugin)
    }
    else if (quasarConf.devServer.hot) {
      webpackChain.plugin('hot-module-replacement')
        .use(webpack.HotModuleReplacementPlugin)
    }

    if (ctx.mode.pwa) {
      const templateParam = JSON.parse(JSON.stringify(quasarConf.htmlVariables))

      templateParam.ctx.mode = { pwa: true }
      templateParam.ctx.modeName = 'pwa'
      if (templateParam.process && templateParam.process.env) {
        templateParam.process.env.MODE = 'pwa'
      }

      injectWebpackPwa(webpackChain, quasarConf)
      injectWebpackHtml(webpackChain, quasarConf, templateParam)
    }

    webpackChain.plugin('define')
      .tap(args => {
        return [ {
          ...args[ 0 ],
          ...getBuildSystemDefine({
            buildEnv: {
              CLIENT: true,
              SERVER: false
            }
          })
        } ]
      })

    return extendWebpackChain(webpackChain, quasarConf, { isClient: true })
  },

  webpackServer: async quasarConf => {
    const { ctx } = quasarConf
    const { appPaths, cacheProxy } = ctx

    const webpackChain = await createWebpackChain(quasarConf, {
      compileId: 'webpack-ssr-server',
      threadName: 'SSR Server-side'
    })

    webpackChain.entry('app')
      .clear()
      .add(
        appPaths.resolve.entry('server-entry.js')
      )

    webpackChain.resolve.alias
      .set('quasar$', 'quasar/dist/quasar.cjs.prod.js')

    webpackChain.target('node')

    if (quasarConf.metaConf.debugging) {
      webpackChain.devtool('source-map')
    }

    if (ctx.prod) {
      webpackChain.output
        .path(
          join(quasarConf.build.distDir, 'server')
        )

      webpackChain.plugin('quasar-ssr-server')
        .use(QuasarSSRServerPlugin)
    }

    webpackChain.output
      .filename('server-entry.js')
      .chunkFilename('chunk-[name].js')
      .libraryTarget('commonjs2')

    const additionalModuleDirs = cacheProxy.getRuntime('ssrServerAdditionalModuleDirst', () => {
      return getModuleDirs(
        appPaths.resolve.app('..')
      )
    })

    webpackChain.externals(nodeExternals({
      // do not externalize:
      //  1. vue files
      //  2. CSS files
      //  3. when importing directly from Quasar's src folder
      //  4. Quasar language files
      //  5. Quasar icon sets files
      //  6. Quasar extras
      allowlist: [
        /(\.(vue|css|styl|scss|sass|less)$|\?vue&type=style|^quasar[\\/]lang[\\/]|^quasar[\\/]icon-set[\\/]|^@quasar[\\/]extras[\\/])/,
        ...quasarConf.build.webpackTranspileDependencies
      ],
      additionalModuleDirs
    }))

    webpackChain.plugin('define')
      .tap(args => {
        return [ {
          ...args[ 0 ],
          ...getBuildSystemDefine({
            buildEnv: {
              CLIENT: false,
              SERVER: true
            }
          })
        } ]
      })

    return extendWebpackChain(webpackChain, quasarConf, { isServer: true })
  },

  webserver: async quasarConf => {
    const { ctx } = quasarConf
    const { appPaths } = ctx

    const cfg = await createNodeEsbuildConfig(quasarConf, { compileId: 'node-ssr-webserver', format: 'cjs' })

    Object.assign(cfg.define, getBuildSystemDefine({
      buildEnv: {
        CLIENT: false,
        SERVER: true
      }
    }))

    if (ctx.dev) {
      cfg.entryPoints = [ appPaths.resolve.entry('ssr-dev-webserver.js') ]
      cfg.outfile = appPaths.resolve.entry('compiled-dev-webserver.js')
    }
    else {
      cfg.external = [
        ...(cfg.external || []),
        'vue/server-renderer',
        'vue/compiler-sfc',
        './render-template.js',
        './quasar.manifest.json',
        './server/server-entry.js'
      ]

      cfg.entryPoints = [ appPaths.resolve.entry('ssr-prod-webserver.js') ]
      cfg.outfile = join(quasarConf.build.distDir, 'index.js')
    }

    return extendEsbuildConfig(cfg, quasarConf.ssr, ctx, 'extendSSRWebserverConf')
  },

  customSw: quasarPwaConfig.customSw
}

module.exports.quasarSsrConfig = quasarSsrConfig
module.exports.modeConfig = quasarSsrConfig
