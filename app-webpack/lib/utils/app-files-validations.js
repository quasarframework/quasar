const { existsSync, readFileSync } = require('node:fs')
const { relative, sep } = require('node:path')

const { warn } = require('./logger.js')
const { entryPointMarkup, attachMarkup } = require('../utils/html-template.js')

function getRelativePath (appPaths, file) {
  return sep + relative(appPaths.appDir, file)
}

module.exports.appFilesValidations = function appFilesValidations (appPaths, sourceFiles) {
  let relativePath
  const file = appPaths.resolve.app(
    sourceFiles.indexHtmlTemplate
  )

  if (existsSync(file) === false) {
    relativePath = getRelativePath(appPaths, file)
    const oldIndexHtmlFile = appPaths.resolve.src('index.template.html')
    const configuredBanner = sourceFiles.indexHtmlTemplate !== 'index.html'
      ? ' (configured through quasar.config file > sourceFiles > indexHtmlTemplate)'
      : ''

    if (existsSync(oldIndexHtmlFile)) {
      warn(`The file ${ relativePath }${ configuredBanner } is missing but found the deprecated /src/index.template.html one instead.

  Please do the following to fix this:
  1. Move /src/index.template.html to ${ relativePath }
  2. Then replace the following content in it:

    <!-- DO NOT touch the following DIV -->
    <div id="q-app"></div>

    with:

    ${ entryPointMarkup }\n`)
    }
    else {
      warn(`The file ${ relativePath }${ configuredBanner } is missing. Please add it back.\n`)
    }

    return false
  }

  let valid = true
  const content = readFileSync(file, 'utf-8')

  if (content.indexOf(attachMarkup) !== -1) {
    if (relativePath === void 0) {
      relativePath = getRelativePath(appPaths, file)
    }

    warn(`Please remove ${ attachMarkup } from
       ${ relativePath } inside of <body>\n`)
    valid = false
  }

  if (content.indexOf(entryPointMarkup) === -1) {
    if (relativePath === void 0) {
      relativePath = getRelativePath(appPaths, file)
    }

    warn(`Please add ${ entryPointMarkup } to
       ${ relativePath } inside of <body>\n`)
    valid = false
  }

  return valid
}
