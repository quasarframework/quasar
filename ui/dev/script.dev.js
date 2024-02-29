const { join, resolve } = require('node:path')
const moduleAlias = require('module-alias')
const fse = require('fs-extra')

if (!fse.existsSync(resolve(__dirname, '../dist'))) {
  console.error('\nERROR: please "yarn build" or "npm run build" in the /ui folder first\n')
  process.exit(0)
}

moduleAlias.addAlias('quasar', join(__dirname, '..'))

// Ensure cwd is set to ui/dev
process.chdir(__dirname)

import('@quasar/app-vite/lib/cmd/dev.js')
