
export const scssTransformRegex = /\.scss$/
export const sassTransformRegex = /\.sass$/

export function createScssTransform (fileExtension, sassVariables) {
  const sassImportCode = [ `@import 'quasar/src/css/variables.sass'`, '' ]

  if (typeof sassVariables === 'string') {
    sassImportCode.unshift(`@import '${ sassVariables }'`)
  }

  const prefix = fileExtension === 'sass'
    ? sassImportCode.join('\n')
    : sassImportCode.join(';\n')

  return content => {
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
}
