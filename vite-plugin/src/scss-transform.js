
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
    let useIndex = Math.max(
      content.lastIndexOf('@use '),
      content.lastIndexOf('@forward ')
    )

    if (useIndex === -1) {
      return prefix + content
    }

    const newLineIndex = content.indexOf('\n', useIndex);
    if (newLineIndex === -1) {
      return content + '\n' + prefix
    } else {
      return content.substring(0, newLineIndex + 1) + prefix + content.substring(newLineIndex + 1)
    }
  }
}
