import glob from 'fast-glob'
import fse from 'fs-extra'

import { rootFolder, resolveToRoot, logError, writeFileIfChanged } from './build.utils.js'

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

export function generate () {
  const languages = []
  const promises = []
  try {
    glob.sync('lang/*.js', { cwd: rootFolder, absolute: true })
      .forEach(file => {
        const content = fse.readFileSync(file, 'utf-8')
        languages.push({
          isoName: parse('isoName', content),
          nativeName: parse('nativeName', content)
        })
      })

    const langFile = resolveToRoot('lang/index.json')
    const quasarLangIndex = JSON.stringify(languages)

    promises.push(
      writeFileIfChanged(langFile, quasarLangIndex)
    )

    return Promise.all(promises).then(() => languages)
  }
  catch (err) {
    logError('build.lang.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
