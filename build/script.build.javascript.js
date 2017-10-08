process.env.BABEL_ENV = 'production'

const
  fs = require('fs'),
  path = require('path'),
  zlib = require('zlib'),
  rollup = require('rollup'),
  uglify = require('uglify-js'),
  buble = require('rollup-plugin-buble'),
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
    input: resolve('src/index.esm.js'),
    output: resolve('dist/quasar.esm.js'),
    format: 'es'
  },
  {
    input: resolve('src/ie-compat/ie.js'),
    output: resolve('dist/quasar.ie.js'),
    format: 'es'
  },
  {
    input: resolve('src/index.umd.js'),
    output: resolve('dist/quasar.umd.js'),
    format: 'umd'
  },
  {
    input: resolve('src/ie-compat/ie.js'),
    output: resolve('dist/quasar.ie.umd.js'),
    format: 'umd'
  }
])

function build (builds) {
  Promise.all(builds.map(genConfig).map(buildEntry)).catch(function (e) {
    console.log(e)
  })
}

function genConfig (opts) {
  Object.assign(opts, {
    banner: banner,
    name: 'Quasar',
    plugins: [
      localResolve(),
      json(),
      vue(vueConfig),
      buble()
    ]
  })

  if (opts.format === 'umd') {
    opts.globals = {vue: 'Vue'}
    opts.external = ['vue']
  }

  return opts
}

function addMinExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return `${filename.slice(0, insertionPoint)}.min${filename.slice(insertionPoint)}`
}

function buildEntry (config) {
  return rollup
    .rollup(config)
    .then(bundle => bundle.generate(config))
    .then(({ code }) => {
      return write(config.output, code)
    })
    .then(({ code }) => {
      if (config.format !== 'umd') {
        return new Promise((resolve) => resolve)
      }

      const minified = uglify.minify(code, {
        compress: {
          pure_funcs: ['makeMap']
        }
      })

      if (minified.error) {
        return new Promise((resolve, reject) => reject(minified.error))
      }

      return write(
        addMinExtension(config.output),
        (config.banner ? config.banner + '\n' : '') + minified.code,
        true
      )
    })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log((path.relative(process.cwd(), dest)).bold + ' ' + getSize(code).gray + (extra || ''))
      resolve({ code })
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
