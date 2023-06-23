
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

import { fatal } from './logger.js'
import { getPackage } from './get-package.js'
import appPaths from '../app-paths.js'

const require = createRequire(import.meta.url)

export async function getApi (item) {
  try {
    const api = await getPackage(`quasar/dist/api/${ item }.json`)
    if (api !== void 0) {
      return { api }
    }
  }
  catch (e) {}

  const { extensionJson } = await import('../app-extension/extension-json.js')
  const extensions = Object.keys(extensionJson.getList())

  if (extensions.length > 0) {
    const { Extension } = await import('../app-extension/Extension.js')

    for (const ext of extensions) {
      const instance = new Extension(ext)
      const hooks = await instance.run({})

      if (hooks.describeApi !== void 0 && hooks.describeApi[ item ]) {
        let file
        const {
          callerPath,
          relativePath
        } = hooks.describeApi[ item ]

        if (relativePath.charAt(0) === '~') {
          try {
            file = relativePath.slice(1)
            file = require.resolve(
              file, {
                paths: [ callerPath, appPaths.appDir ]
              }
            )
          }
          catch (_) {
            fatal(`Extension(${ instance.extId }): registerDescribeApi - there is no package "${ file }" installed`)
          }
        }
        else {
          file = path.resolve(callerPath, relativePath)

          if (!fs.existsSync(file)) {
            fatal(`Extension(${ instance.extId }): registerDescribeApi - there is no file at ${ file }`)
          }
        }

        try {
          return {
            api: JSON.parse(
              fs.readFileSync(file, 'utf-8')
            ),
            supplier: instance.extId
          }
        }
        catch (e) {
          fatal(`Extension(${ instance.extId }): Malformed API file at ${ file }`)
        }
      }
    }
  }

  fatal(`No API found for requested "${ item }"`)
}
