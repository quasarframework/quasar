const glob = require('glob')
const path = require('path')
const fs = require('fs')

const { logError, writeFile } = require('./build.utils')

const
  root = path.resolve(__dirname, '..'),
  resolve = file => path.resolve(root, file)

function parse (prop, txt) {
  const
    propIndex = txt.indexOf(prop),
    startIndex = txt.indexOf('\'', propIndex) + 1

  let stopIndex = txt.indexOf('\'', startIndex)

  while (txt.charAt(stopIndex - 1) === '\\') {
    stopIndex = txt.indexOf('\'', stopIndex + 1)
  }

  return txt.substring(startIndex, stopIndex).replace('\\', '')
}

module.exports.generate = function () {
  const languages = []

  try {
    glob.sync(resolve('lang/*.js'))
      .filter(file => file.endsWith('.js'))
      .forEach(file => {
        const content = fs.readFileSync(file, 'utf-8')
        const isoName = parse('isoName', content)
        const nativeName = parse('nativeName', content)
        languages.push({ isoName, nativeName })
      })

    const
      langFile = resolve('lang/index.json'),
      newLangJson = JSON.stringify(languages, null, 2)

    let oldLangJson = ''

    try {
      oldLangJson = fs.readFileSync(langFile, 'utf-8')
    }
    catch (e) {}

    return newLangJson.split(/[\n\r]+/).join('\n') !== oldLangJson.split(/[\n\r]+/).join('\n')
      ? writeFile(langFile, newLangJson)
      : Promise.resolve()
  }
  catch (err) {
    logError('build.lang-index.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
