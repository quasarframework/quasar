var
  webpack = require('webpack'),
  path = require('path'),
  merge = require('webpack-merge'),
  cssUtils = require('./css-utils'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  WebpackCleanupPlugin = require('webpack-cleanup-plugin'),
  VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
  // ExtractTextPlugin = require('extract-text-webpack-plugin')

const projectRoot = path.resolve(__dirname, '../')

module.exports = {
  // eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  watch: true,
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  entry: {
    app: [
      path.resolve(__dirname, '../build/hot-reload.js'),
      path.resolve(__dirname, '../dev', 'main.js')
    ]
  },
  module: {
    rules: cssUtils.styleRules({
      sourceMap: false,
      postcss: true,
      extract: false
    }).concat([
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
  output: {
    path: path.resolve(__dirname, '../tmp'),
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      'DEV': true,
      'PROD': false,
      '__THEME': '"mat"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      options: {
        context: path.resolve(__dirname, '../dev'),
        postcss: cssUtils.postcss
      }
    }),
    new ProgressBarPlugin({
      format: ' [:bar] ' + ':percent'.bold + ' (:msg)'
    }),
    new WebpackCleanupPlugin({
      exclude: ["index.html"],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // new ExtractTextPlugin({
    //   filename: '[name].[contenthash].css'
    // }),
    new VueSSRClientPlugin(),
    new FriendlyErrorsPlugin({
      clearConsole: true
    })
  ].concat(
    !process.env.dismissHTML ? 
      [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: path.resolve(__dirname, '../dev/index.html'),
          inject: true
        })
      ] : []
  ),
  performance: {
    hints: false
  }
}