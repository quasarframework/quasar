process.env.BABEL_ENV = 'production'

var
  fs = require('fs'),
  path = require('path'),
  zlib = require('zlib'),
  rollup = require('rollup'),
  uglify = require('uglify-js'),
  buble = require('rollup-plugin-buble'),
  cjs = require('rollup-plugin-commonjs'),
  json = require('rollup-plugin-json'),
  vue = require('rollup-plugin-vue'),
  localResolve = require('rollup-plugin-local-resolve'),
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
  }

function resolve (_path) {
  return path.resolve(__dirname, '..', _path)
}

build([
  {
    dest: resolve('dist/quasar.esm.js'),
    format: 'es'
  }
].map(genConfig))

function build (builds) {
  var
    built = 0,
    total = builds.length

  function next () {
    buildEntry(builds[built]).then(function () {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

function genConfig (opts) {
  return {
    entry: resolve('src/index.esm.js'),
    dest: opts.dest,
    format: opts.format,
    banner: banner,
    moduleName: 'Quasar',
    plugins: [
      localResolve(),
      json(),
      vue(vueConfig),
      buble()
    ]
  }
}

function buildEntry (config) {
  const isProd = /min\.js$/.test(config.dest)
  return rollup.rollup(config).then(bundle => {
    const code = bundle.generate(config).code

    if (isProd) {
      var minified = (config.banner ? config.banner + '\n' : '') + uglify.minify(code, {
        fromString: true,
        output: {
          screw_ie8: true,
          ascii_only: true
        },
        compress: {
          pure_funcs: ['makeMap']
        }
      }).code
      return write(config.dest, minified, true)
    }

    return write(config.dest, code)
  })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log((path.relative(process.cwd(), dest)).bold + ' ' + getSize(code).gray + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      }
      else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}
