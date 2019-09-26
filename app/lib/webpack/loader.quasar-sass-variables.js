const cssVariables = require('../helpers/css-variables')

const ext = cssVariables.appFile.sass
  ? 'sass'
  : (cssVariables.appFile.scss ? 'scss' : false)

const prefix = ext !== false
  ? `@import '~src/css/quasar.variables.${ext}', 'quasar/src/css/variables.sass'\n`
  : `@import 'quasar/src/css/variables.sass'\n`

module.exports = function (content) {
  return content.indexOf('$') !== -1
    ? prefix + content
    : content
}
