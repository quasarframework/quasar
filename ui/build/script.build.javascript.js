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
const prepareDiff = require('./prepare-diff')

const rootFolder = path.resolve(__dirname, '..')

function resolve (_path) {
  return path.resolve(rootFolder, _path)
}

// const tsConfig = {
//   tsconfigOverride: {
//     compilerOptions: {
//       sourceMap: true
//     },
//     include: ['./src/**/*.ts']
//   }
// }

const commonRollupPlugins = [
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

    // a few flags with noticeable gains/speed ratio
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
  {
    // client entry-point used by @quasar/vite-plugin for DEV only
    // (has flags untouched; required to replace them)
    rollup: {
      input: {
        input: resolve('src/index.dev.js')
      },
      output: {
        file: resolve('dist/quasar.esm.js'),
        format: 'es'
      }
    },
    build: {
      unminified: true,
      replace: {
        __QUASAR_VERSION__: `'${ version }'`,
        __QUASAR_SSR_SERVER__: false
      }
    }
  },

  {
    // client prod entry-point that is not used by Quasar CLI,
    // but pointed to in package.json > module;
    // (no flags; not required to replace them)
    rollup: {
      input: {
        input: resolve('src/index.prod.js')
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

  {
    // SSR server prod entry-point
    // (no flags; not required to replace them)
    rollup: {
      input: {
        input: resolve('src/index.ssr.js')
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

  {
    // UMD entry
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
    .filter(file => file.endsWith('.mjs'))
    .forEach(file => {
      const name = file
        .substring(0, file.length - 4)
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

function build (builds) {
  return Promise
    .all(builds.map(genConfig).map(buildEntry))
    .catch(buildUtils.logError)
}

function genConfig (opts) {
  opts.rollup.input.plugins = [ ...commonRollupPlugins ]

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
  const suffix = filename.slice(insertionPoint)
  return `${ filename.slice(0, insertionPoint) }.${ ext }${ suffix === '.mjs' ? '.js' : suffix }`
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

const runBuild = {
  async full () {
    await require('./build.lang').generate()
    await require('./build.icon-sets').generate()

    const data = await require('./build.api').generate()

    require('./build.transforms').generate()
    require('./build.vetur').generate(data)
    await require('./build.types').generate(data)
    require('./build.web-types').generate(data)

    addUmdAssets(builds, 'lang', 'lang')
    addUmdAssets(builds, 'icon-set', 'iconSet')

    await build(builds)
  },

  async types () {
    prepareDiff('dist/types/index.d.ts')

    const data = await require('./build.api').generate()

    require('./build.vetur').generate(data)
    require('./build.web-types').generate(data)

    // 'types' depends on 'lang-index'
    await require('./build.lang').generate()
    await require('./build.types').generate(data)
  },

  async api () {
    await prepareDiff('dist/api')
    await require('./build.api').generate()
  },

  async vetur () {
    await prepareDiff('dist/vetur')

    const data = await require('./build.api').generate()
    require('./build.vetur').generate(data)
  },

  async webtypes () {
    await prepareDiff('dist/web-types')

    const data = await require('./build.api').generate()
    require('./build.web-types').generate(data)
  },

  async transforms () {
    await prepareDiff('dist/transforms')
    require('./build.transforms').generate()
  }
}

module.exports = function (subtype) {
  if (runBuild[ subtype ] === void 0) {
    console.log(` Unrecognized subtype specified: "${ subtype }".`)
    console.log(` Available: ${ Object.keys(runBuild).join(' | ') }\n`)
    process.exit(1)
  }

  runBuild[ subtype ]()
}
