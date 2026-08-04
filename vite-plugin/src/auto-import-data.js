import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { quasarPath } from './quasar-path.js'

let autoImportData

export function loadAutoImportData() {
  if (autoImportData === void 0) {
    try {
      autoImportData = JSON.parse(
        readFileSync(
          join(quasarPath, 'dist/transforms/auto-import.json'),
          'utf8'
        )
      )
    } catch (err) {
      throw new Error('Failed to load Quasar auto-import data', { cause: err })
    }
  }

  return autoImportData
}
