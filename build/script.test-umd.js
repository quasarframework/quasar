const
  fs = require('fs'),
  { resolve } = require('path'),
  sym = require('sym'),
  opn = require('opn')

const
  src = resolve(__dirname, '../dist'),
  dest = resolve(__dirname, '../dev-umd/dist')
  
if (!fs.existsSync(src)) {
  console.error('ERROR: please "npm run build" first')
  process.exit(0)
}

if (!fs.existsSync(dest)) {
  sym(src, dest, 'dir')
}

opn(
  resolve(__dirname, '../dev-umd/index.mat.umd.html'),
  { wait: false }
)
