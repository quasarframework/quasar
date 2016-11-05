var
  path = require('path'),
  webpack = require('webpack'),
  utils = require('./utils'),
  platform = require('./platform'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  autoprefixer = require('autoprefixer'),
  projectRoot = path.resolve(__dirname, '../'),
  entry = './dev/main.js',
  plugins = []

if (process.env.NODE_ENV !== 'production') {
  entry = ['./build/hot-reload', entry]
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = {
  devtool: '#eval-source-map',
  entry: {
    app: entry
  },
  output: {
    path: path.resolve(__dirname, '../test/e2e/dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'quasar': path.resolve(__dirname, '../src/index.es6'),
      'assets': path.resolve(__dirname, '../dev/assets'),
      'components': path.resolve(__dirname, '../dev/components')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  plugins: plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      '__THEME': '"' + platform.theme + '"'
    }),
    new webpack.optimize.DedupePlugin(),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'dev/index.html',
      inject: true
    })
  ]),
  module: {
    preLoaders: [
      {
        test: /\.(vue|js)$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [utils.styleLoaders({ sourceMap: true, postcss: true })].concat([
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: 'raw'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ])
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: true, postcss: true })
  },
  postcss: function () {
    return [autoprefixer]
  }
}
