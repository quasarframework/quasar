export function createScssTransform (fileExtension, sassVariables) {
  const sassImportCode = [ '@import \'quasar/src/css/variables.sass\'', '' ]

  if (typeof sassVariables === 'string') {
    sassImportCode.unshift(`@import '${ sassVariables }'`)
  }

  const prefix = fileExtension === 'sass'
    ? sassImportCode.join('\n')
    : sassImportCode.join(';\n')

  return content => {
    const useIndex = Math.max(
      content.lastIndexOf('@use '),
      content.lastIndexOf('@forward ')
    )

    if (useIndex === -1) {
      return prefix + content
    }

    const newLineIndex = content.indexOf('\n', useIndex)

    if (newLineIndex !== -1) {
      const index = newLineIndex + 1
      return content.substring(0, index) + prefix + content.substring(index)
    }

    return content + '\n' + prefix
  }
}
