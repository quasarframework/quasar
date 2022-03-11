const path = require('path')
const sass = require('sass')
const postcss = require('postcss')
const cssnano = require('cssnano')
const rtl = require('rtlcss')
const autoprefixer = require('autoprefixer')

const buildConf = require('./config')
const buildUtils = require('./utils')

const postCssCompiler = postcss([ autoprefixer ])
const postCssRtlCompiler = postcss([ rtl({}) ])

const nano = postcss([
  cssnano({
    preset: ['default', {
      mergeLonghand: false,
      convertValues: false,
      cssDeclarationSorter: false,
      reduceTransforms: false
    }]
  })
])

Promise
  .all([
    generate('src/index.sass', `dist/index`)
  ])
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

/**
 * Helpers
 */

function resolve (_path) {
  return path.resolve(__dirname, '..', _path)
}

function generate (src, dest) {
  src = resolve(src)
  dest = resolve(dest)

  return new Promise((resolve, reject) => {
    sass.render({ file: src, includePaths: ['node_modules'] }, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      resolve(result.css)
    })
  })
  .then(code => buildConf.banner + code)
  .then(code => postCssCompiler.process(code, { from: void 0 }))
  .then(code => {
    code.warnings().forEach(warn => {
      console.warn(warn.toString())
    })
    return code.css
  })
  .then(code => Promise.all([
    generateUMD(dest, code),
    postCssRtlCompiler.process(code, { from: void 0 })
      .then(code => generateUMD(dest, code.css, '.rtl'))
  ]))
}

function generateUMD (dest, code, ext = '') {
  return buildUtils.writeFile(`${dest}${ext}.css`, code, true)
    .then(code => nano.process(code, { from: void 0 }))
    .then(code => buildUtils.writeFile(`${dest}${ext}.min.css`, code.css, true))
}
