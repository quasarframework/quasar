import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { quasarPath } from './quasar-path.js'

export { default as quasar } from './plugin.js'

export const transformAssetUrls = JSON.parse(
  readFileSync(
    join(quasarPath, 'dist/transforms/loader-asset-urls.json'),
    'utf8'
  )
)
