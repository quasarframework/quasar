
const { normalizePath } = require('vite')
const getLinter = require('../linter')

module.exports = function eslintPlugin (quasarConf) {
  const {
    eslint,
    filter,
    errors,
    warnings,
    fix,
    outputFixes,
    formatter
  } = getLinter(quasarConf)

  return {
    name: 'quasar:linter',

    async transform(_, id) {
      if (filter(id) === false || await eslint.isPathIgnored(normalizePath(id)) === true) {
        return null
      }

      const report = await eslint.lintFiles(id)

      if (report[0] === void 0) {
        return null
      }

      const {
        errorCount, fixableErrorCount,
        warningCount, fixableWarningCount
      } = report[0]

      if (errors === true && errorCount !== 0) {
        const { format } = await eslint.loadFormatter(formatter)
        this.error(format(report))
      }
      else if (warnings === true && warningCount !== 0) {
        const { format } = await eslint.loadFormatter(formatter)
        this.warn(format(report))
      }

      if (fix === true && (fixableErrorCount !== 0 || fixableWarningCount !== 0)) {
        outputFixes(report)
      }

      return null
    }
  }
}
