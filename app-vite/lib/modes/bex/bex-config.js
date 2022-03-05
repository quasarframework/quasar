
const { join } = require('path')

const {
  createViteConfig, extendViteConfig,
  createBrowserEsbuildConfig, extendEsbuildConfig
} = require('../../config-tools')

const appPaths = require('../../app-paths')

function createScript (quasarConf, scriptName) {
  const cfg = createBrowserEsbuildConfig(quasarConf, { cacheSuffix: `bex-${ scriptName }` })

  cfg.entryPoints = [
    appPaths.resolve.app(`.quasar/bex/entry-${ scriptName }.js`)
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
  contentScript: quasarConf => createScript(quasarConf, 'content-script'),
  domScript: quasarConf => createScript(quasarConf, 'dom')
}
