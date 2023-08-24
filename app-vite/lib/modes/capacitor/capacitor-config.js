import { join } from 'node:path'
import { readFileSync } from 'node:fs'

import { createViteConfig, extendViteConfig } from '../../config-tools.js'
import { escapeRegexString } from '../../utils/escape-regex-string.js'

export const quasarCapacitorConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf, { compileId: 'vite-capacitor' })
    const { appPaths, cacheProxy } = quasarConf.ctx

    const { capacitorRE, target, injectAliases } = cacheProxy.getRuntime('runtimeCapacitorConfig', () => {
      const { dependencies } = JSON.parse(
        readFileSync(appPaths.resolve.capacitor('package.json'), 'utf-8')
      )

      const target = appPaths.resolve.capacitor('node_modules')

      const depsList = Object.keys(dependencies)
      const capacitorRE = new RegExp('^(' + depsList.map(escapeRegexString).join('|') + ')')

      return {
        capacitorRE,
        target,
        injectAliases (alias) {
          // we need to set alias as capacitor deps
          // are installed in /src-capacitor and not in root
          // so it breaks Vite
          depsList.forEach(dep => {
            alias[ dep ] = join(target, dep)
          })
        }
      }
    })

    injectAliases(cfg.resolve.alias)

    cfg.plugins.unshift({
      name: 'quasar:resolve-capacitor-deps',
      resolveId (id) {
        if (capacitorRE.test(id)) {
          return join(target, id)
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
