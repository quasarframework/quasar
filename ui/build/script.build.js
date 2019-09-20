process.env.NODE_ENV = 'production'

const
  type = process.argv[2],
  parallel = !type && require('os').cpus().length > 1,
  { join } = require('path'),
  { createFolder } = require('./build.utils'),
  runJob = parallel ? require('child_process').fork : require,
  { green, blue } = require('chalk')

/*
  Build:
  * all: npm run build
  * js:  npm run build js
  * css: npm run build css
 */

console.log()

if (!type) {
  require('./script.clean.js')
}

console.log(` 📦 Building Quasar ${green('v' + require('../package.json').version)}...${parallel ? blue(' [multi-threaded]') : ''}\n`)

createFolder('dist')

if (!type || type === 'js') {
  createFolder('dist/vetur')
  createFolder('dist/api')
  createFolder('dist/babel-transforms')
  createFolder('dist/lang')
  createFolder('dist/icon-set')
  createFolder('dist/types')
  runJob(join(__dirname, './script.build.javascript'))
}
if (!type || type === 'css') {
  runJob(join(__dirname, './script.build.css'))
}
