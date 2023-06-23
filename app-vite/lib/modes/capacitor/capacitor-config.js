import path from 'node:path'
import { readFileSync } from 'node:fs'

import appPaths from '../../app-paths.js'
import { createViteConfig, extendViteConfig } from '../../config-tools.js'
import { escapeRegexString } from '../../utils/escape-regex-string.js'

const { dependencies } = JSON.parse(
  readFileSync(appPaths.resolve.capacitor('package.json'), 'utf-8')
)

const target = appPaths.resolve.capacitor('node_modules')

const depsList = Object.keys(dependencies)
const capacitorRE = new RegExp('^(' + depsList.map(escapeRegexString).join('|') + ')')

export const quasarCapacitorConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf)

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

export const modeConfig = quasarCapacitorConfig
