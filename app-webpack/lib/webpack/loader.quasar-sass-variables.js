const cssVariables = require('../helpers/css-variables')

const ext = cssVariables.appFile.sass
  ? 'sass'
  : (cssVariables.appFile.scss ? 'scss' : false)

const prefix = ext !== false
  ? `@import '~src/css/quasar.variables.${ext}', 'quasar/src/css/variables.sass'\n`
  : `@import 'quasar/src/css/variables.sass'\n`

module.exports = function (content) {
  if (content.indexOf('$') !== -1) {
    let useIndex = Math.max(
      content.lastIndexOf('@use '),
      content.lastIndexOf('@forward ')
    )

    if (useIndex === -1) {
      return prefix + content
    }

    const newLineIndex = content.indexOf('\n', useIndex) + 1
    return content.substring(0, newLineIndex) + prefix + content.substring(newLineIndex)
  }

  return content
}
