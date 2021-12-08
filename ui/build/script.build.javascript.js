process.env.BABEL_ENV = 'production'

const path = require('path')
const fs = require('fs')
const rollup = require('rollup')
const uglify = require('uglify-es')
const buble = require('@rollup/plugin-buble')
const json = require('@rollup/plugin-json')
const nodeResolve = require('@rollup/plugin-node-resolve').default

const buildConf = require('./build.conf')
const buildUtils = require('./build.utils')

function resolve (_path) {
  return path.resolve(__dirname, '..', _path)
}

const rollupPluginsModern = [
  nodeResolve(),
  json()
]

const rollupPluginsLegacy = [
  ...rollupPluginsModern,
  buble({
    objectAssign: 'Object.assign'
  })
]

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
    build: {
      minified: true,
      minExt: false,
      modern: true
    }
  },
  {
    rollup: {
      input: {
        input: resolve(`src/index.common.js`)
      },
      output: {
        file: resolve(`dist/quasar.common.js`),
        exports: 'auto',
        format: 'cjs'
      }
    },
    build: {
      minified: true,
      minExt: false,
      modern: true
    }
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
    build: {
      minified: true,
      minExt: false
    }
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
    build: {
      minified: true
    }
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
  },
  {
    rollup: {
      input: {
        input: resolve(`src/index.umd.js`)
      },
      output: {
        file: resolve(`dist/quasar.umd.modern.js`),
        format: 'umd'
      }
    },
    build: {
      unminified: true,
      minified: true,
      modern: true
    }
  }
]

function addAssets (builds, type, injectName) {
  const files = fs.readdirSync(resolve(type))

  files
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const name = file.substr(0, file.length - 3).replace(/-([a-z])/g, g => g[1].toUpperCase())
      builds.push({
        rollup: {
          input: {
            input: resolve(`${type}/${file}`)
          },
          output: {
            file: addExtension(resolve(`dist/${type}/${file}`), 'umd'),
            format: 'umd',
            name: `Quasar.${injectName}.${name}`
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
  opts.rollup.input.plugins = opts.build.modern === true
    ? rollupPluginsModern
    : rollupPluginsLegacy

  opts.rollup.input.external = opts.rollup.input.external || []
  opts.rollup.input.external.push('vue')

  opts.rollup.output.banner = buildConf.banner
  opts.rollup.output.name = opts.rollup.output.name || 'Quasar'

  opts.rollup.output.globals = opts.rollup.output.globals || {}
  opts.rollup.output.globals.vue = 'Vue'

  return opts
}

function addExtension (filename, ext = 'min') {
  const insertionPoint = filename.lastIndexOf('.')
  return `${filename.slice(0, insertionPoint)}.${ext}${filename.slice(insertionPoint)}`
}

function injectVueRequirement (code) {
  const index = code.indexOf(`Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue`)

  if (index === -1) {
    return code
  }

  const checkMe = ` if (Vue === void 0) {
    console.error('[ Quasar ] Vue is required to run. Please add a script tag for it before loading Quasar.')
    return
  }
  `

  return code.substring(0, index - 1) +
    checkMe +
    code.substring(index)
}

function buildEntry (config) {
  return rollup
    .rollup(config.rollup.input)
    .then(bundle => bundle.generate(config.rollup.output))
    .then(({ output }) => {
      const code = config.rollup.output.format === 'umd'
        ? injectVueRequirement(output[0].code)
        : output[0].code

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
          ecma: config.build.modern ? 6 : 5
        }
      })

      if (minified.error) {
        return Promise.reject(minified.error)
      }

      return buildUtils.writeFile(
        config.build.minExt !== false
          ? addExtension(config.rollup.output.file)
          : config.rollup.output.file,
        buildConf.banner + minified.code,
        true
      )
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}

module.exports = function () {
  require('./build.lang-index').generate()
    .then(() => require('./build.svg-icon-sets').generate())
    .then(() => require('./build.api').generate())
    .then(data => {
      require('./build.transforms').generate()
      require('./build.vetur').generate(data)
      require('./build.types').generate(data)
      require('./build.web-types').generate(data)

      addAssets(builds, 'lang', 'lang')
      addAssets(builds, 'icon-set', 'iconSet')
      build(builds)
    })
}
