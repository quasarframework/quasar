var
  path = require('path'),
  webpack = require('webpack'),
  cssUtils = require('./css-utils'),
  env = require('./env-utils'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  projectRoot = path.resolve(__dirname, '../'),
  entry = ['./build/hot-reload', './src/ie-compat/ie.js', './dev/main.js'],
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'),
  merge = require('webpack-merge'),
  rtl = process.env.QUASAR_RTL !== void 0

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  entry: {
    app: entry
  },
  output: {
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: [`.${env.platform.theme}.js`, '.js', `.${env.platform.theme}.vue`, '.vue'],
    modules: [
      resolve('src'),
      'node_modules'
    ],
    alias: {
      quasar: resolve(`src/index.esm`),
      'quasar-css': resolve(`src/css/${env.platform.theme}.styl`),
      assets: resolve('dev/assets'),
      components: resolve('dev/components'),
      data: resolve('dev/data'),
      variables: resolve(`src/css/core.variables.styl`)
    }
  },
  module: {
    rules: [
      { // eslint
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        include: projectRoot,
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: projectRoot,
        options: {
          postcss: merge(cssUtils.postCSSrc, {
            useConfigFile: false,
            options: {
              sourceMap: true
            },
            plugins: rtl
              ? [
                require('postcss-rtl')()
              ]
              : []
          }),
          cssSourceMap: true,
          loaders: cssUtils.cssLoaders(),
          transformToRequire: {
            video: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ].concat(cssUtils.styleLoaders({ rtl, postCSS: true }))
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      '__THEME__': JSON.stringify(env.platform.theme)
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'dev/index.html',
      inject: true,

      // custom
      rtl
    }),
    new ProgressBarPlugin({
      format: ' [:bar] ' + ':percent'.bold + ' (:msg)'
    }),
    new FriendlyErrorsPlugin({
      clearConsole: true
    })
  ],
  performance: {
    hints: false
  }
}
