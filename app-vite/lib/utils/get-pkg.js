import { existsSync, readFileSync, statSync } from 'node:fs'
import { parseJSON } from 'confbox'

import { warning } from './logger.js'
import { getPackageJson } from '../utils/get-package-json.js'

/**
 * Only Quasar CLI modes which install deps in their own
 * /src-<mode>/package.json, so that they can be injected
 * into the context and accessed via ctx.pkg
 */
const modesList = ['bex', 'ssr', 'ssg', 'pwa', 'electron', 'capacitor']

function injectPkg(acc, propName, pkgPath) {
  let pkg = {}
  let lastModePkgModifiedTime = 0

  Object.defineProperty(acc, propName, {
    get: () => {
      if (!existsSync(pkgPath)) return {}

      const { mtime } = statSync(pkgPath)

      if (mtime !== lastModePkgModifiedTime) {
        lastModePkgModifiedTime = mtime
        try {
          // This may get updated and written, so use parseJSON to preserve formatting
          pkg = parseJSON(readFileSync(pkgPath, 'utf8'))
        } catch (err) {
          warning(`Could not parse ${pkgPath}. The file is malformed:`)
          console.error(err)
        }
      }

      return pkg
    }
  })
}

/**
 * @param {import('../../types/app-paths').QuasarAppPaths} appPaths
 *
 * @returns {import('../../types/configuration/context').InternalQuasarContext['pkg']}
 */
export function getPkg(appPaths) {
  const { appDir, cliDir } = appPaths

  const acc = {
    quasarPkg: getPackageJson('quasar', appDir),
    vitePkg: getPackageJson('vite', appDir) || getPackageJson('vite', cliDir)
  }

  injectPkg(acc, 'appPkg', appPaths.resolve.app('package.json'))

  modesList.forEach(modeName => {
    injectPkg(
      acc,
      `${modeName}Pkg`,
      appPaths.resolve.app(`src-${modeName}/package.json`)
    )
  })

  return acc
}
