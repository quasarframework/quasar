
const { removeFileLoaders } = require('../utils')

const stackStart = `  \u001b[0m\u001b[90m-\u001b[0m \u001b[0m\u001b[93mindex.js\u001b[0m\u001b[90m:`

function cleanMessage (message) {
  const cleanMessage = message
    // match until the last semicolon followed by a space
    // this should match
    // linux => "(SyntaxError: )Unexpected token (5:11)"
    // windows => "(SyntaxError: C:/projects/index.js: )Unexpected token (5:11)"
    .replace(/^Module build failed.*:\s/, 'Syntax Error: ')
    // remove mini-css-extract-plugin loader tracing errors
    .replace(/^Syntax Error: ModuleBuildError:.*:\s/, '')
    // remove babel extra wording and path
    .replace(/^Syntax Error: SyntaxError: (([A-Z]:)?\/.*:\s)?/, 'Syntax Error: ')
    .replace(/^Syntax Error:   /, '')

  const stackIndex = cleanMessage.indexOf(stackStart)
  return stackIndex > -1
    ? cleanMessage.substr(0, stackIndex)
    : cleanMessage
}

module.exports = function format (error, printLog, titleFn) {
  printLog(titleFn(removeFileLoaders(error.file)))
  printLog()
  printLog(cleanMessage(error.message))
}
