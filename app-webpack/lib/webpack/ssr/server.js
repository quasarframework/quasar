const { existsSync } = require('node:fs')
const { join, sep, normalize } = require('node:path')
const nodeExternals = require('webpack-node-externals')

const appPaths = require('../../app-paths.js')
const { QuasarSSRServerPlugin } = require('./plugin.server-side.js')
const { getBuildSystemDefine } = require('../../utils/env.js')

function getModuleDirs () {
  const folders = []
  let dir = appPaths.resolve.app('..')

  while (dir.length && dir[ dir.length - 1 ] !== sep) {
    const newFolder = join(dir, 'node_modules')
    if (existsSync(newFolder)) {
      folders.push(newFolder)
    }

    dir = normalize(join(dir, '..'))
  }

  return folders
}

const additionalModuleDirs = getModuleDirs()

module.exports.injectSSRServer = function injectSSRServer (chain, cfg) {
  chain.entry('app')
    .clear()
    .add(appPaths.resolve.app('.quasar/server-entry.js'))

  chain.resolve.alias.set('quasar$', 'quasar/dist/quasar.cjs.prod.js')

  chain.target('node')

  if (cfg.ctx.dev || cfg.ctx.debug) {
    chain.devtool('source-map')
  }

  if (cfg.ctx.prod) {
    chain.output
      .path(join(cfg.build.distDir, 'server'))
  }

  chain.output
    .filename('entry.js')
    .chunkFilename('chunk-[name].js')
    .libraryTarget('commonjs2')

  chain.externals(nodeExternals({
    // do not externalize:
    //  1. vue files
    //  2. CSS files
    //  3. when importing directly from Quasar's src folder
    //  4. Quasar language files
    //  5. Quasar icon sets files
    //  6. Quasar extras
    allowlist: [
      /(\.(vue|css|styl|scss|sass|less)$|\?vue&type=style|^quasar[\\/]lang[\\/]|^quasar[\\/]icon-set[\\/]|^@quasar[\\/]extras[\\/])/,
      ...cfg.build.transpileDependencies
    ],
    additionalModuleDirs
  }))

  chain.plugin('define')
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

  if (cfg.ctx.prod) {
    chain.plugin('quasar-ssr-server')
      .use(QuasarSSRServerPlugin)
  }
}
