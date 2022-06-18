const fs = require('fs')
const { resolve } = require('path')
const open = require('open')
const rimraf = require('rimraf').sync

const src = resolve(__dirname, '../dist')
const dest = resolve(__dirname, '../dev-umd/dist')

if (!fs.existsSync(src)) {
  console.error('ERROR: please "yarn build" or "npm run build" first')
  process.exit(0)
}

rimraf(dest)
fs.symlinkSync(src, dest, 'dir')

open(
  resolve(__dirname, '../dev-umd/index.umd.html')
)
