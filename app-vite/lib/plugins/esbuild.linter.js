
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

  const isProd = quasarConf.ctx.prod

  return {
    name: 'quasar:linter',

    setup (build) {
      build.onLoad({
        filter: /\.[jt]sx?$/
      }, async ({ path }) => {
        const file = normalizePath(path)

        if (filter(file) === false || await eslint.isPathIgnored(file) === true) {
          return
        }

        const report = await eslint.lintFiles(path)

        if (report[0] === void 0) {
          return
        }

        const { errorCount, fixableErrorCount, warningCount, fixableWarningCount } = report[0]

        if (fix === true && (fixableErrorCount !== 0 || fixableWarningCount !== 0)) {
          outputFixes(report)
        }

        if (warnings === true && warningCount !== 0) {
          const { format } = await eslint.loadFormatter(formatter)
          console.warn(format(report))
        }

        if (errors === true && errorCount !== 0) {
          const { format } = await eslint.loadFormatter(formatter)
          console.error(format(report))
          isProd === true && process.exit(1)
        }
      })
    }
  }
}
