const path = require('node:path')

const appPaths = require('../../app-paths.js')
const { createViteConfig, extendViteConfig } = require('../../config-tools.js')
const { escapeRegexString } = require('../../utils/escape-regex-string.js')

const { dependencies } = require(appPaths.resolve.capacitor('package.json'))
const target = appPaths.resolve.capacitor('node_modules')

const depsList = Object.keys(dependencies)
const capacitorRE = new RegExp('^(' + depsList.map(escapeRegexString).join('|') + ')')

module.exports.quasarCapacitorConfig = {
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

module.exports.modeConfig = module.exports.quasarCapacitorConfig
