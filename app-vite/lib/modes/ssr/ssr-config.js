import { join } from 'node:path'
import { mergeConfig as mergeViteConfig } from 'vite'

import {
  createViteConfig, extendViteConfig,
  createNodeEsbuildConfig, extendEsbuildConfig
} from '../../config-tools.js'

import { getBuildSystemDefine } from '../../utils/env.js'

import { quasarPwaConfig } from '../pwa/pwa-config.js'
import { quasarVitePluginPwaResources } from '../pwa/vite-plugin.pwa-resources.js'

export const quasarSsrConfig = {
  viteClient: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, { compileId: 'vite-ssr-client' })
    const { appPaths } = quasarConf.ctx

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
      cfg.build.rollupOptions.input = appPaths.resolve.entry('client-entry.js')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  viteServer: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, { compileId: 'vite-ssr-server' })
    const { appPaths } = quasarConf.ctx

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
          input: appPaths.resolve.entry('server-entry.mjs')
        }
      }
    })

    return extendViteConfig(cfg, quasarConf, { isServer: true })
  },

  // returns a Promise
  webserver: quasarConf => {
    const cfg = createNodeEsbuildConfig(quasarConf, { compileId: 'node-ssr-webserver', format: 'esm' })
    const { appPaths } = quasarConf.ctx

    Object.assign(cfg.define, getBuildSystemDefine({
      buildEnv: {
        CLIENT: false,
        SERVER: true
      }
    }))

    if (quasarConf.ctx.dev) {
      cfg.entryPoints = [ appPaths.resolve.entry('ssr-dev-webserver.mjs') ]
      cfg.outfile = appPaths.resolve.entry('compiled-dev-webserver.mjs')
    }
    else {
      cfg.external = [
        ...(cfg.external || []),
        'vue/server-renderer',
        'vue/compiler-sfc',
        './render-template.js',
        './quasar.manifest.json',

        // based on project's package.json > type (module | commonjs), one of the
        // following will be compiled:
        './server/server-entry.js',
        './server/server-entry.mjs'
      ]

      cfg.entryPoints = [ appPaths.resolve.entry('ssr-prod-webserver.mjs') ]
      cfg.outfile = join(quasarConf.build.distDir, 'index.js')
    }

    return extendEsbuildConfig(cfg, quasarConf.ssr, quasarConf.ctx, 'extendSSRWebserverConf')
  },

  workbox: quasarPwaConfig.workbox,
  customSw: quasarPwaConfig.customSw
}

export const modeConfig = quasarSsrConfig
