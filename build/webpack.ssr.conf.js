var 
  webpack = require('webpack'),
  env = require('./env-utils'),
  merge = require('webpack-merge'),
  cssUtils = require('./css-utils'),
  { cloneDeep } = require('lodash'),
  VueSSRServerPlugin = require('vue-server-renderer/server-plugin'),
  nodeExternals = require('webpack-node-externals'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  path = require('path'),
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const projectRoot = path.resolve(__dirname, '../')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  target: 'node',
  watch: true,
  devtool: env.prod
    ? false
    : 'source-map',
  entry: {
    app: path.resolve(__dirname, '../dev', 'server-entry.js')
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '../tmp'),
    publicPath: '/',
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
      data: resolve('dev/data')
    }
  },
  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // Externalize app dependencies. This makes the server build much faster
  // and generates a smaller bundle file.
  // externals: nodeExternals({
  //   // do not externalize dependencies that need to be processed by webpack.
  //   // you can add more file types here e.g. raw *.vue files
  //   // you should also whitelist deps that modifies `global` (e.g. polyfills)
  //   whitelist: /(\.css$|\.less$|\.sass$|\.scss$|\.styl$|\.stylus$|\.(png|jpe?g|gif|svg)(\?.*)?$|\.(woff2?|eot|ttf|otf)(\?.*)?$)/
  // }),
  module: {
    rules: cssUtils.styleRules({
      sourceMap: false,
      extract: false,
      postcss: true
    }).concat([
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: cssUtils.postcss,
          loaders: merge({js: 'babel-loader'}, cssUtils.styleLoaders({
            sourceMap: false,
            extract: false
          }))
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
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
    ])
  },
  plugins: [
    new VueSSRServerPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      '__THEME__': JSON.stringify(env.platform.theme)
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      options: {
        context: resolve('dev'),
        postcss: cssUtils.postcss
      }
    }),
    // new ExtractTextPlugin({
    //   filename: '[name].[contenthash].css'
    // }),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
      clearConsole: true
    })
  ],
  performance: {
    hints: false
  }
}