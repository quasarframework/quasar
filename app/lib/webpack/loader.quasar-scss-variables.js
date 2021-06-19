const cssVariables = require('../helpers/css-variables')

const ext = cssVariables.appFile.scss
  ? 'scss'
  : (cssVariables.appFile.sass ? 'sass' : false)

const prefix = ext !== false
  ? `@import '~src/css/quasar.variables.${ext}', 'quasar/src/css/variables.sass';\n`
  : `@import 'quasar/src/css/variables.sass';\n`

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
    return content.substr(0, newLineIndex) + prefix + content.substr(newLineIndex)
  }

  return content
}
