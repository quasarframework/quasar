const path = require('path')
const appPaths = require('../../app-paths')

const createViteConfig = require('../../create-vite-config')
const parseEnv = require('../../parse-env')

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)
    const rootPath = quasarConf.ctx.dev ? appPaths.bexDir : quasarConf.build.distDir

    cfg.outDir = path.join(rootPath, 'www')

    return cfg
  },

  main: quasarConf => {
    const outdir = path.join(
      quasarConf.ctx.dev ? appPaths.bexDir : quasarConf.build.distDir,
      'www'
    )

    return {
      entryPoints: [
        appPaths.resolve.app('.quasar/bex/background/background.js'),
        appPaths.resolve.app('.quasar/bex/content/content-script.js'),
        appPaths.resolve.app('.quasar/bex/content/dom-script.js')
      ],
      outdir,
      bundle: true,
      sourcemap: quasarConf.metaConf.debugging ? 'inline' : false,
      // minify: false,
      define: parseEnv(quasarConf.build.env, quasarConf.build.rawDefine)
    }
  }
}
