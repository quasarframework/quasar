process.env.BABEL_ENV = 'production'

const path = require('path')
const fs = require('fs')
const rollup = require('rollup')
const uglify = require('uglify-es')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
// const typescript = require('rollup-plugin-typescript2')
const replace = require('@rollup/plugin-replace')

const { version } = require('../package.json')

const buildConf = require('./build.conf')
const buildUtils = require('./build.utils')

function resolve (_path) {
  return path.resolve(__dirname, '..', _path)
}

// const tsConfig = {
//   tsconfigOverride: {
//     compilerOptions: {
//       sourceMap: true
//     },
//     include: ['./src/**/*.ts']
//   }
// }

const rollupPluginsModern = [
  // typescript(tsConfig),
  nodeResolve()
]

const uglifyJsOptions = {
  compress: {
    // turn off flags with small gains to speed up minification
    arrows: false,
    collapse_vars: false,
    comparisons: false,
    computed_props: false,
    hoist_funs: false,
    hoist_props: false,
    hoist_vars: false,
    inline: false,
    loops: false,
    negate_iife: false,
    properties: false,
    reduce_funcs: false,
    reduce_vars: false,
    switches: false,
    toplevel: false,
    typeofs: false,

    // a few flags with noticable gains/speed ratio
    booleans: true,
    if_return: true,
    sequences: true,
    unused: true,

    // required features to drop conditional branches
    conditionals: true,
    dead_code: true,
    evaluate: true
  },
  mangle: {
    safari10: true
  }
}

const builds = [
  { // Generic prod entry (client-side only; NOT used by Quasar CLI)
    rollup: {
      input: {
        input: resolve('src/index.all.js')
      },
      output: {
        file: resolve('dist/quasar.esm.js'),
        format: 'es'
      }
    },
    build: {
      minified: true,
      replace: {
        __QUASAR_VERSION__: `'${ version }'`,
        __QUASAR_SSR__: false,
        __QUASAR_SSR_SERVER__: false,
        __QUASAR_SSR_CLIENT__: false,
        __QUASAR_SSR_PWA__: false
      }
    }
  },
  { // SSR server prod entry
    rollup: {
      input: {
        input: resolve('src/index.all.js')
      },
      output: {
        file: resolve('dist/quasar.cjs.js'),
        format: 'cjs'
      }
    },
    build: {
      minified: true,
      replace: {
        __QUASAR_VERSION__: `'${ version }'`,
        __QUASAR_SSR__: true,
        __QUASAR_SSR_SERVER__: true,
        __QUASAR_SSR_CLIENT__: false,
        __QUASAR_SSR_PWA__: false
      }
    }
  },
  { // UMD entry
    rollup: {
      input: {
        input: resolve('src/index.umd.js')
      },
      output: {
        file: resolve('dist/quasar.umd.js'),
        format: 'umd'
      }
    },
    build: {
      unminified: true,
      minified: true,
      replace: {
        __QUASAR_VERSION__: `'${ version }'`,
        __QUASAR_SSR__: false,
        __QUASAR_SSR_SERVER__: false,
        __QUASAR_SSR_CLIENT__: false,
        __QUASAR_SSR_PWA__: false
      }
    }
  }
]

function addUmdAssets (builds, type, injectName) {
  const files = fs.readdirSync(resolve(type))

  files
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const name = file
        .substr(0, file.length - 3)
        .replace(/-([a-zA-Z])/g, g => g[ 1 ].toUpperCase())

      builds.push({
        rollup: {
          input: {
            input: resolve(`${ type }/${ file }`)
          },
          output: {
            file: addExtension(resolve(`dist/${ type }/${ file }`), 'umd'),
            format: 'umd',
            name: `Quasar.${ injectName }.${ name }`
          }
        },
        build: {
          minified: true
        }
      })
    })
}

function addSsrDirectives (builds) {
  const files = fs.readdirSync(resolve('src/directives'))
  const acc = []

  files
    .filter(file => file.endsWith('.js') && file.endsWith('.ssr.js') === false)
    .forEach(file => {
      const name = file.substr(0, file.length - 3)
      const ssrFile = resolve(`src/directives/${ file.replace('.js', '.ssr.js') }`)

      if (fs.existsSync(ssrFile)) {
        acc.push(`  '${ buildUtils.kebabCase(name) }': require('./${ name }.js')`)

        builds.push({
          rollup: {
            input: {
              input: ssrFile
            },
            output: {
              file: resolve(`dist/ssr-directives/${ name }.js`),
              format: 'cjs',
              exports: 'auto',
              name: false
            }
          },
          build: {
            unminified: true
          }
        })
      }
      else {
        acc.push(`  '${ buildUtils.kebabCase(name) }': noopTransform`)
      }
    })

  buildUtils.writeFile(
    resolve('dist/ssr-directives/index.js'),
    'const noopTransform = () => ({ props: [] })\nmodule.exports = {\n' + acc.join(',\n') + '\n}\n'
  )
}

function build (builds) {
  return Promise
    .all(builds.map(genConfig).map(buildEntry))
    .catch(buildUtils.logError)
}

function genConfig (opts) {
  opts.rollup.input.plugins = [ ...rollupPluginsModern ]

  if (opts.build.replace !== void 0) {
    opts.rollup.input.plugins.unshift(
      replace({
        preventAssignment: true,
        values: opts.build.replace
      })
    )
  }

  opts.rollup.input.external = opts.rollup.input.external || []
  opts.rollup.input.external.push('vue', '@vue/compiler-dom')

  opts.rollup.output.banner = buildConf.banner

  if (opts.rollup.output.name !== false) {
    opts.rollup.output.name = opts.rollup.output.name || 'Quasar'
  }
  else {
    delete opts.rollup.output.name
  }

  opts.rollup.output.globals = opts.rollup.output.globals || {}
  opts.rollup.output.globals.vue = 'Vue'

  return opts
}

function addExtension (filename, ext = 'prod') {
  const insertionPoint = filename.lastIndexOf('.')
  return `${ filename.slice(0, insertionPoint) }.${ ext }${ filename.slice(insertionPoint) }`
}

function injectVueRequirement (code) {
  const index = code.indexOf('Vue = Vue && Vue.hasOwnProperty(\'default\') ? Vue[\'default\'] : Vue')

  if (index === -1) {
    return code
  }

  const checkMe = ` if (Vue === void 0) {
    console.error('[ Quasar ] Vue is required to run. Please add a script tag for it before loading Quasar.')
    return
  }
  `

  return code.substring(0, index - 1)
    + checkMe
    + code.substring(index)
}

function buildEntry (config) {
  return rollup
    .rollup(config.rollup.input)
    .then(bundle => bundle.generate(config.rollup.output))
    .then(({ output }) => {
      const code = config.rollup.output.format === 'umd'
        ? injectVueRequirement(output[ 0 ].code)
        : output[ 0 ].code

      return config.build.unminified
        ? buildUtils.writeFile(config.rollup.output.file, code)
        : code
    })
    .then(code => {
      if (!config.build.minified) {
        return code
      }

      const minified = uglify.minify(code, uglifyJsOptions)

      if (minified.error) {
        return Promise.reject(minified.error)
      }

      return buildUtils.writeFile(
        addExtension(config.rollup.output.file),
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

      addSsrDirectives(builds)

      addUmdAssets(builds, 'lang', 'lang')
      addUmdAssets(builds, 'icon-set', 'iconSet')

      build(builds)
    })
}
