
const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const {
  createViteConfig, extendViteConfig,
  createBrowserEsbuildConfig, extendEsbuildConfig
} = require('../../config-tools')

const appPaths = require('../../app-paths')
const contentScriptTemplate = readFileSync(
  appPaths.resolve.cli('templates/bex/entry-content-script.js'),
  'utf-8'
)

function createScript (quasarConf, scriptName, entry) {
  const cfg = createBrowserEsbuildConfig(quasarConf, { cacheSuffix: `bex-${ scriptName }` })

  cfg.entryPoints = [
    entry || appPaths.resolve.app(`.quasar/bex/entry-${ scriptName }.js`)
  ]

  cfg.outfile = join(quasarConf.build.distDir, `${ scriptName }.js`)

  return extendEsbuildConfig(cfg, quasarConf.bex, 'BexScripts')
}

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

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
