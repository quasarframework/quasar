import { join } from 'node:path'
import { mergeConfig as mergeViteConfig } from 'vite'

import {
  createNodeRolldownConfig,
  createViteConfig,
  extendRolldownConfig,
  extendViteConfig
} from '../../config-tools.js'

import { cliDir, cliPkg } from '../../utils/cli-runtime.js'
import { getPackagePath } from '../../utils/get-package-path.js'

import { quasarPwaConfig } from '../pwa/pwa-config.js'
import { quasarVitePluginPwaResources } from '../pwa/pwa-utils.js'

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export const quasarSsrConfig = {
  viteClient: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-ssr-client',
      shippedToClient: true,
      modeDeps: quasarConf.ssr.pwa
        ? /**
           * We specify modeDeps because the SW register file
           * is part of the /src build and it uses dependencies
           * from /src-pwa.
           */
          [{ dir: 'src-pwa', deps: quasarConf.ctx.pkg.pwaPkg.dependencies }]
        : void 0
    })
    const { appPaths } = quasarConf.ctx

    cfg = mergeViteConfig(cfg, {
      define: {
        'import.meta.env.QUASAR_CLIENT': 'true',
        'import.meta.env.QUASAR_SERVER': 'false',
        __QUASAR_SSR_PWA__: String(Boolean(quasarConf.ssr.pwa))
      },
      appType: 'custom',
      server: {
        middlewareMode: true
      },
      build: {
        ssrManifest: true,
        // needed by createSsrManifest() to resolve the CSS of shared chunks
        manifest: true,
        outDir: join(quasarConf.build.distDir, 'client')
      }
    })

    // also update pwa-config.js & ssg-config.js when changing here
    if (quasarConf.ssr.pwa) {
      cfg.plugins.push(quasarVitePluginPwaResources(quasarConf))
    }

    // dev has js entry-point, while prod has index.html
    if (quasarConf.ctx.dev) {
      cfg.build.rolldownOptions ||= {}
      cfg.build.rolldownOptions.input =
        appPaths.resolve.entry('client-entry.js')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  viteServer: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-ssr-server',
      shippedToClient: false,
      modeDeps: quasarConf.ssr.pwa
        ? /**
           * We specify modeDeps because the SW register file
           * is part of the /src build and it uses dependencies
           * from /src-pwa.
           */
          [{ dir: 'src-pwa', deps: quasarConf.ctx.pkg.pwaPkg.dependencies }]
        : void 0
    })

    const { appPaths } = quasarConf.ctx
    const ssrEntryFile = appPaths.resolve.entry('server-entry.js')

    cfg = mergeViteConfig(cfg, {
      target: quasarConf.build.target.node,
      define: {
        'import.meta.env.QUASAR_CLIENT': 'false',
        'import.meta.env.QUASAR_SERVER': 'true',
        __QUASAR_SSR_PWA__: String(Boolean(quasarConf.ssr.pwa))
      },
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
        // the possible imports of '#q-app' / '@quasar/app-vite' wrappers
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
    const cfg = createNodeRolldownConfig(quasarConf, {
      compileId: 'ssr-webserver',
      format: 'esm',
      shippedToClient: false
    })
    const { appPaths } = quasarConf.ctx

    cfg.transform.define = {
      ...cfg.transform.define,
      'import.meta.env.QUASAR_CLIENT': 'false',
      'import.meta.env.QUASAR_SERVER': 'true'
    }

    if (quasarConf.ctx.dev) {
      cfg.input = appPaths.resolve.entry('ssr-dev-webserver.js')
      cfg.output.file = appPaths.resolve.entry('compiled-dev-webserver.js')
    } else {
      cfg.input = appPaths.resolve.entry('ssr-prod-webserver.js')
      cfg.output.file = join(quasarConf.build.distDir, 'index.js')

      cfg.external.push(
        ...Object.keys(quasarConf.ctx.pkg.appPkg.dependencies || {}),
        ...Object.keys(quasarConf.ctx.pkg.ssrPkg.dependencies || {}),
        'vue/server-renderer',
        'vue/compiler-sfc',
        './render-template.js',
        './quasar.manifest.json',
        './server/server-entry.js'
      )

      if (
        quasarConf.ssr.clientSideRenderingRoutes.length !== 0 ||
        quasarConf.ssr.noPreloadTagRoutes.length !== 0
      ) {
        cfg.resolve.alias['#q-picomatch'] = getPackagePath('picomatch', cliDir)
      }

      if (
        quasarConf.metaConf.hasStore &&
        quasarConf.ssr.manualStoreSerialization !== true
      ) {
        cfg.resolve.alias['#q-serialize-javascript'] = getPackagePath(
          'serialize-javascript',
          cliDir
        )
      }
    }

    cfg.resolve.modules = ['node_modules', appPaths.resolve.ssr('node_modules')]

    return extendRolldownConfig(
      cfg,
      quasarConf.ssr,
      quasarConf.ctx,
      'extendSSRWebserverConf'
    )
  },

  workbox: quasarConf => {
    // returning null for the "inspect" cmd
    // otherwise this fn won't be called if not needed anyway
    if (!quasarConf.ssr.pwa) return null

    return quasarPwaConfig.workbox(quasarConf)
  },

  customSw: quasarConf => {
    if (
      !quasarConf.ssr.pwa ||
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
