process.env.NODE_ENV = 'production'

const type = process.argv[ 2 ]
const subtype = process.argv[ 3 ]
const { createFolder } = require('./build.utils')
const { green } = require('chalk')

/*
  Build:
  * all: pnpm build
  * js:  pnpm build js [fast|types|api|vetur|webtypes|transforms]
  * css: pnpm build css
 */

console.log()

if (!type) {
  require('./script.clean.js')
}
else if ([ 'js', 'css' ].includes(type) === false) {
  console.error(` Unrecognized build type specified: ${ type }`)
  console.error(' Available: js | css')
  console.error()
  process.exit(1)
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
  createFolder('dist/web-types')

  require('./script.build.javascript')(subtype || 'full')
}

if (!type || type === 'css') {
  require('./script.build.css')(/* with diff */ type === 'css')
}
