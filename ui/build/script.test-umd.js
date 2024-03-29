const { resolve } = require('node:path')
const fse = require('fs-extra')

const src = resolve(__dirname, '../dist')
const dest = resolve(__dirname, '../playground-umd/dist')

if (!fse.existsSync(src)) {
  console.error('\nERROR: please run "pnpm build" first\n')
  process.exit(0)
}

fse.removeSync(dest)
fse.symlinkSync(src, dest, 'dir')

import('open').then(({ default: open }) => {
  open(
    resolve(__dirname, '../playground-umd/index.umd.html'),
    {
      app: { name: 'google chrome' }
    }
  )
})
