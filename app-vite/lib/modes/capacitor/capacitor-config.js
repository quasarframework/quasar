const path = require('path')

const appPaths = require('../../app-paths')
const { createViteConfig, extendViteConfig } = require('../../config-tools')
const escapeRegexString = require('../../helpers/escape-regex-string')

const { dependencies } = require(appPaths.resolve.capacitor('package.json'))
const target = appPaths.resolve.capacitor('node_modules')

const depsList = Object.keys(dependencies)
const capacitorRE = new RegExp('^(' + depsList.map(escapeRegexString).join('|') + ')')

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

    // we need to set alias as capacitor deps
    // are installed in /src-capacitor and not in root
    // so it breaks Vite
    depsList.forEach(dep => {
      cfg.resolve.alias[ dep ] = path.join(target, dep)
    })

    cfg.plugins.unshift({
      name: 'quasar:resolve-capacitor-deps',
      resolveId (id) {
        if (capacitorRE.test(id)) {
          return path.join(target, id)
        }
      }
    })

    if (quasarConf.ctx.prod === true) {
      cfg.build.outDir = appPaths.resolve.capacitor('www')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}
