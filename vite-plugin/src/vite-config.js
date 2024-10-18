import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { quasarPath } from './quasar-path.js'

const { version } = JSON.parse(
  readFileSync(join(quasarPath, 'package.json'), 'utf-8')
)

export function getViteConfig (runMode, viteMode, externalViteCfg) {
  const viteCfg = {
    define: {
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR__: false,
      __QUASAR_SSR_SERVER__: false,
      __QUASAR_SSR_CLIENT__: false
    },

    css: {
      preprocessorOptions: {
        // Use sass-embedded for better stability and performance
        sass: {
          api: 'modern-compiler',
          silenceDeprecations: [ 'import', 'global-builtin' ]
        },
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: [ 'import', 'global-builtin' ]
        }
      }
    }
  }

  // Set this to the default value only if it's not already set.
  // @quasar/app-vite configures this by itself when it needs it.
  if (!externalViteCfg.define || externalViteCfg.define.__QUASAR_SSR_PWA__ === void 0) {
    viteCfg.define.__QUASAR_SSR_PWA__ = false
  }

  if (runMode === 'ssr-server') {
    Object.assign(viteCfg.define, {
      __QUASAR_SSR__: true,
      __QUASAR_SSR_SERVER__: true
    })
  }
  else {
    // Alias "quasar" package to its dev file (which has flags)
    // to reduce the number of HTTP requests while in DEV mode
    if (viteMode !== 'production') {
      viteCfg.resolve = {
        alias: [
          { find: /^quasar$/, replacement: 'quasar/dist/quasar.client.js' }
        ]
      }
    }
    else {
      viteCfg.optimizeDeps = {
        exclude: [ 'quasar' ]
      }
    }

    if (runMode === 'ssr-client') {
      Object.assign(viteCfg.define, {
        __QUASAR_SSR__: true,
        __QUASAR_SSR_CLIENT__: true
      })
    }
  }

  return viteCfg
}
