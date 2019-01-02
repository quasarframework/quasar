process.env.BABEL_ENV = 'production'

const
  path = require('path'),
  fs = require('fs'),
  rollup = require('rollup'),
  uglify = require('uglify-es'),
  buble = require('rollup-plugin-buble'),
  json = require('rollup-plugin-json'),
  nodeResolve = require('rollup-plugin-node-resolve'),
  buildConf = require('./build.conf'),
  buildUtils = require('./build.utils'),
  bubleConfig = {
    objectAssign: 'Object.assign'
  }

const builds = [
  {
    rollup: {
      input: {
        input: resolve(`src/index.esm.js`)
      },
      output: {
        file: resolve(`dist/quasar.esm.js`),
        format: 'es'
      }
    },
    build: { minified: true, minExt: false }
  },
  {
    rollup: {
      input: {
        input: resolve('src/ie-compat/ie.js')
      },
      output: {
        file: resolve('dist/quasar.ie.polyfills.js'),
        format: 'es'
      }
    },
    build: { minified: true, minExt: false }
  },
  {
    rollup: {
      input: {
        input: resolve('src/ie-compat/ie.js')
      },
      output: {
        file: resolve('dist/quasar.ie.polyfills.umd.js'),
        format: 'umd'
      }
    },
    build: { minified: true }
  },
  {
    rollup: {
      input: {
        input: resolve(`src/index.umd.js`)
      },
      output: {
        file: resolve(`dist/quasar.umd.js`),
        format: 'umd'
      }
    },
    build: {
      unminified: true,
      minified: true
    }
  }
]

addAssets(builds, 'lang')
addAssets(builds, 'icons')

require('./build.transforms').generate()

build(builds).then(() => {
  require('./build.lang-index').generate()
  require('./build.vetur').generate()
  require('./build.api').generate()
})

/**
 * Helpers
 */

function resolve (_path) {
  return path.resolve(__dirname, '..', _path)
}

function addAssets (builds, type) {
  const
    files = fs.readdirSync(resolve(type)),
    plugins = [ buble(bubleConfig) ]

  files
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const name = file.substr(0, file.length - 3).replace(/-([a-z])/g, g => g[1].toUpperCase())
      builds.push({
        rollup: {
          input: {
            input: resolve(`${type}/${file}`),
            plugins
          },
          output: {
            file: addExtension(resolve(`dist/${type}/${file}`), 'umd'),
            format: 'umd',
            name: `Quasar.${type}.${name}`
          }
        },
        build: {
          minified: true
        }
      })
    })
}

function build (builds) {
  return Promise
    .all(builds.map(genConfig).map(buildEntry))
    .catch(buildUtils.logError)
}

function genConfig (opts) {
  const plugins = opts.rollup.input.plugins || [
    nodeResolve({
      extensions: ['.js'],
      preferBuiltins: false
    }),
    json(),
    buble(bubleConfig)
  ]

  opts.rollup.input.plugins = plugins
  opts.rollup.output.banner = buildConf.banner
  opts.rollup.output.name = opts.rollup.output.name || 'Quasar'

  opts.rollup.input.external = opts.rollup.input.external || []
  opts.rollup.input.external.push('vue')

  opts.rollup.output.globals = opts.rollup.output.globals || {}
  opts.rollup.output.globals.vue = 'Vue'

  return opts
}

function addExtension (filename, ext = 'min') {
  const insertionPoint = filename.lastIndexOf('.')
  return `${filename.slice(0, insertionPoint)}.${ext}${filename.slice(insertionPoint)}`
}

function buildEntry (config) {
  return rollup
    .rollup(config.rollup.input)
    .then(bundle => bundle.generate(config.rollup.output))
    .then(({ code }) => {
      return config.build.unminified
        ? buildUtils.writeFile(config.rollup.output.file, code)
        : code
    })
    .then(code => {
      if (!config.build.minified) {
        return code
      }

      const minified = uglify.minify(code, {
        compress: {
          pure_funcs: ['makeMap']
        }
      })

      if (minified.error) {
        return new Promise((resolve, reject) => reject(minified.error))
      }

      return buildUtils.writeFile(
        config.build.minExt !== false
          ? addExtension(config.rollup.output.file)
          : config.rollup.output.file,
        buildConf.banner + minified.code,
        true
      )
    })
}
