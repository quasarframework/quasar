const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const WebpackChain = require('webpack-chain')
const { VueLoaderPlugin } = require('vue-loader')

const WebpackProgressPlugin = require('./plugin.progress')
const BootDefaultExport = require('./plugin.boot-default-export')
const parseBuildEnv = require('../helpers/parse-build-env')

const appPaths = require('../app-paths')
const injectStyleRules = require('./inject.style-rules')
const { webpackNames } = require('./symbols')

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

function getRootDefines (rootDefines, configName) {
  if (configName === webpackNames.ssr.serverSide) {
    return { ...rootDefines, __QUASAR_SSR_SERVER__: true }
  }

  if (configName === webpackNames.ssr.clientSide) {
    return { ...rootDefines, __QUASAR_SSR_CLIENT__: true }
  }

  return rootDefines
}

module.exports = function (cfg, configName) {
  const chain = new WebpackChain()

  const needsHash = !cfg.ctx.dev && !['electron', 'cordova', 'capacitor', 'bex'].includes(cfg.ctx.modeName)
  const fileHash = needsHash ? '.[contenthash:8]' : ''
  const chunkHash = needsHash ? '.[chunkhash:8]' : ''
  const resolveModules = [
    'node_modules',
    appPaths.resolve.app('node_modules'),
    appPaths.resolve.cli('node_modules')
  ]

  chain.entry('app').add(appPaths.resolve.app('.quasar/client-entry.js'))
  chain.mode(cfg.ctx.dev ? 'development' : 'production')
  chain.devtool(cfg.build.sourceMap ? cfg.build.devtool : false)

  if (cfg.ctx.prod || cfg.ctx.mode.ssr) {
    chain.output
      .path(
        cfg.ctx.mode.ssr
          ? path.join(cfg.build.distDir, 'www')
          : cfg.build.distDir
      )
      .publicPath(cfg.build.publicPath)
      .filename(`js/[name]${fileHash}.js`)
      .chunkFilename(`js/[name]${chunkHash}.js`)
  }

  chain.resolve.extensions
    .merge(
      cfg.supportTS !== false
        ? [ '.mjs', '.ts', '.js', '.vue', '.json', '.wasm' ]
        : [ '.mjs', '.js', '.vue', '.json', '.wasm' ]
    )

  chain.resolve.modules
    .merge(resolveModules)

  chain.resolve.alias
    .merge({
      src: appPaths.srcDir,
      app: appPaths.appDir,
      components: appPaths.resolve.src(`components`),
      layouts: appPaths.resolve.src(`layouts`),
      pages: appPaths.resolve.src(`pages`),
      assets: appPaths.resolve.src(`assets`),
      boot: appPaths.resolve.src(`boot`),

      'src-bex': appPaths.bexDir // needed for app/templates
    })

  const vueFile = configName === webpackNames.ssr.serverSide
    ? (cfg.ctx.prod ? 'vue.cjs.prod.js' : 'vue.cjs.js')
    : (
      cfg.build.vueCompiler
        ? 'vue.esm-bundler.js'
        : 'vue.runtime.esm-bundler.js'
    )

  chain.resolve.alias.set('vue$', 'vue/dist/' + vueFile)

  const vueI18nFile = configName === webpackNames.ssr.serverSide
    ? (cfg.ctx.prod ? 'vue-i18n.cjs.prod.js' : 'vue-i18n.cjs.js')
    : 'vue-i18n.esm-bundler.js'

  chain.resolve.alias.set('vue-i18n$', 'vue-i18n/dist/' + vueI18nFile)

  chain.resolveLoader.modules
    .merge(resolveModules)

  chain.module.noParse(
    /^(vue|vue-router|vuex|vuex-router-sync|@quasar[\\/]extras|quasar[\\/]dist)$/
  )

  const vueRule = chain.module.rule('vue')
    .test(/\.vue$/)

  vueRule.use('vue-auto-import-quasar')
    .loader(path.join(__dirname, 'loader.vue.auto-import-quasar.js'))
    .options({
      autoImportComponentCase: cfg.framework.autoImportComponentCase,
      isServerBuild: configName === webpackNames.ssr.serverSide
    })

  vueRule.use('vue-loader')
    .loader('vue-loader')
    .options(
      merge(
        {},
        cfg.build.vueLoaderOptions,
        {
          isServerBuild: configName === webpackNames.ssr.serverSide,
          compilerOptions: configName === webpackNames.ssr.serverSide
            ? { directiveTransforms: cfg.ssr.directiveTransforms, ssr: true }
            : {}
        }
      )
    )

  if (configName !== webpackNames.ssr.serverSide) {
    chain.module.rule('js-transform-quasar-imports')
      .test(/\.(t|j)sx?$/)
      .use('transform-quasar-imports')
        .loader(path.join(__dirname, 'loader.js.transform-quasar-imports.js'))
  }

  if (cfg.build.transpile === true) {
    const nodeModulesRegex = /[\\/]node_modules[\\/]/
    const exceptionsRegex = getDependenciesRegex(
      [ /\.vue\.js$/, configName === webpackNames.ssr.serverSide ? 'quasar/src' : 'quasar', '@babel/runtime' ]
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
    chain.module
      .rule('typescript')
      .test(/\.ts$/)
      .use('ts-loader')
        .loader('ts-loader')
        .options({
          // custom config is merged if present, but vue setup and type checking disable are always applied
          ...(cfg.supportTS.tsLoaderConfig || {}),
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
        merge({}, cfg.supportTS.tsCheckerConfig || {}, {
          typescript: {
            extensions: {
              vue: {
                enabled: true,
                compiler: '@vue/compiler-sfc'
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
        name: `img/[name]${fileHash}.[ext]`
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
        name: `fonts/[name]${fileHash}.[ext]`
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
        name: `media/[name]${fileHash}.[ext]`
      })

  injectStyleRules(chain, {
    isServerBuild: configName === webpackNames.ssr.serverSide,
    rtl: cfg.build.rtl,
    sourceMap: cfg.build.sourceMap,
    extract: cfg.build.extractCSS,
    minify: cfg.build.minify,
    stylusLoaderOptions: cfg.build.stylusLoaderOptions,
    sassLoaderOptions: cfg.build.sassLoaderOptions,
    scssLoaderOptions: cfg.build.scssLoaderOptions,
    lessLoaderOptions: cfg.build.lessLoaderOptions
  })

  chain.module // fixes https://github.com/graphql/graphql-js/issues/1272
    .rule('mjs')
    .test(/\.mjs$/)
    .type('javascript/auto')
    .include
      .add(/[\\/]node_modules[\\/]/)

  chain.plugin('vue-loader')
    .use(VueLoaderPlugin)

  chain.plugin('define')
    .use(webpack.DefinePlugin, [
      parseBuildEnv(cfg.build.env, getRootDefines(cfg.__rootDefines, configName))
    ])

  chain.optimization
    .nodeEnv(false)

  if (cfg.ctx.dev && configName !== webpackNames.ssr.serverSide && cfg.ctx.mode.pwa && cfg.pwa.workboxPluginMode === 'InjectManifest') {
    // need to place it here before the status plugin
    const CustomSwWarningPlugin = require('./pwa/plugin.custom-sw-warning')
    chain.plugin('custom-sw-warning')
      .use(CustomSwWarningPlugin)
  }

  chain.plugin('progress')
    .use(WebpackProgressPlugin, [{ name: configName, cfg }])

  chain.plugin('boot-default-export')
    .use(BootDefaultExport)

  chain.performance
    .hints(false)
    .maxAssetSize(500000)

  if (configName !== webpackNames.ssr.serverSide && cfg.vendor.disable !== true) {
    const { add, remove } = cfg.vendor
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
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'all',
          reuseExistingChunk: true
        }
      }
    })
  }

  // extract css into its own file
  if (configName !== webpackNames.ssr.serverSide && cfg.build.extractCSS) {
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')

    chain.plugin('mini-css-extract')
      .use(MiniCssExtractPlugin, [{
        filename: `css/[name]${fileHash}.css`
      }])
  }

  if (cfg.ctx.prod) {
    if (
      cfg.build.ignorePublicFolder !== true &&
      configName !== webpackNames.ssr.serverSide
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
      if (['electron', 'cordova', 'capacitor'].includes(cfg.ctx.modeName)) {
        ignore.push(
          '**/public/icons', '**/public/favicon.ico'
        )
      }

      const patterns = [{
        from: appPaths.resolve.app('public'),
        noErrorOnMissing: true,
        globOptions: { ignore }
      }]

      chain.plugin('copy-webpack')
        .use(CopyWebpackPlugin, [{ patterns }])
    }

    chain.optimization
      .concatenateModules(cfg.ctx.mode.ssr !== true)

    if (cfg.ctx.debug) {
      // reset default webpack 4 minimizer
      chain.optimization.minimizers.delete('js')
      // also:
      chain.optimization.minimize(false)
    }
    else if (cfg.build.minify) {
      const TerserPlugin = require('terser-webpack-plugin')

      chain.optimization
        .minimizer('js')
        .use(TerserPlugin, [{
          terserOptions: cfg.build.uglifyOptions,
          extractComments: false,
          parallel: true
        }])
    }

    if (configName !== webpackNames.ssr.serverSide) {
      // dedupe & minify CSS (only if extracted)
      if (cfg.build.extractCSS && cfg.build.minify) {
        const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

        // We are using this plugin so that possible
        // duplicated CSS = require(different components) can be deduped.
        chain.optimization
          .minimizer('css')
          .use(CssMinimizerPlugin, [{
            parallel: true
          }])
      }

      // also produce a gzipped version
      if (cfg.build.gzip) {
        const CompressionWebpackPlugin = require('compression-webpack-plugin')
        chain.plugin('compress-webpack')
          .use(CompressionWebpackPlugin, [ cfg.build.gzip ])
      }

      if (cfg.build.analyze) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        chain.plugin('bundle-analyzer')
          .use(BundleAnalyzerPlugin, [ Object.assign({}, cfg.build.analyze) ])
      }
    }
  }

  return chain
}
