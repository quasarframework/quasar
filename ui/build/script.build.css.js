const path = require('path')
const stylus = require('stylus')
const sass = require('sass')
const rtl = require('postcss-rtl')
const postcss = require('postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const buildConf = require('./build.conf')
const buildUtils = require('./build.utils')
const pathList = [ path.join(__dirname, '../src/css/') ]

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

function generateSassFile (source, destination) {
  const src = path.join(__dirname, '..', source)
  const dest = path.join(__dirname, '..', destination)

  // We do 2 things here: validate and build import graph
  const result = sass.renderSync({ file: src })

  return getConcatenatedContent(result.stats.includedFiles)
    .then(code => buildUtils.writeFile(dest, code))
    .then(() => validateSassFile(destination))
}

function validateSassFile (src) {
  const file = path.join(__dirname, '..', src)

  return new Promise((resolve, reject) => {
    sass.render({ file }, (err) => {
      if (err) {
        reject(err)
        return
      }

      resolve(true)
    })
  })
}

function generateStylusBase (src) {
  // We do 2 things here: validate and get import graph
  const deps = stylus(buildUtils.readFile(src))
    .set('paths', pathList)
    .deps()

  return generateStylusFiles({
    sources: [src].concat(deps),
    styl: true
  })
}

function generateStylusAddon () {
  return generateStylusFiles({
    sources: [
      'src/css/variables.styl',
      'src/css/flex-addon.styl'
    ],
    name: '.addon'
  })
}

function generateStylusFiles ({ sources, name = '', styl }) {
  return getConcatenatedContent(sources)
    .then(code => {
      if (styl) { return buildUtils.writeFile(`dist/quasar${name}.styl`, code) }
      else { return code }
    })
    .then(code => compileStylus(code))
    .then(code => postcss([ autoprefixer ]).process(code, { from: void 0 }))
    .then(code => {
      code.warnings().forEach(warn => {
        console.warn(warn.toString())
      })
      return code.css
    })
    .then(code => Promise.all([
      generateUMD(name, code),
      postcss([ rtl({}) ]).process(code, { from: void 0 }).then(code => generateUMD(name, code.css, '.rtl'))
    ]))
}

function generateUMD (name, code, ext = '') {
  return buildUtils.writeFile(`dist/quasar${name}${ext}.css`, code, true)
    .then(code => nano.process(code, { from: void 0 }))
    .then(code => buildUtils.writeFile(`dist/quasar${name}${ext}.min.css`, code.css, true))
}

function getConcatenatedContent (src, noBanner) {
  return new Promise((resolve, reject) => {
    let code = noBanner !== true
      ? buildConf.banner
      : ''

    src.forEach(function (file) {
      code += buildUtils.readFile(file) + '\n'
    })

    code = code
      // remove imports
      .replace(/@import\s+'[^']+'[\s\r\n]+/g, '')
      // remove comments
      .replace(/(\/\*[\w'-.,`\s\r\n*@]*\*\/)|(\/\/[^\r\n]*)/g, '')
      // remove unnecessary newlines
      .replace(/[\r\n]+/g, '\r\n')

    resolve(code)
  })
}

function compileStylus (code) {
  return new Promise((resolve, reject) => {
    stylus(code)
      .set('paths', pathList)
      .render((err, code) => {
        if (err) {
          console.log()
          reject(err)
        }
        else {
          resolve(code)
        }
      })
  })
}

module.exports = function () {
  Promise
    .all([
      generateStylusBase('src/css/index.styl'),
      generateStylusAddon(),

      generateSassFile('src/css/index.sass', 'dist/quasar.sass'),
      validateSassFile('src/css/flex-addon.sass')
    ])
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
}
