
/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

function cleanMessage (message) {
  return message
    // match until the last semicolon followed by a space
    // this should match
    // linux => "(SyntaxError: )Unexpected token (5:11)"
    // windows => "(SyntaxError: C:/projects/index.js: )Unexpected token (5:11)"
    .replace(/^Module build failed.*:\s/, 'Syntax Error: ')
    // remove mini-css-extract-plugin loader tracing errors
    .replace(/^Syntax Error: ModuleBuildError:.*:\s/, '')
    // remove babel extra wording and path
    .replace(/^Syntax Error: SyntaxError: (([A-Z]:)?\/.*:\s)?/, 'Syntax Error: ');
}

function isBabelSyntaxError (e) {
  return (
    e.name === 'ModuleBuildError' || e.name === 'ModuleBuildError'
    && e.message.indexOf('SyntaxError') >= 0
  )
}

module.exports = function transform (error) {
  return isBabelSyntaxError(error) === true
    ? {
        ...error,
        message: cleanMessage(error.message) + '\n',
        severity: 1000,
        name: 'Syntax Error'
      }
    : error
}
