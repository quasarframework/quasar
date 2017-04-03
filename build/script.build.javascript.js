process.env.BABEL_ENV = 'production'

var
  fs = require('fs'),
  zlib = require('zlib'),
  rollup = require('rollup'),
  uglify = require('uglify-js'),
  babel = require('rollup-plugin-babel'),
  json = require('rollup-plugin-json'),
  vue = require('rollup-plugin-vue'),
  localResolve = require('rollup-plugin-local-resolve'),
  nonStandalone = process.argv[2] === 'simple' || process.argv[3] === 'simple',
  version = process.env.VERSION || require('../package.json').version,
  banner =
    '/*!\n' +
    ' * Quasar Framework v' + version + '\n' +
    ' * (c) 2016-present Razvan Stoenescu\n' +
    ' * Released under the MIT License.\n' +
    ' */',
  vueConfig = {
    compileTemplate: true,
    htmlMinifier: {collapseBooleanAttributes: false}
  },
  babelConfig = {
    exclude: 'node_modules/**'
  },
  external = [
    'fastclick'
  ],
  globals = {
    fastclick: 'FastClick'
  },
  rollupConfig = {
    entry: 'src/index.esm.js',
    plugins: [
      localResolve(),
      json(),
      vue(vueConfig),
      babel(babelConfig)
    ],
    external: external
  }

// ESM build.
rollup
.rollup({
  entry: 'src/index.esm.js',
  plugins: rollupConfig.plugins,
  external: external
})
.then(function (bundle) {
  return write('dist/quasar.esm.js', bundle.generate({
    format: 'es',
    exports: 'named',
    banner: banner,
    globals: globals,
    useStrict: false
  }).code)
})
// Commonjs Build
.then(function () {
  if (nonStandalone) {
    return
  }
  return rollup
  .rollup(rollupConfig)
  .then(function (bundle) {
    write('dist/quasar.common.js', bundle.generate({
      format: 'cjs',
      exports: 'named',
      banner: banner,
      globals: globals,
      useStrict: false
    }).code)
  })
})
// Standalone Dev Build
.then(function () {
  if (nonStandalone) {
    return
  }
  return rollup
  .rollup(rollupConfig)
  .then(function (bundle) {
    return write('dist/quasar.standalone.js', bundle.generate({
      format: 'umd',
      banner: banner,
      moduleName: 'Quasar',
      globals: globals,
      useStrict: false
    }).code)
  })
})
// Standalone Production Build
.then(function () {
  if (nonStandalone) {
    return
  }
  return rollup
  .rollup(rollupConfig)
  .then(function (bundle) {
    var code, res, map

    code = bundle.generate({
      format: 'umd',
      moduleName: 'Quasar',
      banner: banner,
      globals: globals,
      useStrict: false
    }).code

    res = uglify.minify(code, {
      fromString: true,
      outSourceMap: 'quasar.standalone.min.js.map',
      output: {
        preamble: banner,
        ascii_only: true
      }
    })

    // fix uglifyjs sourcemap
    map = JSON.parse(res.map)
    map.sources = ['quasar.standalone.js']
    map.sourcesContent = [code]
    map.file = 'quasar.standalone.min.js'

    return [
      write('dist/quasar.standalone.min.js', res.code),
      write('dist/quasar.standalone.min.js.map', JSON.stringify(map))
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
    fs.readFile('dist/quasar.standalone.min.js', function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write('dist/quasar.standalone.min.js.gz', buf).then(resolve)
      })
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}
