const { join } = require('node:path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const WebpackChain = require('webpack-chain')
const { VueLoaderPlugin } = require('vue-loader')

const { cliPkg } = require('./utils/cli-runtime.js')
const { getBuildSystemDefine } = require('./utils/env.js')
const { log } = require('./utils/logger.js')
const { injectStyleRules } = require('./utils/inject-style-rules.js')

const { WebpackProgressPlugin } = require('./plugins/webpack.progress.js')
const { BootDefaultExportPlugin } = require('./plugins/webpack.boot-default-export.js')

const cliPkgDependencies = Object.keys(cliPkg.dependencies || {})

function getDependenciesRegex (list) {
  const deps = list.map(dep => { // eslint-disable-line array-callback-return
    if (typeof dep === 'string') {
      return join('node_modules', dep, '/')
        .replace(/\\/g, '[\\\\/]') // windows support
    }
    if (dep instanceof RegExp) {
      return dep.source
    }
  }).filter(e => e)

  return new RegExp(deps.join('|'))
}

function getRawDefine (rootDefines, compileId) {
  if (compileId === 'webpack-ssr-server') {
    return { ...rootDefines, __QUASAR_SSR_SERVER__: true }
  }

  if (compileId === 'webpack-ssr-client') {
    return { ...rootDefines, __QUASAR_SSR_CLIENT__: true }
  }

  return rootDefines
}

module.exports.createWebpackChain = async function createWebpackChain (quasarConf, { compileId, threadName }) {
  const { ctx } = quasarConf
  const { appPaths, cacheProxy } = ctx

  const chain = new WebpackChain()

  const isSsrServer = compileId === 'webpack-ssr-server'
  const { autoImport } = cacheProxy.getModule('quasarMeta')

  const useFastHash = ctx.dev || [ 'electron', 'cordova', 'capacitor', 'bex' ].includes(ctx.modeName)
  const fileHash = useFastHash === true ? '' : '.[contenthash:8]'
  const assetHash = useFastHash === true ? '.[hash:8]' : '.[contenthash:8]'

  const resolveModules = [
    'node_modules',
    appPaths.resolve.app('node_modules'),
    appPaths.resolve.cli('node_modules')
  ]

  chain.entry('app').add(appPaths.resolve.entry('client-entry.js'))
  chain.mode(ctx.dev ? 'development' : 'production')
  chain.devtool(quasarConf.build.sourcemap ? quasarConf.build.webpackDevtool : false)

  if (ctx.prod || ctx.mode.ssr) {
    chain.output
      .path(quasarConf.build.distDir)
      .publicPath(quasarConf.build.publicPath)
      .filename(`js/[name]${ fileHash }.js`)
      .chunkFilename(`js/[name]${ useFastHash === true ? '' : '.[chunkhash:8]' }.js`)
  }

  const hasTypescript = cacheProxy.getModule('hasTypescript')
  chain.resolve.extensions
    .merge(
      hasTypescript === true
        ? [ '.mjs', '.ts', '.js', '.vue', '.json', '.wasm' ]
        : [ '.mjs', '.js', '.vue', '.json', '.wasm' ]
    )

  chain.resolve.modules
    .merge(resolveModules)

  chain.resolve.alias
    .merge({
      src: appPaths.srcDir,
      app: appPaths.appDir,
      components: appPaths.resolve.src('components'),
      layouts: appPaths.resolve.src('layouts'),
      pages: appPaths.resolve.src('pages'),
      assets: appPaths.resolve.src('assets'),
      boot: appPaths.resolve.src('boot'),
      stores: appPaths.resolve.src('stores')
    })

  const extrasPath = cacheProxy.getModule('extrasPath')
  if (extrasPath) {
    // required so quasar/icon-sets/* with imports to work correctly
    chain.resolve.alias.merge({ '@quasar/extras': extrasPath })
  }

  const vueFile = isSsrServer
    ? (ctx.prod ? 'vue.cjs.prod.js' : 'vue.cjs.js')
    : (
        quasarConf.build.vueCompiler
          ? 'vue.esm-bundler.js'
          : 'vue.runtime.esm-bundler.js'
      )

  chain.resolve.alias.set('vue$', 'vue/dist/' + vueFile)

  const vueI18nFile = isSsrServer
    ? (ctx.prod ? 'vue-i18n.cjs.prod.js' : 'vue-i18n.cjs.js')
    : 'vue-i18n.esm-bundler.js'

  chain.resolve.alias.set('vue-i18n$', 'vue-i18n/dist/' + vueI18nFile)

  chain.resolveLoader.modules
    .merge(resolveModules)

  chain.module.noParse(
    /^(vue|vue-router|pinia|vuex|vuex-router-sync|@quasar[\\/]extras|quasar[\\/]dist)$/
  )

  const vueRule = chain.module.rule('vue')
    .test(/\.vue$/)

  vueRule.use('vue-auto-import-quasar')
    .loader(join(__dirname, 'loaders/loader.vue.auto-import-quasar.js'))
    .options({
      autoImportComponentCase: quasarConf.framework.autoImportComponentCase,
      isServerBuild: isSsrServer,
      ...autoImport
    })

  vueRule.use('vue-loader')
    .loader('vue-loader')
    .options(
      merge(
        {},
        quasarConf.build.vueLoaderOptions,
        { isServerBuild: isSsrServer }
      )
    )

  if (isSsrServer === false) {
    chain.module.rule('js-transform-quasar-imports')
      .test(/\.(t|j)sx?$/)
      .use('transform-quasar-imports')
      .loader(join(__dirname, 'loaders/loader.js.transform-quasar-imports.js'))
      .options(autoImport)
  }

  if (quasarConf.build.webpackTranspile === true) {
    const nodeModulesRegex = /[\\/]node_modules[\\/]/
    const exceptionsRegex = getDependenciesRegex(
      [ /\.vue\.js$/, isSsrServer ? 'quasar/src' : 'quasar', '@babel/runtime' ]
        .concat(quasarConf.build.webpackTranspileDependencies)
    )

    chain.module.rule('babel')
      .test(/\.js$/)
      .exclude
      .add(filepath => (
        // Transpile the exceptions:
        exceptionsRegex.test(filepath) === false
          // Don't transpile anything else in node_modules:
          && nodeModulesRegex.test(filepath)
      ))
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        compact: false,
        extends: appPaths.babelConfigFilename
      })
  }

  if (hasTypescript === true) {
    chain.module
      .rule('typescript')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        // custom config is merged if present, but vue setup and type checking disable are always applied
        ...quasarConf.build.tsLoaderOptions,
        appendTsSuffixTo: [ /\.vue$/ ],
        // Type checking is handled by fork-ts-checker-webpack-plugin
        transpileOnly: true
      })

    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
    chain
      .plugin('ts-checker')
      // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options
      .use(ForkTsCheckerWebpackPlugin, [
        // custom config is merged if present, but vue option is always enabled
        merge({}, quasarConf.build.tsCheckerOptions, {
          typescript: {
            extensions: {
              vue: {
                enabled: true,
                compiler: 'vue/compiler-sfc'
              }
            }
          }
        })
      ])
  }

  // TODO: change to Asset Management when webpack-chain is webpack5 compatible
  chain.module.rule('images')
    .test(/\.(png|jpe?g|gif|svg|webp|avif|ico)(\?.*)?$/)
    .type('javascript/auto')
    .use('url-loader')
    .loader('url-loader')
    .options({
      esModule: false,
      limit: 10000,
      name: `img/[name]${ assetHash }.[ext]`
    })

  // TODO: change to Asset Management when webpack-chain is webpack5 compatible
  chain.module.rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/)
    .type('javascript/auto')
    .use('url-loader')
    .loader('url-loader')
    .options({
      esModule: false,
      limit: 10000,
      name: `fonts/[name]${ assetHash }.[ext]`
    })

  // TODO: change to Asset Management when webpack-chain is webpack5 compatible
  chain.module.rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .type('javascript/auto')
    .use('url-loader')
    .loader('url-loader')
    .options({
      esModule: false,
      limit: 10000,
      name: `media/[name]${ assetHash }.[ext]`
    })

  injectStyleRules(chain, {
    appPaths,
    cssVariables: cacheProxy.getModule('cssVariables'),
    isServerBuild: isSsrServer,
    rtl: quasarConf.build.rtl,
    sourceMap: quasarConf.build.sourcemap,
    extract: quasarConf.build.extractCSS,
    minify: quasarConf.build.minify,
    stylusLoaderOptions: quasarConf.build.stylusLoaderOptions,
    sassLoaderOptions: quasarConf.build.sassLoaderOptions,
    scssLoaderOptions: quasarConf.build.scssLoaderOptions,
    lessLoaderOptions: quasarConf.build.lessLoaderOptions
  })

  chain.module // fixes https://github.com/graphql/graphql-js/issues/1272
    .rule('mjs')
    .test(/\.mjs$/)
    .type('javascript/auto')
    .include
    .add(/[\\/]node_modules[\\/]/)

  chain.plugin('vue-loader')
    .use(VueLoaderPlugin, [ quasarConf.build.vueLoaderOptions ])

  chain.plugin('define')
    .use(webpack.DefinePlugin, [
      getBuildSystemDefine({
        buildEnv: quasarConf.build.env,
        buildRawDefine: getRawDefine(quasarConf.build.rawDefine, compileId),
        fileEnv: quasarConf.metaConf.fileEnv
      })
    ])

  chain.optimization
    .nodeEnv(false)

  if (ctx.dev && isSsrServer === false && ctx.mode.pwa) {
    // need to place it here before the status plugin
    const { WorkboxWarningPlugin } = require('./modes/pwa/plugin.webpack.workbox-warning.js')
    chain.plugin('workbox-warning')
      .use(WorkboxWarningPlugin)
  }

  chain.plugin('progress')
    .use(WebpackProgressPlugin, [ { name: threadName, quasarConf } ])

  chain.plugin('boot-default-export')
    .use(BootDefaultExportPlugin)

  chain.performance
    .hints(false)
    .maxAssetSize(500000)

  if (isSsrServer === false && quasarConf.vendor.disable !== true) {
    const { add, remove } = quasarConf.vendor
    const regex = /[\\/]node_modules[\\/]/

    chain.optimization.splitChunks({
      cacheGroups: {
        defaultVendors: {
          name: 'vendor',
          chunks: 'all',
          priority: -10,
          // a module is extracted into the vendor chunk if...
          test: add !== void 0 || remove !== void 0
            ? module => {
              if (module.resource) {
                if (remove !== void 0 && remove.test(module.resource)) { return false }
                if (add !== void 0 && add.test(module.resource)) { return true }
              }
              return regex.test(module.resource)
            }
            : regex
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    })
  }

  // extract css into its own file
  if (isSsrServer === false && quasarConf.build.extractCSS) {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')

    chain.plugin('mini-css-extract')
      .use(MiniCssExtractPlugin, [ {
        filename: `css/[name]${ fileHash }.css`
      } ])
  }

  if (
    (ctx.prod || ctx.mode.bex)
    && isSsrServer === false
    && quasarConf.build.ignorePublicFolder !== true
  ) {
    // copy /public to dist folder
    const CopyWebpackPlugin = require('copy-webpack-plugin')

    const ignore = [
      '**/.DS_Store',
      '**/.Thumbs.db',
      '**/*.sublime*',
      '**/.idea',
      '**/.editorconfig',
      '**/.vscode'
    ]

    // avoid useless files to be copied
    if ([ 'electron', 'cordova', 'capacitor' ].includes(ctx.modeName)) {
      ignore.push(
        '**/public/icons', '**/public/favicon.ico'
      )
    }

    const patterns = [ {
      from: appPaths.resolve.app('public'),
      noErrorOnMissing: true,
      globOptions: { ignore }
    } ]

    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [ { patterns } ])
  }

  if (ctx.prod) {
    chain.optimization
      .concatenateModules(ctx.mode.ssr !== true)

    if (ctx.debug) {
      // reset default webpack 4 minimizer
      chain.optimization.minimizers.delete('js')
      // also:
      chain.optimization.minimize(false)
    }
    else if (quasarConf.build.minify) {
      const TerserPlugin = require('terser-webpack-plugin')

      chain.optimization
        .minimizer('js')
        .use(TerserPlugin, [ {
          terserOptions: quasarConf.build.uglifyOptions,
          extractComments: false,
          parallel: true
        } ])
    }

    if (isSsrServer === false) {
      // dedupe & minify CSS (only if extracted)
      if (quasarConf.build.extractCSS && quasarConf.build.minify) {
        const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

        // We are using this plugin so that possible
        // duplicated CSS = require(different components) can be deduped.
        chain.optimization
          .minimizer('css')
          .use(CssMinimizerPlugin, [ {
            parallel: true
          } ])
      }

      // also produce a gzipped version
      if (quasarConf.build.gzip) {
        const CompressionWebpackPlugin = require('compression-webpack-plugin')
        chain.plugin('compress-webpack')
          .use(CompressionWebpackPlugin, [ quasarConf.build.gzip ])
      }

      if (quasarConf.build.analyze) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        chain.plugin('bundle-analyzer')
          .use(BundleAnalyzerPlugin, [ Object.assign({}, quasarConf.build.analyze) ])
      }
    }
  }

  if (hasTypescript === false) {
    const { hasEslint, EslintWebpackPlugin } = cacheProxy.getModule('eslint')
    if (hasEslint === true && EslintWebpackPlugin !== void 0) {
      const { injectESLintPlugin } = require('./utils/inject-eslint-plugin.js')
      injectESLintPlugin(chain, quasarConf, compileId)
    }
  }

  return chain
}

