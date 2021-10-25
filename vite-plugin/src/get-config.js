import { version } from 'quasar/package.json'
import { normalizePath } from 'vite'

export default ({ runMode, sassVariables }) => {
  const viteCfg = {
    define: {
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR__: false,
      __QUASAR_SSR_SERVER__: false,
      __QUASAR_SSR_CLIENT__: false,
      __QUASAR_SSR_PWA__: false
    },

    optimizeDeps: {
      exclude: [ 'quasar' ]
    }
  }

  if (runMode === 'ssr-client') {
    Object.assign(viteCfg.define, {
      __QUASAR_SSR__: true,
      __QUASAR_SSR_CLIENT__: true
    })
  }
  else if (runMode === 'ssr-server') {
    Object.assign(viteCfg.define, {
      __QUASAR_SSR__: true,
      __QUASAR_SSR_SERVER__: true
    })
  }

  if (sassVariables) {    
    const sassImportArr = [`@import 'quasar/src/css/variables.sass'`, '']
    if (typeof sassVariables === 'string') {
      sassImportArr.unshift(`@import '${ normalizePath(sassVariables) }'`)
    }

    viteCfg.css = {
      preprocessorOptions: {
        sass: { additionalData: sassImportArr.join('\n') },
        scss: { additionalData: sassImportArr.join(';\n') }
      }
    }
  }

  return viteCfg
}
