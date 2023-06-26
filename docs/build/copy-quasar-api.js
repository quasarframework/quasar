// cp node_modules/quasar/dist/api/* public/quasar-api/

import { join } from 'node:path'
import fse from 'fs-extra'

const rootFolder = new URL('..', import.meta.url).pathname

const sourceList = [
  join(rootFolder, 'node_modules/quasar/dist/api'),
  join(rootFolder, '../ui/dist/api')
]

function getSource () {
  for (const source of sourceList) {
    if (fse.existsSync(source)) {
      return source
    }
  }

  console.error('Quasar API folder not found. Please build Quasar UI first.')
  process.exit(1)
}

const source = getSource()

console.log(rootFolder)
fse.copySync(source, join(rootFolder, 'public/quasar-api'))
