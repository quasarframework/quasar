process.env.BABEL_ENV = 'production'

const path = require('node:path')
const fse = require('fs-extra')
const { build: esBuild } = require('esbuild')

const { version } = require('../package.json')

const buildConf = require('./build.conf')
const buildUtils = require('./build.utils')
const prepareDiff = require('./prepare-diff')

const vueNamedImportsCode = (() => {
  /**
   * We could infer this automatically by reading and parsing each
   * file for vue imports, but the runtime cost is too high and we
   * want to achieve the best possible performance while building.
   *
   * Unfortunately, esbuild does not have an option to tell
   * anything about what the named imports are from the target file.
   *
   * Add all the vue imports from the UI code to the list below
   * otherwise the build will fail with the following error:
   *   No matching export in "Search for vueNamedImportsCode in /ui/build :vue"
   */
  const namedImports = [
    'h',
    'ref', 'computed', 'watch',
    'isRef', 'toRaw', 'unref', 'reactive', 'shallowReactive',
    'nextTick',
    'onActivated', 'onDeactivated',
    'onBeforeMount', 'onMounted',
    'onBeforeUnmount', 'onUnmounted',
    'onBeforeUpdate', 'onUpdated',
    'inject', 'provide',
    'getCurrentInstance',
    'markRaw',
    'Transition', 'TransitionGroup', 'KeepAlive', 'Teleport',
    'useSSRContext',
    'withDirectives',
    'vShow',
    'defineComponent', 'createApp'
  ].join(',')

  return { contents: `const { ${ namedImports } } = window.Vue;export { ${ namedImports } };` }
})()

const umdTempFilesList = []
const umdTargetAssetRE = /\.mjs$/
process.on('exit', () => {
  umdTempFilesList.forEach(file => {
    fse.removeSync(file)
  })
})

const rootFolder = path.resolve(__dirname, '..')
const resolve = file => path.resolve(rootFolder, file)

const quasarEsbuildPluginUmdGlobalExternals = {
  name: 'quasar:umd-global-externals',
  setup (build) {
    const namespace = 'Search for vueNamedImportsCode in /ui/build '
    build.onResolve({ filter: /^vue$/ }, (args) => ({
      path: args.path,
      namespace
    }))

    build.onLoad(
      { filter: /.*/, namespace },
      () => vueNamedImportsCode
    )
  }
}

const builds = [
  // client entry-point used by @quasar/vite-plugin for DEV only
  // (has flags untouched; required to replace them)
  {
    format: 'esm',
    define: {
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR_SERVER__: 'false'
    },
    entryPoints: [
      resolve('src/index.dev.js')
    ],
    outfile: resolve('dist/quasar.esm.js')
  },

  // client prod entry-point that is not used by Quasar CLI,
  // but pointed to in package.json > module;
  // (no flags; not required to replace them)
  {
    format: 'esm',
    minify: true,
    define: {
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR__: 'false',
      __QUASAR_SSR_SERVER__: 'false',
      __QUASAR_SSR_CLIENT__: 'false',
      __QUASAR_SSR_PWA__: 'false'
    },
    entryPoints: [
      resolve('src/index.prod.js')
    ],
    outfile: resolve('dist/quasar.esm.prod.js')
  },

  // SSR server prod entry-point
  // (no flags; not required to replace them)
  {
    format: 'cjs',
    platform: 'node',
    minify: true,
    define: {
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR__: 'true',
      __QUASAR_SSR_SERVER__: 'true',
      __QUASAR_SSR_CLIENT__: 'false',
      __QUASAR_SSR_PWA__: 'false'
    },
    entryPoints: [
      resolve('src/index.ssr.js')
    ],
    outfile: resolve('dist/quasar.cjs.prod.js')
  },

  // UMD dev entry
  {
    format: 'iife',
    define: {
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR__: 'false',
      __QUASAR_SSR_SERVER__: 'false',
      __QUASAR_SSR_CLIENT__: 'false',
      __QUASAR_SSR_PWA__: 'false'
    },
    entryPoints: [
      resolve('src/index.umd.js')
    ],
    outfile: resolve('dist/quasar.umd.js'),
    plugins: [ quasarEsbuildPluginUmdGlobalExternals ]
  },

  // UMD prod entry
  {
    format: 'iife',
    minify: true,
    define: {
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR__: 'false',
      __QUASAR_SSR_SERVER__: 'false',
      __QUASAR_SSR_CLIENT__: 'false',
      __QUASAR_SSR_PWA__: 'false'
    },
    entryPoints: [
      resolve('src/index.umd.js')
    ],
    outfile: resolve('dist/quasar.umd.prod.js'),
    plugins: [ quasarEsbuildPluginUmdGlobalExternals ]
  }
]

