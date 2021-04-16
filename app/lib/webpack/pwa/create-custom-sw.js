const path = require('path')
const webpack = require('webpack')
const WebpackChain = require('webpack-chain')

const parseBuildEnv = require('../../helpers/parse-build-env')
const appPaths = require('../../app-paths')
const WebpackProgress = require('../plugin.progress')

function getDependenciesRegex (list) {
  const deps = list.map(dep => {
    if (typeof dep === 'string') {
      return path.join('node_modules', dep, '/')
        .replace(/\\/g, '[\\\\/]') // windows support
    }
    else if (dep instanceof RegExp) {
      return dep.source
    }
  })

  return new RegExp(deps.join('|'))
}

module.exports = function (cfg, configName) {
  const chain = new WebpackChain()

  const resolveModules = [
    'node_modules',
    appPaths.resolve.app('node_modules')
  ]

  chain.entry('custom-sw').add(
    appPaths.resolve.app(cfg.sourceFiles.serviceWorker)
  )
  chain.mode(cfg.ctx.dev ? 'development' : 'production')
  chain.devtool(cfg.build.sourceMap ? cfg.build.devtool : false)

  chain.output
    .filename(`service-worker.js`)
    .libraryTarget('commonjs2')
    .path(
      appPaths.resolve.app('.quasar/pwa')
    )

  chain.resolve.symlinks(false)

  chain.resolve.extensions
    .merge(
      cfg.supportTS !== false
        ? [ '.mjs', '.ts', '.js', '.json', '.wasm' ]
        : [ '.mjs', '.js', '.json', '.wasm' ]
    )

  chain.resolve.modules
    .merge(resolveModules)

  chain.resolve.alias
    .merge({
      src: appPaths.srcDir,
      app: appPaths.appDir
    })

  chain.resolveLoader.modules
    .merge(resolveModules)

  chain.module.rule('js-transform-quasar-imports')
    .test(/\.(t|j)sx?$/)
    .use('transform-quasar-imports')
      .loader(path.join(__dirname, '../loader.js.transform-quasar-imports.js'))

  if (cfg.build.transpile === true) {
    const nodeModulesRegex = /[\\/]node_modules[\\/]/
    const exceptionsRegex = getDependenciesRegex(
      [ /\.vue\.js$/, 'quasar', '@babel/runtime' ]
        .concat(cfg.build.transpileDependencies)
    )

    chain.module.rule('babel')
      .test(/\.js$/)
      .exclude
        .add(filepath => (
          // Transpile the exceptions:
          exceptionsRegex.test(filepath) === false &&
          // Don't transpile anything else in node_modules:
          nodeModulesRegex.test(filepath)
        ))
        .end()
      .use('babel-loader')
        .loader('babel-loader')
          .options({
            compact: false,
            extends: appPaths.resolve.app('babel.config.js')
          })
  }

  if (cfg.supportTS !== false) {
    chain.resolve.extensions
      .merge([ '.ts' ])

    chain.module
      .rule('typescript')
      .test(/\.ts$/)
      .use('ts-loader')
        .loader('ts-loader')
        .options({
          onlyCompileBundledFiles: true,
          transpileOnly: false,
          // While `noEmit: true` is needed in the tsconfig preset to prevent VSCode errors,
          // it prevents emitting transpiled files when run into node context
          compilerOptions: {
            noEmit: false,
          }
        })
  }

  chain.module // fixes https://github.com/graphql/graphql-js/issues/1272
    .rule('mjs')
    .test(/\.mjs$/)
    .include
      .add(/[\\/]node_modules[\\/]/)
      .end()
    .type('javascript/auto')

  chain.plugin('define')
    .use(webpack.DefinePlugin, [
      parseBuildEnv(cfg.build.env, cfg.__rootDefines)
    ])

  chain.performance
    .hints(false)
    .maxAssetSize(500000)

  if (cfg.build.showProgress) {
    chain.plugin('progress')
      .use(WebpackProgress, [{ name: configName }])
  }

  // DEVELOPMENT build
  if (cfg.ctx.dev) {
    const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

    chain.optimization
      .noEmitOnErrors(true)

    chain.plugin('friendly-errors')
      .use(FriendlyErrorsPlugin, [{
        clearConsole: true
      }])
  }

  return chain
}
