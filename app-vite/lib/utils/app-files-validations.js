import fs from 'node:fs'

import { warn } from './logger.js'
import appPaths from '../app-paths.js'
import { entryPointMarkup, attachMarkup } from '../utils/html-template.js'

const file = appPaths.resolve.app('index.html')

export function appFilesValidations () {
  let valid = true

  if (fs.existsSync(file) === false) {
    warn('The file /index.html is missing. Please add it back.\n')
    return false
  }

  const content = fs.readFileSync(file, 'utf-8')

  if (content.indexOf(attachMarkup) !== -1) {
    warn(`Please remove ${ attachMarkup } from
    /index.html inside of <body>\n`)
    valid = false
  }

  if (content.indexOf(entryPointMarkup) === -1) {
    warn(`Please add ${ entryPointMarkup } to
    /index.html inside of <body>\n`)
    valid = false
  }

  return valid
}
