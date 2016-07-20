process.env.BABEL_ENV = 'production'

var
  fs = require('fs'),
  path = require('path'),
  zlib = require('zlib'),
  shell = require('shelljs'),
  rollup = require('rollup'),
  uglify = require('uglify-js'),
  babel = require('rollup-plugin-babel'),
  replace = require('rollup-plugin-replace'),
  string = require('rollup-plugin-string'),
  vue = require('rollup-plugin-vue'),
  version = process.env.VERSION || require('../package.json').version,
  file,
  banner =
    '/*!\n' +
    ' * Quasar Framework v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Razvan Stoenescu\n' +
    ' * Released under the MIT License.\n' +
    ' */',
  babelConfig = {
    exclude: 'node_modules/**'
  },
  stringConfig = {
    include: ['**/*.svg', '**/*.html']
  },
  external = [
    'jquery',
    'fastclick',
    'hammerjs'
  ],
  globals = {
    jquery: '$',
    fastclick: 'FastClick',
    hammerjs: 'Hammer'
  }

require('colors')
require('./script.clean.js')
shell.mkdir('-p', path.join(__dirname, '../dist/'))

file = fs
  .readFileSync('src/index.js', 'utf-8')
  .replace(/version: '[\d\.]+'/, "version: '" + version + "'")
fs.writeFileSync('src/index.js', file)

// CommonJS build.
// this is used as the "main" field in package.json
// and used by bundlers like Webpack and Browserify.
rollup.rollup({
  entry: 'src/index.js',
  plugins: [vue(), string(stringConfig), babel(babelConfig)],
  external: external
})
.then(function (bundle) {
  return write('dist/quasar.common.js', bundle.generate({
    format: 'cjs',
    banner: banner,
    globals: globals
  }).code)
})
// Standalone Dev Build
.then(function () {
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      replace({
        'process.env.NODE_ENV': "'development'"
      }),
      vue(),
      string(stringConfig),
      babel(babelConfig)
    ],
    external: external
  })
  .then(function (bundle) {
    return write('dist/quasar.js', bundle.generate({
      format: 'umd',
      banner: banner,
      moduleName: 'Quasar',
      globals: globals
    }).code)
  })
})
.then(function () {
  // Standalone Production Build
  return rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      replace({
        'process.env.NODE_ENV': "'production'"
      }),
      vue(),
      string(stringConfig),
      babel(babelConfig)
    ],
    external: external
  })
  .then(function (bundle) {
    var code, res, map

    code = bundle.generate({
      format: 'umd',
      moduleName: 'Quasar',
      banner: banner,
      globals: globals
    }).code

    res = uglify.minify(code, {
      fromString: true,
      outSourceMap: 'quasar.min.js.map',
      output: {
        preamble: banner,
        ascii_only: true
      }
    })

    // fix uglifyjs sourcemap
    map = JSON.parse(res.map)
    map.sources = ['quasar.js']
    map.sourcesContent = [code]
    map.file = 'quasar.min.js'

    return [
      write('dist/quasar.min.js', res.code),
      write('dist/quasar.min.js.map', JSON.stringify(map))
    ]
  })
  .then(zip)
})
.catch(function (e) {
  console.log(e)
})

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log(dest.bold + ' ' + getSize(code).gray)
      resolve()
    })
  })
}

function zip () {
  return new Promise(function (resolve, reject) {
    fs.readFile('dist/quasar.min.js', function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write('dist/quasar.min.js.gz', buf).then(resolve)
      })
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}
