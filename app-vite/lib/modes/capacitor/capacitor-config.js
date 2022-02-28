const path = require('path')

const appPaths = require('../../app-paths')
const { createViteConfig, extendViteConfig } = require('../../config-tools')

const { dependencies } = require(appPaths.resolve.capacitor('package.json'))
const target = appPaths.resolve.capacitor('node_modules')

const depsList = Object.keys(dependencies)

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

    // we need to set alias as capacitor deps
    // are installed in /src-capacitor and not in root
    // so it breaks Vite
    depsList.forEach(dep => {
      cfg.resolve.alias[dep] = path.join(target, dep)
    })

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}
