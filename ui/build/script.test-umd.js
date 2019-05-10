const
  fs = require('fs'),
  { resolve } = require('path'),
  open = require('open'),
  rimraf = require('rimraf').sync

const
  src = resolve(__dirname, '../dist'),
  dest = resolve(__dirname, '../dev-umd/dist')

if (!fs.existsSync(src)) {
  console.error('ERROR: please "yarn build" or "npm run build" first')
  process.exit(0)
}

rimraf(dest)
fs.symlinkSync(src, dest, 'dir')

open(
  resolve(__dirname, '../dev-umd/index.umd.html')
)
