import { normalizePath } from 'vite'

import { getViteConfig } from './vite-config'
import { jsTransform, jsTransformRegex } from './js-transform'
import { vueTransform, vueTransformRegex } from './vue-transform'
import { sassTransformRegex, scssTransformRegex, createScssTransform } from './scss-transform'

const defaultOptions = {
  runMode: 'web-client',
  autoImportComponentCase: 'kebab',
  sassVariables: true
}

function getConfigPlugin (opts) {
  return {
    name: 'vite:quasar:vite-conf',
    config (viteConf) {
      const vueCfg = viteConf.plugins.find(entry => entry.name === 'vite:vue')

      if (vueCfg === void 0) {
        console.warn('In your Vite config file, please add the Quasar plugin after the Vue one')
        process.exit(1)
      }

      return getViteConfig(opts.runMode, viteConf)
    }
  }
}

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
      if (scssTransformRegex.test(id) === true) {
        return {
          code: scssTransform(src),
          map: null
        }
      }
      if (sassTransformRegex.test(id) === true) {
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
  let config

  return {
    name: 'vite:quasar:script',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    transform (src, id) {
      if (config.mode !== 'development') {
        if (vueTransformRegex.test(id) === true) {
          return {
            code: vueTransform(src, opts.autoImportComponentCase),
            map: null // provide source map if available
          }
        }
        else if (jsTransformRegex.test(id) === true) {
          return {
            code: jsTransform(src),
            map: null // provide source map if available
          }
        }
      }

      return null
    }
  }
}

export default function (userOpts = {}) {
  const opts = {
    ...defaultOptions,
    ...userOpts
  }

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
