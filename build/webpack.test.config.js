var
  path = require('path'),
  webpack = require('webpack')

module.exports = {
  entry: './test/unit/index.js',
  output: {
    path: path.resolve(__dirname, '../test/unit'),
    filename: 'specs.js'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, '../src')
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'isparta',
        include: path.resolve(__dirname, '../src')
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        // NOTE: use absolute path to make sure
        // running tests is OK even if it is in node_modules of other project
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
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
    ]
  },
  vue: {
    loaders: {
      js: 'isparta'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      '__THEME': '"mat"'
    })
  ],
  devServer: {
    contentBase: './test/unit',
    noInfo: true
  },
  devtool: 'source-map'
}
