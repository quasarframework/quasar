
const { normalizePath } = require('vite')
const getLinter = require('../eslint')
const { warning, error, success } = require('../helpers/logger')

const errorFiles = new Set()

module.exports = function eslintPlugin (quasarConf, getLinterOpts) {
  const {
    eslint,
    filter,
    errors,
    warnings,
    fix,
    outputFixes,
    formatter
  } = getLinter(quasarConf, getLinterOpts)

  return {
    name: 'quasar:eslint',

    async transform (_, id) {
      if (filter(id) === false || await eslint.isPathIgnored(normalizePath(id)) === true) {
        return null
      }

      const report = await eslint.lintFiles(id)

      if (report[ 0 ] === void 0) {
        return null
      }

      const {
        errorCount, fixableErrorCount,
        warningCount, fixableWarningCount
      } = report[ 0 ]

      if (errors === true && errorCount !== 0) {
        const { format } = await eslint.loadFormatter(formatter)
        errorFiles.add(id)
        console.log()
        error('Error:', 'LINT')
        console.log()
        this.error(format(report))
      }
      else if (warnings === true && warningCount !== 0) {
        const { format } = await eslint.loadFormatter(formatter)
        errorFiles.add(id)
        console.log()
        warning('Warning:', 'LINT')
        console.log()
        this.warn(format(report))
      }

      if (fix === true && (fixableErrorCount !== 0 || fixableWarningCount !== 0)) {
        outputFixes(report)
      }

      if (errorFiles.has(id) === true) {
        console.log()
        success(id, 'LINT OK')
        console.log()
        errorFiles.delete(id)
      }

      return null
    }
  }
}
