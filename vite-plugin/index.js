import transformAssetUrls from 'quasar/dist/transforms/loader-asset-urls.json'

import getConfig from './src/get-config'
import { jsTransform, jsTransformRegex } from './src/js-transform'
import { vueTransform, vueTransformRegex } from './src/vue-transform'

export { transformAssetUrls }

export function quasar ({
  runMode = 'spa',
  sassVariablesFile = 'src/styles/quasar.sass',
  autoImportComponentCase = 'kebab'
} = {}) {
  return {
    name: 'transform-file',

    config (cfg) {
      const vueCfg = cfg.plugins.find(entry => entry.name === 'vite:vue')

      if (vueCfg === void 0) {
        console.warn('In your Vite config file, please add the Quasar plugin after the Vue one')
        process.exit(1)
      }

      return getConfig({ runMode, sassVariablesFile })
    },

    transform (src, id) {
      if (jsTransformRegex.test(id) === true) {
        return {
          code: jsTransform(src),
          map: null // provide source map if available
        }
      }
      else if (vueTransformRegex.test(id) === true) {
        return {
          code: vueTransform(src, autoImportComponentCase),
          map: null // provide source map if available
        }
      }
    }
  }
}
