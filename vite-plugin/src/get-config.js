import { version } from 'quasar/package.json'

export default ({ runMode, sassVariablesFile }) => {
  const viteCfg = {
    define: {
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR__: false,
      __QUASAR_SSR_SERVER__: false,
      __QUASAR_SSR_CLIENT__: false,
      __QUASAR_SSR_PWA__: false
    },

    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `@import '${ sassVariablesFile }'\n`
        },
        scss: {
          additionalData: `@import '${ sassVariablesFile }';\n`
        }
      }
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

  return viteCfg
}
