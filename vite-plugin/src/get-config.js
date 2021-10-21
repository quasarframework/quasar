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
    const sassImportCode = (
      (typeof sassVariables === 'string' ? `@import '${ normalizePath(sassVariables) }'\n` : '')
      + `@import 'quasar/src/css/variables.sass'\n`
    )

    viteCfg.css = {
      preprocessorOptions: {
        sass: { additionalData: sassImportCode },
        scss: { additionalData: sassImportCode }
      }
    }
  }

  return viteCfg
}
