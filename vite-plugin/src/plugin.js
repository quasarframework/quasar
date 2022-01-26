import getConfig from './get-config'
import { jsTransform, jsTransformRegex } from './js-transform'
import { vueTransform, vueTransformRegex } from './vue-transform'

const defaultOptions = {
  runMode: 'web-client',
  autoImportComponentCase: 'kebab',
  sassVariables: true
}

export default function (userOpts = {}) {
  const opts = {
    ...defaultOptions,
    ...userOpts
  }

  return {
    name: 'vite:quasar',

    config (cfg) {
      const vueCfg = cfg.plugins.find(entry => entry.name === 'vite:vue')

      if (vueCfg === void 0) {
        console.warn('In your Vite config file, please add the Quasar plugin after the Vue one')
        process.exit(1)
      }

      return getConfig(opts)
    },

    transform (src, id) {
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
  }
}
