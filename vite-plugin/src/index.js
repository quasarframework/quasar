import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { quasarPath } from './quasar-path.js'
import quasar from './plugin.js'

const transformAssetUrls = JSON.parse(
  readFileSync(join(quasarPath, 'dist/transforms/loader-asset-urls.json'), 'utf-8')
)

export {
  quasar,
  transformAssetUrls
}