module.exports.extendWebpackChain = async function extendWebpackChain (webpackChain, quasarConf, invokeParams) {
  const opts = {
    isClient: false,
    isServer: false,
    ...invokeParams
  }

  const { appExt } = quasarConf.ctx

  await appExt.runAppExtensionHook('chainWebpack', async hook => {
    log(`Extension(${ hook.api.extId }): Chaining Webpack config`)
    await hook.fn(webpackChain, invokeParams, hook.api)
  })

  const webpackConf = webpackChain.toConfig()

  if (typeof quasarConf.build.extendWebpack === 'function') {
    quasarConf.build.extendWebpack(webpackConf, opts)
  }

  const promise = appExt.runAppExtensionHook('extendWebpack', async hook => {
    log(`Extension(${ hook.api.extId }): Extending Webpack config`)
    await hook.fn(webpackConf, opts, hook.api)
  })

  if (quasarConf.ctx.dev) {
    webpackConf.optimization = webpackConf.optimization || {}
    webpackConf.optimization.emitOnErrors = false

    webpackConf.infrastructureLogging = Object.assign(
      { colors: true, level: 'warn' },
      webpackConf.infrastructureLogging
    )
  }

  return promise.then(() => webpackConf)
}

module.exports.createNodeEsbuildConfig = async function createNodeEsbuildConfig (quasarConf, { compileId, format }) {
  const {
    ctx: {
      pkg: { appPkg },
      cacheProxy
    }
  } = quasarConf

  const externalsList = cacheProxy.getRuntime('externalEsbuildParam', () => [
    ...cliPkgDependencies,
    ...Object.keys(appPkg.dependencies || {}),
    ...Object.keys(appPkg.devDependencies || {})
  ])

  const cfg = {
    platform: 'node',
    target: quasarConf.build.esbuildTarget.node,
    format,
    bundle: true,
    sourcemap: quasarConf.metaConf.debugging === true ? 'inline' : false,
    minify: quasarConf.build.minify !== false,
    alias: {
      ...quasarConf.build.alias,
      'quasar/wrappers': format === 'esm' ? 'quasar/wrappers/index.mjs' : 'quasar/wrappers/index.js'
    },
    resolveExtensions: [ format === 'esm' ? '.mjs' : '.cjs', '.js', '.mts', '.ts', '.json' ],
    // we use a fresh list since this can be tampered with by the user:
    external: [ ...externalsList ],
    define: getBuildSystemDefine({
      buildEnv: quasarConf.build.env,
      buildRawDefine: quasarConf.build.rawDefine,
      fileEnv: quasarConf.metaConf.fileEnv
    })
  }

  const { hasEslint, ESLint } = cacheProxy.getModule('eslint')
  if (hasEslint === true && ESLint !== void 0) {
    const { warnings, errors } = quasarConf.build.esbuildEslintOptions
    if (warnings === true || errors === true) {
      // import only if actually needed (as it imports app's eslint pkg)
      const { quasarEsbuildESLintPlugin } = require('./plugins/esbuild.eslint.js')
      cfg.plugins = [
        await quasarEsbuildESLintPlugin(quasarConf, compileId)
      ]
    }
  }

  return cfg
}

