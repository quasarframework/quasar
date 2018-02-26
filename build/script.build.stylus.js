var
  path = require('path'),
  stylus = require('stylus'),
  shell = require('shelljs'),
  rtl = require('postcss-rtl'),
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
    .then(code => postcss([ autoprefixer ]).process(code, { from: src }))
    .then(code => {
      code.warnings().forEach(warn => {
        console.warn(warn.toString())
      })
      return code.css
    })
    .then(code => Promise.all([
      generateUMD(theme, code),
      postcss([ rtl({}) ]).process(code, { from: src }).then(code => generateUMD(theme, code.css, '.rtl'))
    ]))
}

function generateUMD (theme, code, ext = '') {
  return buildUtils.writeFile(`dist/umd/quasar.${theme}${ext}.css`, code, true)
    .then(code => cssnano.process(code))
    .then(code => buildUtils.writeFile(`dist/umd/quasar.${theme}${ext}.min.css`, code.css, true))
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
