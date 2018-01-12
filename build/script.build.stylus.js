var
  path = require('path'),
  stylus = require('stylus'),
  shell = require('shelljs'),
  rtlcss = require('rtlcss'),
  postcss = require('postcss'),
  cssnano = require('cssnano'),
  autoprefixer = require('autoprefixer'),
  buildConf = require('./build.conf'),
  buildUtils = require('./build.utils'),
  pathList = [path.join(__dirname, '../src/css/')]

/* copy core.variables.styl */
shell.cp(
  path.join(__dirname, '../src/css/core.variables.styl'),
  path.join(__dirname, '../dist')
)
build(buildConf.themes)

function build (themes) {
  Promise
    .all(themes.map(generateTheme))
    .catch(e => {
      console.error(e)
    })
}

function generateTheme (theme) {
  const src = `src/css/${theme}.styl`
  const deps = stylus(buildUtils.readFile(src))
    .set('paths', pathList)
    .deps()

  return prepareStylus([src].concat(deps))
    .then(code => buildUtils.writeFile(`dist/quasar.${theme}.styl`, code))
    .then(code => compileStylus(code))
    .then(code => postcss([autoprefixer]).process(code))
    .then(code => {
      code.warnings().forEach(warn => {
        console.warn(warn.toString())
      })
      return new Promise((resolve, reject) => resolve(code.css))
    })
    .then(code => Promise.all([
      generateStandalone(theme, code),
      generateStandalone(theme, rtlcss.process(code), '.rtl')
    ]))
}

function generateStandalone (theme, code, ext = '') {
  return buildUtils.writeFile(`dist/quasar.${theme}${ext}.css`, code, true)
    .then(code => cssnano.process(code))
    .then(code => buildUtils.writeFile(`dist/quasar.${theme}${ext}.min.css`, code.css, true))
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
