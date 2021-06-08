process.env.NODE_ENV = 'production'

const type = process.argv[ 2 ]
const { createFolder } = require('./build.utils')
const { green } = require('chalk')

/*
  Build:
  * all: yarn build     / npm run build
  * js:  yarn build js  / npm run build js
  * css: yarn build css / npm run build css
 */

console.log()

if (!type) {
  require('./script.clean.js')
}

console.log(` 📦 Building Quasar ${ green('v' + require('../package.json').version) }...\n`)

createFolder('dist')

if (!type || type === 'js') {
  createFolder('dist/vetur')
  createFolder('dist/api')
  createFolder('dist/transforms')
  createFolder('dist/lang')
  createFolder('dist/icon-set')
  createFolder('dist/types')
  createFolder('dist/ssr-directives')

  require('./script.build.javascript')()
}

if (!type || type === 'css') {
  require('./script.build.css')()
}
