import { globSync } from 'tinyglobby'

import {
  rootFolder,
  resolveToRoot,
  logError,
  writeFileIfChanged
} from './build.utils.js'

export async function generate() {
  const languages = []
  try {
    const fileList = globSync('lang/*.js', { cwd: rootFolder, absolute: true })

    for (const file of fileList) {
      const content = await import(file).then(module => module.default)
      languages.push({
        isoName: content.isoName,
        nativeName: content.nativeName
      })
    }

    const langFile = resolveToRoot('lang/index.json')
    const quasarLangIndex = JSON.stringify(languages)

    await writeFileIfChanged(langFile, quasarLangIndex)

    return languages
  } catch (err) {
    logError('build.lang.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
