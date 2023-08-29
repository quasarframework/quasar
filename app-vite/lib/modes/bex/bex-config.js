
import { join } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'

import {
  createViteConfig, extendViteConfig,
  createBrowserEsbuildConfig, extendEsbuildConfig
} from '../../config-tools.js'

import { resolveToCliDir } from '../../utils/cli-runtime.js'

const contentScriptTemplate = readFileSync(
  resolveToCliDir('templates/bex/entry-content-script.js'),
  'utf-8'
)

async function createScript (quasarConf, scriptName, entry) {
  const cfg = await createBrowserEsbuildConfig(quasarConf, { compileId: `browser-bex-${ scriptName }` })

  cfg.entryPoints = [
    entry || quasarConf.ctx.appPaths.resolve.entry(`bex-entry-${ scriptName }.js`)
  ]

  cfg.outfile = join(quasarConf.build.distDir, `${ scriptName }.js`)

  return extendEsbuildConfig(cfg, quasarConf.bex, quasarConf.ctx, 'extendBexScriptsConf')
}

export const quasarBexConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf, { compileId: 'vite-bex' })

    cfg.build.outDir = join(quasarConf.build.distDir, 'www')

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  contentScript: (quasarConf, name) => {
    const entry = quasarConf.ctx.appPaths.resolve.entry(`bex-entry-content-script-${ name }.js`)

    writeFileSync(
      entry,
      contentScriptTemplate.replace('__NAME__', name),
      'utf-8'
    )

    return createScript(quasarConf, name, entry)
  },

  backgroundScript: quasarConf => createScript(quasarConf, 'background'),
  domScript: quasarConf => createScript(quasarConf, 'dom')
}

export const modeConfig = quasarBexConfig
