
const { join } = require('path')

const {
  createViteConfig, extendViteConfig,
  createBrowserEsbuildConfig, extendEsbuildConfig
} = require('../../config-tools')

const appPaths = require('../../app-paths')

function createScript (quasarConf, scriptName, bexFolder) {
  const cfg = createBrowserEsbuildConfig(quasarConf, { cacheSuffix: `bex-${ scriptName }` })

  cfg.entryPoints = [
    appPaths.resolve.app(`.quasar/bex/${ bexFolder }/${ scriptName }.js`)
  ]

  cfg.outfile = appPaths.resolve.bex(`www/bex-${ scriptName }.js`)

  return extendEsbuildConfig(cfg, quasarConf.bex, 'Scripts')
}

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

    cfg.build.outDir = appPaths.resolve.bex('www')

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  backgroundScript: quasarConf => createScript(quasarConf, 'background', 'background'),
  contentScript: quasarConf => createScript(quasarConf, 'content-script', 'content'),
  domScript: quasarConf => createScript(quasarConf, 'dom-script', 'content')
}
