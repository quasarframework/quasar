
import { join } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'

import {
  createViteConfig, extendViteConfig,
  createBrowserEsbuildConfig, extendEsbuildConfig
} from '../../config-tools.js'

import appPaths from '../../app-paths.js'
const contentScriptTemplate = readFileSync(
  appPaths.resolve.cli('templates/bex/entry-content-script.js'),
  'utf-8'
)

async function createScript (quasarConf, scriptName, entry) {
  const cfg = await createBrowserEsbuildConfig(quasarConf, { cacheSuffix: `bex-${ scriptName }` })

  cfg.entryPoints = [
    entry || appPaths.resolve.app(`.quasar/bex/entry-${ scriptName }.js`)
  ]

  cfg.outfile = join(quasarConf.build.distDir, `${ scriptName }.js`)

  return extendEsbuildConfig(cfg, quasarConf.bex, 'BexScripts')
}

export const quasarBexConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf)

    cfg.build.outDir = join(quasarConf.build.distDir, 'www')

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  backgroundScript: quasarConf => createScript(quasarConf, 'background'),
  contentScript: (quasarConf, name) => {
    const entry = appPaths.resolve.app(`.quasar/bex/entry-content-script-${ name }.js`)

    writeFileSync(
      entry,
      contentScriptTemplate.replace('__NAME__', name),
      'utf-8'
    )

    return createScript(quasarConf, name, entry)
  },
  domScript: quasarConf => createScript(quasarConf, 'dom')
}

export const modeConfig = quasarBexConfig
