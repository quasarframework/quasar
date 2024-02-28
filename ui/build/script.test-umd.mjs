import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { existsSync, symlinkSync } from 'node:fs'
import { sync as rimrafSync } from 'rimraf'

const thisFolder = fileURLToPath(new URL('.', import.meta.url))

const src = resolve(thisFolder, '../dist')
const dest = resolve(thisFolder, '../dev-umd/dist')

if (!existsSync(src)) {
  console.error('ERROR: please "yarn build" or "npm run build" first')
  process.exit(0)
}

rimrafSync(dest)
symlinkSync(src, dest, 'dir')

import('open').then(({ default: open }) => {
  open(
    resolve(thisFolder, '../dev-umd/index.umd.html'),
    {
      app: { name: 'google chrome' }
    }
  )
})
