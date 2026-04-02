import { join } from 'node:path'
import { mergeConfig as mergeViteConfig } from 'vite'

import {
  createViteConfig,
  extendViteConfig,
  createNodeEsbuildConfig,
  extendEsbuildConfig
} from '../../config-tools.js'

import { cliPkg } from '../../utils/cli-runtime.js'
import { getBuildSystemDefine } from '../../utils/env.js'

import { quasarPwaConfig } from '../pwa/pwa-config.js'
import { quasarVitePluginPwaResources } from '../pwa/vite-plugin.pwa-resources.js'

export const quasarSsrConfig = {
  viteClient: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-ssr-client'
    })
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
      cfg.plugins.push(quasarVitePluginPwaResources(quasarConf))
    }

    // dev has js entry-point, while prod has index.html
    if (quasarConf.ctx.dev) {
      cfg.build.rolldownOptions = cfg.build.rolldownOptions || {}
      cfg.build.rolldownOptions.input =
        appPaths.resolve.entry('client-entry.js')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  viteServer: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-ssr-server'
    })
    const { appPaths } = quasarConf.ctx
    const ssrEntryFile = appPaths.resolve.entry('server-entry.js')

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
        ws: false, // let client config deal with it
        hmr: false, // let client config deal with it
        middlewareMode: true,
        warmup: {
          ssrFiles: [ssrEntryFile]
        }
      },
      ssr: {
        // we don't externalize ourselves because of
        // the possible imports of '#q-app/wrappers' / '@quasar/app-vite/wrappers'
        noExternal: [cliPkg.name]
      },
      build: {
        ssr: true,
        outDir: join(quasarConf.build.distDir, 'server'),
        rolldownOptions: {
          input: ssrEntryFile
        }
      }
    })

    return extendViteConfig(cfg, quasarConf, { isServer: true })
  },

  // returns a Promise
  webserver: quasarConf => {
    const cfg = createNodeEsbuildConfig(quasarConf, {
      compileId: 'node-ssr-webserver',
      format: 'esm'
    })
    const { appPaths } = quasarConf.ctx

    Object.assign(
      cfg.define,
      getBuildSystemDefine({
        buildEnv: {
          CLIENT: false,
          SERVER: true
        }
      })
    )

    if (quasarConf.ctx.dev) {
      cfg.entryPoints = [appPaths.resolve.entry('ssr-dev-webserver.js')]
      cfg.outfile = appPaths.resolve.entry('compiled-dev-webserver.js')
    } else {
      cfg.external = [
        ...cfg.external,
        'vue/server-renderer',
        'vue/compiler-sfc',
        './render-template.js',
        './quasar.manifest.json',
        './server/server-entry.js'
      ]

      cfg.entryPoints = [appPaths.resolve.entry('ssr-prod-webserver.js')]
      cfg.outfile = join(quasarConf.build.distDir, 'index.js')
    }

    return extendEsbuildConfig(
      cfg,
      quasarConf.ssr,
      quasarConf.ctx,
      'extendSSRWebserverConf'
    )
  },

  workbox: quasarConf => {
    // returning null for the "inspect" cmd
    // otherwise this fn won't be called if not needed anyway
    if (quasarConf.ssr.pwa !== true) return null

    return quasarPwaConfig.workbox(quasarConf)
  },

  customSw: quasarConf => {
    if (
      quasarConf.ssr.pwa !== true ||
      quasarConf.pwa.workboxMode !== 'InjectManifest'
    ) {
      // returning null for the "inspect" cmd
      // otherwise this fn won't be called if not needed anyway
      return null
    }

    return quasarPwaConfig.customSw(quasarConf)
  }
}

export const modeConfig = quasarSsrConfig
