import { join } from 'node:path'

import { mergeConfig as mergeViteConfig } from 'vite'

import {
  createViteConfig,
  extendViteConfig,
  createBrowserEsbuildConfig,
  extendEsbuildConfig
} from '../../config-tools.js'

import { getBuildSystemDefine } from '../../utils/env.js'

function generateDefaultEntry(quasarConf) {
  return {
    name: 'file', // or subdir/file (regardless of OS)
    from: quasarConf.ctx.appPaths.resolve.bex('file.js'),
    to: join(quasarConf.build.distDir, 'file.js')
  }
}

export const quasarBexConfig = {
  vite: async quasarConf => {
    let cfg = await createViteConfig(quasarConf, { compileId: 'vite-bex' })

    cfg = mergeViteConfig(cfg, {
      server: {
        // Vite will fail to infer the @vite/client
        // configuration for the client (will guess hostname and protocol wrong,
        // due to it being chrome-extension://<runtime-id>/) and it will output an error
        // that Websocket couldn't connect then: "Direct websocket connection fallback."
        // --- So we avoid that by enforcing the correct values:
        hmr: {
          protocol: 'ws',
          host: 'localhost',
          port: quasarConf.devServer.port
        }
      }
    })

    if (quasarConf.ctx.prod === true || quasarConf.ctx.target.firefox) {
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
    const cfg = createBrowserEsbuildConfig(quasarConf, {
      compileId: `bex:script:${entry.name}`
    })
    const buildEnv = {
      __QUASAR_BEX_SCRIPT_NAME__: entry.name
    }

    if (quasarConf.ctx.dev) {
      // Vite 6.0.9+ compat; we need the token!
      buildEnv.__QUASAR_BEX_WS_TOKEN__ = quasarConf.metaConf.bexWsToken
      buildEnv.__QUASAR_BEX_SERVER_PORT__ = quasarConf.devServer.port || 0
    }

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({ buildEnv })
    }

    cfg.entryPoints = [entry.from]
    cfg.outfile = entry.to

    return extendEsbuildConfig(
      cfg,
      quasarConf.bex,
      quasarConf.ctx,
      'extendBexScriptsConf'
    )
  }
}

export const modeConfig = quasarBexConfig
