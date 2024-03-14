const { resolve } = require('node:path')
const fse = require('fs-extra')

if (!fse.existsSync(resolve(__dirname, '../dist'))) {
  console.error('\nERROR: please run "pnpm build" in the /ui folder first\n')
  process.exit(0)
}

// Ensure cwd is set to ui/dev
process.chdir(__dirname)

import('@quasar/app-vite/lib/cmd/build.js')
