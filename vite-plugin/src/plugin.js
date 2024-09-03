import { normalizePath } from 'vite'

import { getViteConfig } from './vite-config.js'
import { vueTransform } from './vue-transform.js'
import { createScssTransform } from './scss-transform.js'
import { parseViteRequest, createExtMatcher } from './query.js'
import { mapQuasarImports } from './js-transform.js'

const defaultOptions = {
  runMode: 'web-client',
  sassVariables: true,
  devTreeshaking: false,
  autoImportComponentCase: 'kebab',
  autoImportVueExtensions: [ 'vue' ],
  autoImportScriptExtensions: [ 'js', 'jsx', 'ts', 'tsx' ]
}
const defaultOptionsKeys = Object.keys(defaultOptions)

function parsePluginOptions (userOpts = {}) {
  const opts = { ...userOpts }

  for (const key of defaultOptionsKeys) {
    if (opts[ key ] === void 0) {
      opts[ key ] = defaultOptions[ key ]
    }
  }

  return opts
}

function getConfigPlugin (opts) {
  return {
    name: 'vite:quasar:vite-conf',

    configResolved (viteConf) {
      const vueCfg = viteConf.plugins.find(entry => entry.name === 'vite:vue')

      if (vueCfg === void 0) {
        console.error('\n\n[Quasar] Error: In your Vite config file, please add the Quasar plugin ** after ** the Vue one\n\n')
        process.exit(1)
      }
    },

    config (viteConf, { mode }) {
      return getViteConfig(opts.runMode, mode, viteConf)
    }
  }
}

const scssMatcher = createExtMatcher([ 'scss', 'module.scss' ])
const sassMatcher = createExtMatcher([ 'sass', 'module.sass' ])

function getScssTransformsPlugin (opts) {
  const sassVariables = typeof opts.sassVariables === 'string'
    ? normalizePath(opts.sassVariables)
    : opts.sassVariables

  const scssTransform = createScssTransform('scss', sassVariables)
  const sassTransform = createScssTransform('sass', sassVariables)

  return {
    name: 'vite:quasar:scss',

    enforce: 'pre',

    transform (src, id) {
      const is = parseViteRequest(id)

      if (is.style(scssMatcher) === true) {
        return {
          code: scssTransform(src),
          map: null
        }
      }

      if (is.style(sassMatcher) === true) {
        return {
          code: sassTransform(src),
          map: null
        }
      }

      return null
    }
  }
}

function getScriptTransformsPlugin (opts) {
  let useTreeshaking = true

  const vueMatcher = createExtMatcher(opts.autoImportVueExtensions)
  const scriptMatcher = createExtMatcher(opts.autoImportScriptExtensions)

  return {
    name: 'vite:quasar:script',

    configResolved (resolvedConfig) {
      if (opts.devTreeshaking === false && resolvedConfig.mode !== 'production') {
        useTreeshaking = false
      }
    },

    transform (src, id) {
      const is = parseViteRequest(id)

      if (is.template(vueMatcher) === true) {
        return {
          code: vueTransform(src, opts.autoImportComponentCase, useTreeshaking),
          map: null // provide source map if available
        }
      }

      if (useTreeshaking === true && is.script(scriptMatcher) === true) {
        return {
          code: mapQuasarImports(src),
          map: null // provide source map if available
        }
      }

      return null
    }
  }
}

export default function (userOpts) {
  const opts = parsePluginOptions(userOpts)

  const plugins = [
    getConfigPlugin(opts)
  ]

  if (opts.sassVariables) {
    plugins.push(
      getScssTransformsPlugin(opts)
    )
  }

  if (opts.runMode !== 'ssr-server') {
    plugins.push(
      getScriptTransformsPlugin(opts)
    )
  }

  return plugins
}