module.exports.createBrowserEsbuildConfig = async function createBrowserEsbuildConfig (quasarConf, { compileId }) {
  const cfg = {
    platform: 'browser',
    target: quasarConf.build.esbuildTarget.browser,
    format: 'iife',
    bundle: true,
    sourcemap: quasarConf.metaConf.debugging === true ? 'inline' : false,
    minify: quasarConf.build.minify !== false,
    alias: quasarConf.build.alias,
    define: getBuildSystemDefine({
      buildEnv: quasarConf.build.env,
      buildRawDefine: quasarConf.build.rawDefine,
      fileEnv: quasarConf.metaConf.fileEnv
    })
  }

  const { hasEslint, ESLint } = await quasarConf.ctx.cacheProxy.getModule('eslint')
  if (hasEslint === true && ESLint !== void 0) {
    const { warnings, errors } = quasarConf.build.esbuildEslintOptions
    if (warnings === true || errors === true) {
      // import only if actually needed (as it imports app's eslint pkg)
      const { quasarEsbuildESLintPlugin } = require('./plugins/esbuild.eslint.js')
      cfg.plugins = [
        await quasarEsbuildESLintPlugin(quasarConf, compileId)
      ]
    }
  }

  return cfg
}

module.exports.extendEsbuildConfig = function extendEsbuildConfig (esbuildConf, quasarConfTarget, ctx, threadName) {
  const method = `extend${ threadName }Conf`

  // example: quasarConf.ssr.extendSSRWebserverConf
  if (typeof quasarConfTarget[ method ] === 'function') {
    quasarConfTarget[ method ](esbuildConf)
  }

  const promise = ctx.appExt.runAppExtensionHook(method, async hook => {
    log(`Extension(${ hook.api.extId }): Extending "${ threadName }" Esbuild config`)
    await hook.fn(esbuildConf, hook.api)
  })

  return promise.then(() => esbuildConf)
}
