import { join } from 'node:path'

import { mergeConfig as mergeViteConfig } from 'vite'

import {
  createBrowserRolldownConfig,
  createViteConfig,
  extendRolldownConfig,
  extendViteConfig
} from '../../config-tools.js'

function generateDefaultEntry(quasarConf) {
  return {
    name: 'file', // or subdir/file (regardless of OS)
    from: quasarConf.ctx.appPaths.resolve.bex('file.js'),
    to: join(quasarConf.build.distDir, 'file.js')
  }
}

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export const quasarBexConfig = {
  vite: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-bex',
      shippedToClient: true
    })

    cfg = mergeViteConfig(cfg, {
      server: {
        // Vite will fail to infer the @vite/client
        // configuration for the client (will guess hostname and protocol wrong,
        // due to it being chrome-extension://<runtime-id>/) and it will output an error
        // that Websocket couldn't connect then: "Direct websocket connection fallback."
        // --- So we avoid that by enforcing the correct values:
        ws: {
          protocol: 'ws',
          host: 'localhost',
          port: quasarConf.devServer.port
        }
      }
    })

    if (quasarConf.ctx.prod || quasarConf.ctx.target.firefox) {
      cfg.build.outDir = join(quasarConf.build.distDir, 'www')
    } else {
      // is dev for chrome
      cfg.plugins.push({
        name: 'quasar:bex:ws',
        enforce: 'post',
        configResolved(viteConfig) {
          // Vite 6.0.9+ compat; we need the token!
          // No other way to pass it to Vite than through a plugin with configResolved
          viteConfig.webSocketToken = quasarConf.metaConf.bexWsToken
        }
      })
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  bexScript(quasarConf, entry = generateDefaultEntry(quasarConf)) {
    const cfg = createBrowserRolldownConfig(quasarConf, {
      shippedToClient: true
    })

    cfg.transform.define = {
      ...cfg.transform.define,
      'import.meta.env.QUASAR_BEX_SCRIPT_NAME': `"${entry.name}"`
    }

    cfg.external = Object.keys(quasarConf.ctx.pkg.bexPkg.dependencies || {})

    if (quasarConf.ctx.dev) {
      // Vite 6.0.9+ compat; we need the token!
      Object.assign(cfg.transform.define, {
        'import.meta.env.QUASAR_BEX_WS_TOKEN': `"${quasarConf.metaConf.bexWsToken}"`,
        'import.meta.env.QUASAR_BEX_SERVER_PORT': String(
          quasarConf.devServer.port || 0
        )
      })
    }

    cfg.input = entry.from
    cfg.output.file = entry.to

    return extendRolldownConfig(
      cfg,
      quasarConf.bex,
      quasarConf.ctx,
      'extendBexScriptsConf'
    )
  }
}

export const modeConfig = quasarBexConfig
