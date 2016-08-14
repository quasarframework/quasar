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
      }
    })
  ],
  devServer: {
    contentBase: './test/unit',
    noInfo: true
  },
  devtool: 'source-map'
}
