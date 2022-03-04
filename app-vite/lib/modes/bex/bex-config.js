
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

  cfg.outfile = join(
    quasarConf.ctx.dev === true ? appPaths.bexDir : quasarConf.build.distDir,
    `www/bex-${ scriptName }.js`
  )

  return extendEsbuildConfig(cfg, quasarConf.bex, 'Scripts')
}

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

    const rootPath = quasarConf.ctx.dev === true ? appPaths.bexDir : quasarConf.build.distDir
    cfg.build.outDir = join(rootPath, 'www')

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  backgroundScript: quasarConf => createScript(quasarConf, 'background', 'background'),
  contentScript: quasarConf => createScript(quasarConf, 'content-script', 'content'),
  domScript: quasarConf => createScript(quasarConf, 'dom-script', 'content')
}
