import { green } from 'kolorist'
import { createFolder, enableGzip, version } from './build.utils.js'

const buildArgs = process.argv.slice(2)
const gzipArgIndex = buildArgs.indexOf('--gzip')
if (gzipArgIndex !== -1) {
  await enableGzip()
  buildArgs.splice(gzipArgIndex, 1)
}

const type = buildArgs[0]
const subtype = buildArgs[1]

/*
  Build:
  * all: pnpm build
  * js:  pnpm build js [fast|types|api|webtypes|transforms]
  * css: pnpm build css

  For gzipped output, add --gzip arg
 */

console.log()

if (!type) {
  await import('./script.clean.js')
} else if (!['js', 'css'].includes(type)) {
  console.error(` Unrecognized build type specified: ${type}`)
  console.error(' Available: js | css')
  console.error()
  process.exit(1)
}

console.log(` 📦 Building Quasar ${green(`v${version}`)}...\n`)

createFolder('dist')

if (!type || type === 'js') {
  createFolder('dist/api')
  createFolder('dist/transforms')
  createFolder('dist/lang')
  createFolder('dist/icon-set')
  createFolder('dist/types')
  createFolder('dist/web-types')

  const { buildJavascript } = await import('./script.build.javascript.js')
  await buildJavascript(subtype || 'full')
}

if (!type || type === 'css') {
  const { buildCss } = await import('./script.build.css.js')
  await buildCss(/* with diff */ type === 'css')
}

if (!type) {
  // stamp dist as matching its inputs — the test suites consuming the
  // build verify this (build-stamp.js); partial builds (js/css) leave
  // the previous stamp in place, so they read as stale until a full one
  const { writeBuildStamp } = await import('./build-stamp.js')
  writeBuildStamp()
}
