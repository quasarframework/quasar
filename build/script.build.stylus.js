var
  fs = require('fs'),
  path = require('path'),
  stylus = require('stylus'),
  postcss = require('postcss'),
  shell = require('shelljs'),
  cssnano = require('cssnano'),
  autoprefixer = require('autoprefixer'),
  themes = ['ios', 'mat'],
  nonStandalone = process.argv[2] === 'simple' || process.argv[3] === 'simple',
  version = process.env.VERSION || require('../package.json').version,
  pathList = [path.join(__dirname, '../src/css/')],
  banner =
    '/*!\n' +
    ' * Quasar Framework v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Razvan Stoenescu\n' +
    ' * Released under the MIT License.\n' +
    ' */\n'

/* copy core.variables.styl */
shell.cp(
  path.join(__dirname, '../src/css/core.variables.styl'),
  path.join(__dirname, '../dist')
)

themes.forEach(function (theme) {
  var
    src = 'src/css/' + theme + '.styl',
    deps,
    data

  deps = stylus(readFile(src))
    .set('paths', pathList)
    .deps()

  data = compile([src].concat(deps))

  // write Stylus file
  writeFile('dist/quasar.' + theme + '.styl', data)

  // write compiled CSS file
  stylus(data)
    .set('paths', pathList)
    .render(function (err, css) {
      if (err) {
        console.log()
        logError('Stylus could not compile ' + src.gray + ' file...\n')
        throw err
      }

      // write unprefixed non-standalone version
      writeFile('dist/quasar.' + theme + '.css', css)

      if (nonStandalone) {
        return
      }

      // write auto-prefixed standalone version
      postcss([autoprefixer]).process(css).then(function (result) {
        result.warnings().forEach(function (warn) {
          console.warn(warn.toString())
        })
        writeFile('dist/quasar.' + theme + '.standalone.css', result.css)
        cssnano.process(result.css).then(function (result) {
          writeFile('dist/quasar.' + theme + '.standalone.min.css', result.css)
        })
      })
    })
})

function logError (err) {
  console.error('[Error]'.red, err)
}

function readFile (file) {
  return fs.readFileSync(file, 'utf-8')
}

function writeFile (file, data) {
  fs.writeFile(file, data, 'utf-8', function (err) {
    if (err) {
      logError('Could not write ' + file.gray + ' file...')
      return
    }
    console.log(file.bold + ' ' + getSize(data).gray)
  })
}

function compile (src) {
  var data = banner

  src.forEach(function (file) {
    data += readFile(file) + '\n'
  })

  return data
    // remove imports
    .replace(/@import\s+'[^']+'[\s\r\n]+/g, '')
    // remove comments
    .replace(/(\/\*[\w'-.,`\s\r\n*@]*\*\/)|(\/\/[^\r\n]*)/g, '')
    // remove unnecessary newlines
    .replace(/[\r\n]+/g, '\n')
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}
