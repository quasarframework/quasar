import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { quasarPath } from './quasar-path.js'

const { version } = JSON.parse(
  readFileSync(join(quasarPath, 'package.json'), 'utf8')
)

const frameworkCssSpecifier = 'quasar/src/css/index.sass'

/**
 * Mirrors Vite's alias matching: a string find matches the exact id or
 * a "find/" prefix of it; a regex find matches when it tests true.
 */
function userAliasCoversFrameworkCss(aliasCfg) {
  if (!aliasCfg) return false

  const findList = Array.isArray(aliasCfg)
    ? aliasCfg.map(entry => entry.find)
    : Object.keys(aliasCfg)

  return findList.some(find =>
    typeof find === 'string'
      ? frameworkCssSpecifier === find ||
        frameworkCssSpecifier.startsWith(find.endsWith('/') ? find : find + '/')
      : find.test(frameworkCssSpecifier)
  )
}

export function getViteConfig(
  runMode,
  isServing,
  externalViteCfg,
  sassVariables
) {
  const aliasList = []
  const viteCfg = {
    define: {
      __QUASAR_VERSION__: `'${version}'`,
      __QUASAR_SSR__: false,
      __QUASAR_SSR_SERVER__: false,
      __QUASAR_SSR_CLIENT__: false
    },

    css: {
      preprocessorOptions: {
        // Use sass-embedded for better stability and performance
        sass: {
          api: 'modern-compiler',
          silenceDeprecations: ['import', 'global-builtin']
        },
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['import', 'global-builtin']
        }
      }
    }
  }

  // Set this to the default value only if it's not already set.
  // @quasar/app-vite configures this by itself when it needs it.
  if (
    !externalViteCfg.define ||
    externalViteCfg.define.__QUASAR_SSR_PWA__ === void 0
  ) {
    viteCfg.define.__QUASAR_SSR_PWA__ = false
  }

  // Without a custom variables file, compiling the framework css from
  // source yields the same result that already ships prebuilt, so skip
  // that sass compilation (~110ms per build / cold dev server) entirely.
  // A user-configured additionalData could inject variable overrides,
  // and a user alias covering the quasar package redirects it (e.g. to
  // a repo checkout) - in both cases the compilation from source must
  // be kept.
  const userPreprocessorOptions = externalViteCfg.css?.preprocessorOptions
  if (
    typeof sassVariables !== 'string' &&
    userPreprocessorOptions?.sass?.additionalData === void 0 &&
    userPreprocessorOptions?.scss?.additionalData === void 0 &&
    !userAliasCoversFrameworkCss(externalViteCfg.resolve?.alias)
  ) {
    aliasList.push({
      find: /^quasar\/src\/css\/index\.sass$/,
      replacement: 'quasar/dist/quasar.css'
    })
  }

  if (runMode === 'ssr-server') {
    Object.assign(viteCfg.define, {
      __QUASAR_SSR__: true,
      __QUASAR_SSR_SERVER__: true
    })
  } else {
    // Alias "quasar" package to its single-file client build to reduce
    // the number of HTTP requests that the dev server has to answer
    if (isServing) {
      aliasList.push({
        find: /^quasar$/,
        replacement: 'quasar/dist/quasar.client.js'
      })
    }

    if (runMode === 'ssr-client') {
      Object.assign(viteCfg.define, {
        __QUASAR_SSR__: true,
        __QUASAR_SSR_CLIENT__: true
      })
    }
  }

  if (aliasList.length !== 0) {
    viteCfg.resolve = { alias: aliasList }
  }

  return viteCfg
}
