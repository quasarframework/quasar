const { resolve } = require('node:path')
const fse = require('fs-extra')

const src = resolve(__dirname, '../dist')
const dest = resolve(__dirname, '../dev-umd/dist')

if (!fse.existsSync(src)) {
  console.error('\nERROR: please "yarn build" or "npm run build" first\n')
  process.exit(0)
}

fse.removeSync(dest)
fse.symlinkSync(src, dest, 'dir')

import('open').then(({ default: open }) => {
  open(
    resolve(__dirname, '../dev-umd/index.umd.html'),
    {
      app: { name: 'google chrome' }
    }
  )
})
