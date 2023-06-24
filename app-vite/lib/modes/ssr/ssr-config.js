
import { join } from 'node:path'

import {
  createViteConfig, extendViteConfig, mergeViteConfig,
  createNodeEsbuildConfig, extendEsbuildConfig
} from '../../config-tools.js'

import appPaths from '../../app-paths.js'
import { getBuildSystemDefine } from '../../utils/env.js'

import { quasarPwaConfig } from '../pwa/pwa-config.js'
import { quasarVitePluginPwaResources } from '../pwa/vite-plugin.pwa-resources.js'

export const quasarSsrConfig = {
  viteClient: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, 'ssr-client')

    cfg = mergeViteConfig(cfg, {
      define: getBuildSystemDefine({
        buildEnv: {
          CLIENT: true,
          SERVER: false
        },
        buildRawDefine: {
          __QUASAR_SSR_PWA__: quasarConf.ssr.pwa === true
        }
      }),
      appType: 'custom',
      server: {
        middlewareMode: true
      },
      build: {
        ssrManifest: true,
        outDir: join(quasarConf.build.distDir, 'client')
      }
    })

    // also update pwa-config.js when changing here
    if (quasarConf.ssr.pwa === true) {
      cfg.plugins.push(
        quasarVitePluginPwaResources(quasarConf)
      )
    }

    // dev has js entry-point, while prod has index.html
    if (quasarConf.ctx.dev) {
      cfg.build.rollupOptions = cfg.build.rollupOptions || {}
      cfg.build.rollupOptions.input = appPaths.resolve.app('.quasar/client-entry.js')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  viteServer: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, 'ssr-server')

    cfg = mergeViteConfig(cfg, {
      target: quasarConf.build.target.node,
      define: getBuildSystemDefine({
        buildEnv: {
          CLIENT: false,
          SERVER: true
        },
        buildRawDefine: {
          __QUASAR_SSR_PWA__: quasarConf.ssr.pwa === true
        }
      }),
      appType: 'custom',
      server: {
        hmr: false, // let client config deal with it
        middlewareMode: true
      },
      build: {
        ssr: true,
        outDir: join(quasarConf.build.distDir, 'server'),
        rollupOptions: {
          input: appPaths.resolve.app('.quasar/server-entry.js')
        }
      }
    })

    return extendViteConfig(cfg, quasarConf, { isServer: true })
  },

  webserver: async quasarConf => {
    const cfg = await createNodeEsbuildConfig(quasarConf, 'esm', { cacheSuffix: 'ssr-webserver' })

    Object.assign(cfg.define, getBuildSystemDefine({
      buildEnv: {
        CLIENT: false,
        SERVER: true
      }
    }))

    if (quasarConf.ctx.dev) {
      cfg.entryPoints = [ appPaths.resolve.app('.quasar/ssr-dev-webserver.js') ]
      cfg.outfile = appPaths.resolve.app('.quasar/ssr/compiled-dev-webserver.mjs')
    }
    else {
      cfg.external = [
        ...(cfg.external || []),
        'vue/server-renderer',
        'vue/compiler-sfc',
        './render-template.cjs',
        './quasar.manifest.json',
        './server/server-entry.mjs'
      ]

      cfg.entryPoints = [ appPaths.resolve.app('.quasar/ssr-prod-webserver.js') ]
      cfg.outfile = join(quasarConf.build.distDir, 'index.js')
    }

    return extendEsbuildConfig(cfg, quasarConf.ssr, 'SSRWebserver')
  },

  workbox: quasarPwaConfig.workbox,
  customSw: quasarPwaConfig.customSw
}

export const modeConfig = quasarSsrConfig
