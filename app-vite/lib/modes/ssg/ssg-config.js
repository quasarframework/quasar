import { join } from 'node:path'
import { mergeConfig as mergeViteConfig } from 'vite'

import {
  createNodeRolldownConfig,
  createViteConfig,
  extendRolldownConfig,
  extendViteConfig
} from '../../config-tools.js'

import { cliPkg } from '../../utils/cli-runtime.js'

import { quasarPwaConfig } from '../pwa/pwa-config.js'
import { quasarVitePluginPwaResources } from '../pwa/pwa-utils.js'
import { quasarRolldownVueShimPlugin } from '../../plugins/rolldown.vue-shim.js'

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export const quasarSsgConfig = {
  viteClient: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-ssg-client',
      shippedToClient: true,
      modeDeps: quasarConf.ssg.pwa
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
        __QUASAR_SSR_PWA__: String(Boolean(quasarConf.ssg.pwa))
      },
      appType: 'custom',
      build: {
        ssrManifest: true,
        outDir: quasarConf.build.distDir
      }
    })

    // also update pwa-config.js & ssr-config.js when changing here
    if (quasarConf.ssg.pwa) {
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
      compileId: 'vite-ssg-server',
      shippedToClient: false,
      modeDeps: quasarConf.ssg.pwa
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
        __QUASAR_SSR_PWA__: String(Boolean(quasarConf.ssg.pwa))
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
        outDir: join(quasarConf.build.distDir, '__ssg__'),
        rolldownOptions: {
          input: ssrEntryFile
        }
      }
    })

    return extendViteConfig(cfg, quasarConf, { isServer: true })
  },

  // returns a Promise
  ssgRenderer: quasarConf => {
    // returning null for the "inspect" cmd
    // otherwise this fn won't be called if not needed anyway
    if (!quasarConf.ctx.prod) return null

    const cfg = createNodeRolldownConfig(quasarConf, {
      compileId: 'ssg-script',
      format: 'esm',
      shippedToClient: false
    })
    const { appPaths } = quasarConf.ctx

    cfg.transform.define = {
      ...cfg.transform.define,
      'import.meta.env.QUASAR_CLIENT': 'false',
      'import.meta.env.QUASAR_SERVER': 'true'
    }

    cfg.input = appPaths.resolve.entry('ssg-script.js')
    cfg.output.file = join(quasarConf.build.distDir, '__ssg__/ssg-script.js')

    cfg.external.push(
      ...Object.keys(quasarConf.ctx.pkg.appPkg.dependencies || {}),
      ...Object.keys(quasarConf.ctx.pkg.ssgPkg.dependencies || {}),
      'vue/server-renderer',
      'vue/compiler-sfc',
      './render-template.js',
      './quasar.manifest.json',
      './server-entry.js'
    )

    cfg.resolve.modules = ['node_modules', appPaths.resolve.ssg('node_modules')]

    cfg.plugins ||= []
    cfg.plugins.push(quasarRolldownVueShimPlugin())

    return extendRolldownConfig(
      cfg,
      quasarConf.ssg,
      quasarConf.ctx,
      'extendSSGRendererConf'
    )
  },

  workbox: quasarConf => {
    // returning null for the "inspect" cmd
    // otherwise this fn won't be called if not needed anyway
    if (!quasarConf.ssg.pwa) return null

    return quasarPwaConfig.workbox(quasarConf)
  },

  customSw: quasarConf => {
    if (
      !quasarConf.ssg.pwa ||
      quasarConf.pwa.workboxMode !== 'InjectManifest'
    ) {
      // returning null for the "inspect" cmd
      // otherwise this fn won't be called if not needed anyway
      return null
    }

    return quasarPwaConfig.customSw(quasarConf)
  }
}

export const modeConfig = quasarSsgConfig
