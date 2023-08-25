module.exports = function (content) {
  if (content.indexOf('$') !== -1) {
    const { prefix } = this.getOptions()

    const useIndex = Math.max(
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