function genConfig (opts) {
  return {
    platform: 'browser',
    packages: 'external',
    target: [ 'es2022', 'firefox115', 'chrome115', 'safari14' ],
    bundle: true,
    banner: {
      js: buildConf.banner
    },
    write: false,
    ...opts
  }
}

function build (builds) {
  const promiseList = builds.map(genConfig)
    .map(esbuildConfig => {
      return esBuild(esbuildConfig).then(result => {
        if (result.errors.length !== 0 || result.warnings.length !== 0) {
          buildUtils.logError(`Errors encountered for ${ esbuildConfig.entryPoints[ 0 ] }`)
          process.exit(1)
        }

        return buildUtils.writeFile(
          esbuildConfig.outfile,
          result.outputFiles[ 0 ].text,
          esbuildConfig.minify === true
        )
      })
    })

  return Promise
    .all(promiseList)
    .catch(err => {
      console.error(err)
      buildUtils.logError('Errors encountered during the esbuild compilation. Exiting...')
      process.exit(1)
    })
}

function addUmdAssets (builds, type, injectName) {
  const files = fse.readdirSync(resolve(type))

  files.forEach(file => {
    if (umdTargetAssetRE.test(file) === false) return

    const name = file
      .substring(0, file.length - 4)
      .replace(/-([a-zA-Z])/g, g => g[ 1 ].toUpperCase())

    const inputCode = fse.readFileSync(resolve(`${ type }/${ file }`), 'utf-8')
    const tempFile = resolve(`dist/${ type }/temp.${ file }`)

    umdTempFilesList.push(tempFile)

    fse.writeFileSync(
      tempFile,
      inputCode.replace('export default ', `window.Quasar.${ injectName }.${ name } = `),
      'utf-8'
    )

    builds.push({
      format: 'iife',
      minify: true,
      entryPoints: [
        tempFile
      ],
      outfile: addExtension(resolve(`dist/${ type }/${ file }`), 'umd.prod')
    })
  })
}

function addExtension (filename, ext = 'prod') {
  const insertionPoint = filename.lastIndexOf('.')
  const suffix = filename.slice(insertionPoint)
  return `${ filename.slice(0, insertionPoint) }.${ ext }${ suffix === '.mjs' ? '.js' : suffix }`
}

const runBuild = {
  async full () {
    require('./build.transforms').generate({ compact: true })
    require('./build.icon-sets').generate()

    addUmdAssets(builds, 'lang', 'lang')
    addUmdAssets(builds, 'icon-set', 'iconSet')

    build(builds)

    const api = await require('./build.api').generate({ compact: true })

    require('./build.vetur').generate({ api, compact: true })
    require('./build.web-types').generate({ api, compact: true })

    const quasarLangIndex = await require('./build.lang').generate()
    require('./build.types').generate({ api, quasarLangIndex })
  },

  async types () {
    prepareDiff('dist/types/index.d.ts')

    const api = await require('./build.api').generate()

    const quasarLangIndex = await require('./build.lang').generate()
    require('./build.types').generate({ api, quasarLangIndex })
  },

  async api () {
    await prepareDiff('dist/api')
    require('./build.api').generate()
  },

  async vetur () {
    await prepareDiff('dist/vetur')

    const api = await require('./build.api').generate({ compact: true })
    require('./build.vetur').generate({ api })
  },

  async webtypes () {
    await prepareDiff('dist/web-types')

    const api = await require('./build.api').generate({ compact: true })
    require('./build.web-types').generate({ api })
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
