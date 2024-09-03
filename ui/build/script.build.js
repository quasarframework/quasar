process.env.NODE_ENV = 'production'

import { green } from 'kolorist'
import { version, createFolder } from './build.utils.js'

const type = process.argv[ 2 ]
const subtype = process.argv[ 3 ]

/*
  Build:
  * all: pnpm build
  * js:  pnpm build js [fast|types|api|vetur|webtypes|transforms]
  * css: pnpm build css
 */

console.log()

if (!type) {
  await import('./script.clean.js')
}
else if ([ 'js', 'css' ].includes(type) === false) {
  console.error(` Unrecognized build type specified: ${ type }`)
  console.error(' Available: js | css')
  console.error()
  process.exit(1)
}

console.log(` 📦 Building Quasar ${ green(`v${ version }`) }...\n`)

createFolder('dist')

if (!type || type === 'js') {
  createFolder('dist/vetur')
  createFolder('dist/api')
  createFolder('dist/transforms')
  createFolder('dist/lang')
  createFolder('dist/icon-set')
  createFolder('dist/types')
  createFolder('dist/web-types')

  import('./script.build.javascript.js').then(
    ({ buildJavascript }) => buildJavascript(subtype || 'full')
  )
}

if (!type || type === 'css') {
  import('./script.build.css.js').then(
    ({ buildCss }) => buildCss(/* with diff */ type === 'css')
  )
}
