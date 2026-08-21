import fse from 'fs-extra'
import { rolldown } from 'rolldown'

import {
  BUILD_TARGETS,
  banner,
  logError,
  resolveToRoot,
  version,
  writeFile
} from './build.utils.js'

const importRE = /import\s*\{([\w,\s]+)\}\s*from\s*(['"])([a-zA-Z0-9-@/]+)\2;?/g
const umdTempFilesList = []
const umdTargetAssetRE = /\.js$/
process.on('exit', () => {
  umdTempFilesList.forEach(file => {
    fse.removeSync(file)
  })
})

const builds = [
  // Client entry-point used by @quasar/vite-plugin for DEV only.
  // Also used as entry-point in package.json.
  {
    inputConfig: {
      platform: 'browser',
      input: resolveToRoot('src/index.dev.js'),
      external: ['vue'],
      transform: {
        target: BUILD_TARGETS.ROLLDOWN_BROWSER,
        define: {
          // Any change to the flags should be reflected
          // to src/flags.dev.js as well.
          __QUASAR_VERSION__: `'${version}'`,
          __QUASAR_SSR_SERVER__: 'false'
        }
      }
    },
    outputList: [
      {
        outputConfig: {
          format: 'esm'
        },
        file: resolveToRoot('dist/quasar.client.js'),
        writeArgs: { summary: true }
      }
    ]
  },

  // SSR server prod entry-point
  //   -> ESM - used by @quasar/app-vite
  //.  -> CJS - used by @quasar/app-webpack
  // (no flags; not required to replace them)
  {
    inputConfig: {
      platform: 'node',
      input: resolveToRoot('src/index.ssr.js'),
      external: ['vue'],
      transform: {
        target: BUILD_TARGETS.ROLLDOWN_NODE,
        define: {
          __QUASAR_VERSION__: `'${version}'`,
          __QUASAR_SSR__: 'true',
          __QUASAR_SSR_SERVER__: 'true',
          __QUASAR_SSR_CLIENT__: 'false',
          __QUASAR_SSR_PWA__: 'false'
        }
      }
    },
    outputList: [
      {
        outputConfig: {
          format: 'esm',
          minify: true
        },
        file: resolveToRoot('dist/quasar.server.prod.js'),
        writeArgs: { summary: true }
      },
      {
        outputConfig: {
          format: 'cjs',
          minify: true
        },
        file: resolveToRoot('dist/quasar.server.prod.cjs'),
        writeArgs: { summary: true }
      }
    ]
  },

  // UMD entry
  {
    inputConfig: {
      platform: 'browser',
      input: resolveToRoot('src/index.umd.js'),
      external: ['vue'],
      transform: {
        target: BUILD_TARGETS.ROLLDOWN_BROWSER,
        define: {
          __QUASAR_VERSION__: `'${version}'`,
          __QUASAR_SSR__: 'false',
          __QUASAR_SSR_SERVER__: 'false',
          __QUASAR_SSR_CLIENT__: 'false',
          __QUASAR_SSR_PWA__: 'false'
        }
      }
    },
    outputList: [
      {
        outputConfig: {
          format: 'iife',
          globals: { vue: 'window.Vue' }
        },
        file: resolveToRoot('dist/quasar.umd.js'),
        writeArgs: { summary: true }
      },
      {
        outputConfig: {
          format: 'iife',
          globals: { vue: 'window.Vue' },
          minify: true
        },
        file: resolveToRoot('dist/quasar.umd.prod.js'),
        writeArgs: { summary: true, gzip: true }
      }
    ]
  }
]

async function compile({ inputConfig, outputList }) {
  try {
    const bundle = await rolldown(inputConfig)
    await Promise.all(
      outputList.map(({ outputConfig, file, writeArgs = {} }) =>
        bundle.generate({ ...outputConfig, banner }).then(result => {
          writeFile(file, result.output[0].code, writeArgs)
        })
      )
    )

    await bundle.close()
  } catch (err) {
    logError(`Rolldown build failed for ${inputConfig.input}`)
    console.error(err)
    process.exit(1)
  }
}

async function convertExternalImports(content) {
  const importList = {}
  const packageList = new Set()
  const tokenMap = {}
  let tokenIndex = 0

  const tokenContent = content.replace(
    importRE,
    (_, importIdMatch, __, packageMatch) => {
      const token = `____token_${tokenIndex++}____`
      packageList.add(packageMatch)
      tokenMap[token] = { packageMatch, importIdMatch }
      return token
    }
  )

  await Promise.all(
    [...packageList].map(packageMatch =>
      import(packageMatch).then(module => {
        importList[packageMatch] = module
      })
    )
  )

  return tokenContent.replaceAll(/____token_\d+____/g, token => {
    const { packageMatch, importIdMatch } = tokenMap[token]
    return importIdMatch
      .match(/[^\s,]+/g)
      .map(id => `const ${id} = '${importList[packageMatch][id]}'\n`)
      .join('')
  })
}

const umdDashRE = /-([a-zA-Z])/g

async function getUmdFiles(type) {
  const dirList = await fse.readdir(resolveToRoot(type))

  if (type === 'icon-set') {
    const rawLegacyFiles = await fse.readdir(
      resolveToRoot('build/legacy-assets/icon-set')
    )
    const legacyFiles = rawLegacyFiles.filter(file =>
      umdTargetAssetRE.test(file)
    )

    const legacyIconSetFiles = new Set(
      legacyFiles.map(
        // replacing .umd.prod.js with .js
        file => `${file.slice(0, -12)}.js`
      )
    )

    return {
      targetFiles: dirList.filter(
        file => umdTargetAssetRE.test(file) && !legacyIconSetFiles.has(file)
      ),
      legacyFiles
    }
  }

  if (type === 'lang') {
    return {
      targetFiles: dirList.filter(file => umdTargetAssetRE.test(file)),
      legacyFiles: []
    }
  }

  throw new Error(`Unsupported UMD asset type: ${type}`)
}

async function addUmdAssets(buildList, type, injectName, convertImports) {
  const { targetFiles, legacyFiles } = await getUmdFiles(type)

  for (const file of legacyFiles) {
    const content = await fse.readFile(
      resolveToRoot(`build/legacy-assets/${type}/${file}`),
      'utf8'
    )

    await fse.writeFile(
      resolveToRoot(`dist/${type}/${file}`),
      banner + content,
      'utf8'
    )
  }

  for (const file of targetFiles) {
    const name = file
      .slice(0, -3)
      .replaceAll(umdDashRE, g => g[1].toUpperCase())

    const sourceFile = resolveToRoot(`${type}/${file}`)
    let inputCode = await fse.readFile(sourceFile, 'utf8')
    const defaultReExport = inputCode.match(
      /^export\s+\{\s*default\s*\}\s+from\s+['"](.+)['"]\s*$/
    )

    if (defaultReExport) {
      inputCode = await fse.readFile(
        resolveToRoot(`${type}/${defaultReExport[1]}`),
        'utf8'
      )
    }
    const tempFile = resolveToRoot(`dist/${type}/temp.${file}`)
    umdTempFilesList.push(tempFile)

    await fse.writeFile(
      tempFile,
      (convertImports === true
        ? await convertExternalImports(inputCode)
        : inputCode
      ).replace('export default ', `window.Quasar.${injectName}.${name} = `),
      'utf8'
    )

    buildList.push({
      inputConfig: {
        platform: 'browser',
        input: tempFile,
        transform: {
          target: BUILD_TARGETS.ROLLDOWN_BROWSER
        }
      },
      outputList: [
        {
          outputConfig: {
            format: 'iife',
            minify: true
          },
          file: addExtension(resolveToRoot(`dist/${type}/${file}`), 'umd.prod')
        }
      ]
    })
  }
}

function addExtension(filename, ext = 'prod') {
  const insertionPoint = filename.lastIndexOf('.')
  const suffix = filename.slice(insertionPoint)
  return `${filename.slice(0, insertionPoint)}.${ext}${suffix}`
}

const runBuild = {
  async full() {
    import('./build.transforms.js').then(({ generate }) =>
      generate({ compact: true })
    )
    import('./build.icon-sets.js').then(({ generate }) => generate())

    Promise.all([
      addUmdAssets(builds, 'lang', 'Lang'),
      addUmdAssets(builds, 'icon-set', 'IconSet', true)
    ]).then(() => {
      builds.map(compile)
    })

    const api = await import('./build.api.js').then(({ generate }) =>
      generate({ compact: true })
    )

    import('./build.web-types.js').then(({ generate }) =>
      generate({ api, compact: true })
    )

    const quasarLangIndex = await import('./build.lang.js').then(
      ({ generate }) => generate()
    )
    import('./build.types.js').then(({ generate }) =>
      generate({ api, quasarLangIndex })
    )
  },

  async fast() {
    // does NOT builds types
    import('./build.transforms.js').then(({ generate }) =>
      generate({ compact: true })
    )
    import('./build.icon-sets.js').then(({ generate }) => generate())

    Promise.all([
      addUmdAssets(builds, 'lang', 'Lang'),
      addUmdAssets(builds, 'icon-set', 'IconSet', true)
    ]).then(() => {
      builds.map(compile)
    })

    const api = await import('./build.api.js').then(({ generate }) =>
      generate({ compact: true })
    )

    import('./build.web-types.js').then(({ generate }) =>
      generate({ api, compact: true })
    )

    await import('./build.lang.js').then(({ generate }) => generate())
  },

  async types() {
    const { prepareDiff } = await import('./prepare-diff.js')
    prepareDiff('dist/types/index.d.ts')

    const api = await import('./build.api.js').then(({ generate }) =>
      generate()
    )

    const quasarLangIndex = await import('./build.lang.js').then(
      ({ generate }) => generate()
    )
    import('./build.types.js').then(({ generate }) =>
      generate({ api, quasarLangIndex })
    )
  },

  async api() {
    const { prepareDiff } = await import('./prepare-diff.js')
    await prepareDiff('dist/api')
    import('./build.api.js').then(({ generate }) => generate())
  },

  async webtypes() {
    const { prepareDiff } = await import('./prepare-diff.js')
    await prepareDiff('dist/web-types')

    const api = await import('./build.api.js').then(({ generate }) =>
      generate({ compact: true })
    )
    import('./build.web-types.js').then(({ generate }) => generate({ api }))
  },

  async transforms() {
    const { prepareDiff } = await import('./prepare-diff.js')
    await prepareDiff('dist/transforms')
    import('./build.transforms.js').then(({ generate }) => generate())
  }
}

export function buildJavascript(subtype) {
  if (runBuild[subtype] === void 0) {
    console.log(` Unrecognized subtype specified: "${subtype}".`)
    console.log(` Available: ${Object.keys(runBuild).join(' | ')}\n`)
    process.exit(1)
  }

  runBuild[subtype]()
}
