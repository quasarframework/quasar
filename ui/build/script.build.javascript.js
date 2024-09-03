process.env.BABEL_ENV = 'production'

import fse from 'fs-extra'
import { build as esBuild } from 'esbuild'

import { version, banner, resolveToRoot, logError, writeFile } from './build.utils.js'
import prepareDiff from './prepare-diff.js'

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

const importRE = /import\s*\{([\w,\s]+)\}\s*from\s*(['"])([a-zA-Z0-9-@/]+)\2;?/g
const umdTempFilesList = []
const umdTargetAssetRE = /\.js$/
process.on('exit', () => {
  umdTempFilesList.forEach(file => {
    fse.removeSync(file)
  })
})

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
  // Client entry-point used by @quasar/vite-plugin for DEV only.
  // Also used as entry-point in package.json.
  {
    format: 'esm',
    define: {
      // Any change to the flags should be reflected
      // to src/flags.dev.js as well.
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR_SERVER__: 'false'
    },
    entryPoints: [
      resolveToRoot('src/index.dev.js')
    ],
    outfile: resolveToRoot('dist/quasar.client.js')
  },

  // SSR server prod entry-point (ESM - used by @quasar/app-vite)
  // (no flags; not required to replace them)
  {
    format: 'esm',
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
      resolveToRoot('src/index.ssr.js')
    ],
    outfile: resolveToRoot('dist/quasar.server.prod.js')
  },

  // SSR server prod entry-point (CJS - used by @quasar/app-webpack)
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
      resolveToRoot('src/index.ssr.js')
    ],
    outfile: resolveToRoot('dist/quasar.server.prod.cjs')
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
      resolveToRoot('src/index.umd.js')
    ],
    outfile: resolveToRoot('dist/quasar.umd.js'),
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
      resolveToRoot('src/index.umd.js')
    ],
    outfile: resolveToRoot('dist/quasar.umd.prod.js'),
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
      js: banner
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
          logError(`Errors encountered for ${ esbuildConfig.entryPoints[ 0 ] }`)
          process.exit(1)
        }

        return writeFile(
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
      logError('Errors encountered during the esbuild compilation. Exiting...')
      process.exit(1)
    })
}

async function convertExternalImports (content) {
  const importList = {}
  const packageList = new Set()
  const tokenMap = {}
  let tokenIndex = 0

  const tokenContent = content.replace(
    importRE,
    (_, importIdMatch, __, packageMatch) => {
      const token = `____token_${ tokenIndex++ }____`
      packageList.add(packageMatch)
      tokenMap[ token ] = { packageMatch, importIdMatch }
      return token
    }
  )

  await Promise.all(
    [ ...packageList ].map(packageMatch => {
      return import(packageMatch)
        .then(async module => { importList[ packageMatch ] = module })
    })
  )

  return tokenContent.replace(
    /____token_\d+____/g,
    token => {
      const { packageMatch, importIdMatch } = tokenMap[ token ]
      return importIdMatch.match(/[^\s,]+/g)
        .map(id => `const ${ id } = '${ importList[ packageMatch ][ id ] }'\n`)
        .join('')
    }
  )
}

async function addUmdAssets (builds, type, injectName, convertImports) {
  const fileList = fse.readdirSync(resolveToRoot(type))
    .filter(file => umdTargetAssetRE.test(file))

  for (const file of fileList) {
    const name = file
      .substring(0, file.length - 3)
      .replace(/-([a-zA-Z])/g, g => g[ 1 ].toUpperCase())

    const inputCode = fse.readFileSync(resolveToRoot(`${ type }/${ file }`), 'utf-8')
    const tempFile = resolveToRoot(`dist/${ type }/temp.${ file }`)

    umdTempFilesList.push(tempFile)

    fse.writeFileSync(
      tempFile,
      (
        convertImports === true
          ? await convertExternalImports(inputCode)
          : inputCode
      ).replace('export default ', `window.Quasar.${ injectName }.${ name } = `),
      'utf-8'
    )

    builds.push({
      format: 'iife',
      minify: true,
      entryPoints: [
        tempFile
      ],
      outfile: addExtension(resolveToRoot(`dist/${ type }/${ file }`), 'umd.prod')
    })
  }
}

function addExtension (filename, ext = 'prod') {
  const insertionPoint = filename.lastIndexOf('.')
  const suffix = filename.slice(insertionPoint)
  return `${ filename.slice(0, insertionPoint) }.${ ext }${ suffix }`
}

const runBuild = {
  async full () {
    import('./build.transforms.js').then(({ generate }) => generate({ compact: true }))
    import('./build.icon-sets.js').then(({ generate }) => generate())

    Promise.all([
      addUmdAssets(builds, 'lang', 'Lang'),
      addUmdAssets(builds, 'icon-set', 'IconSet', true)
    ]).then(() => {
      build(builds)
    })

    const api = await import('./build.api.js').then(({ generate }) => generate({ compact: true }))

    import('./build.vetur.js').then(({ generate }) => generate({ api, compact: true }))
    import('./build.web-types.js').then(({ generate }) => generate({ api, compact: true }))

    const quasarLangIndex = await import('./build.lang.js').then(({ generate }) => generate())
    import('./build.types.js').then(({ generate }) => generate({ api, quasarLangIndex }))
  },

  async fast () { // does NOT builds types
    import('./build.transforms.js').then(({ generate }) => generate({ compact: true }))
    import('./build.icon-sets.js').then(({ generate }) => generate())

    Promise.all([
      addUmdAssets(builds, 'lang', 'Lang'),
      addUmdAssets(builds, 'icon-set', 'IconSet', true)
    ]).then(() => {
      build(builds)
    })

    build(builds)

    const api = await import('./build.api.js').then(({ generate }) => generate({ compact: true }))

    import('./build.vetur.js').then(({ generate }) => generate({ api, compact: true }))
    import('./build.web-types.js').then(({ generate }) => generate({ api, compact: true }))

    await import('./build.lang.js').then(({ generate }) => generate())
  },

  async types () {
    prepareDiff('dist/types/index.d.ts')

    const api = await import('./build.api.js').then(({ generate }) => generate())

    const quasarLangIndex = await import('./build.lang.js').then(({ generate }) => generate())
    import('./build.types.js').then(({ generate }) => generate({ api, quasarLangIndex }))
  },

  async api () {
    await prepareDiff('dist/api')
    import('./build.api.js').then(({ generate }) => generate())
  },

  async vetur () {
    await prepareDiff('dist/vetur')

    const api = await import('./build.api.js').then(({ generate }) => generate({ compact: true }))
    import('./build.vetur.js').then(({ generate }) => generate({ api }))
  },

  async webtypes () {
    await prepareDiff('dist/web-types')

    const api = await import('./build.api.js').then(({ generate }) => generate({ compact: true }))
    import('./build.web-types.js').then(({ generate }) => generate({ api }))
  },

  async transforms () {
    await prepareDiff('dist/transforms')
    import('./build.transforms.js').then(({ generate }) => generate())
  }
}

export function buildJavascript (subtype) {
  if (runBuild[ subtype ] === void 0) {
    console.log(` Unrecognized subtype specified: "${ subtype }".`)
    console.log(` Available: ${ Object.keys(runBuild).join(' | ') }\n`)
    process.exit(1)
  }

  runBuild[ subtype ]()
}
