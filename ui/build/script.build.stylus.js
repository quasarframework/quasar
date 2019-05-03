const
  path = require('path'),
  stylus = require('stylus'),
  rtl = require('postcss-rtl'),
  postcss = require('postcss'),
  cssnano = require('cssnano'),
  autoprefixer = require('autoprefixer'),
  buildConf = require('./build.conf'),
  buildUtils = require('./build.utils'),
  pathList = [path.join(__dirname, '../src/css/')]

Promise
  .all([
    generateBase(),
    generateAddon()
  ])
  .catch(e => {
    console.error(e)
  })

function generateBase () {
  const src = `src/css/index.styl`
  const deps = stylus(buildUtils.readFile(src))
    .set('paths', pathList)
    .deps()

  return generateFiles({
    sources: [src].concat(deps),
    styl: true
  })
}

function generateAddon () {
  return generateFiles({
    sources: [
      'src/css/variables.styl',
      'src/css/flex-addon.styl'
    ],
    name: '.addon'
  })
}

function generateFiles ({ sources, name = '', styl }) {
  return prepareStylus(sources)
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
    .then(code => cssnano.process(code, { from: void 0 }))
    .then(code => buildUtils.writeFile(`dist/quasar${name}${ext}.min.css`, code.css, true))
}

function prepareStylus (src) {
  return new Promise((resolve, reject) => {
    let code = buildConf.banner

    src.forEach(function (file) {
      code += buildUtils.readFile(file) + '\n'
    })

    code = code
      // remove imports
      .replace(/@import\s+'[^']+'[\s\r\n]+/g, '')
      // remove comments
      .replace(/(\/\*[\w'-.,`\s\r\n*@]*\*\/)|(\/\/[^\r\n]*)/g, '')
      // remove unnecessary newlines
      .replace(/[\r\n]+/g, '\n')

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
