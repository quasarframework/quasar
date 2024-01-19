import { normalizePath } from 'vite'
import { dim, underline, bold } from 'kolorist'

import { warning, error, success } from '../utils/logger.js'
import { getLinter } from '../utils/eslint.js'

const eslintUrl = underline(dim('http://eslint.org/docs/rules/'))

function parseIssue (path, reportEntry) {
  const source = reportEntry.source.split('\n')

  return reportEntry.messages.map(entry => {
    const ruleLink = entry.ruleId
      ? `\n\n    ⚠️  ${ eslintUrl }${ underline(bold(entry.ruleId)) }`
      : ''

    return {
      text: entry.message + ruleLink,
      detail: void 0,
      location: {
        file: path,
        length: 1,
        line: entry.line,
        column: entry.column - 1,
        lineText: source[ entry.line - 1 ],
        namespace: ''
      }
    }
  })
}

export async function quasarEsbuildESLintPlugin (quasarConf, compileId) {
  const {
    eslint,
    filter,
    errors,
    warnings,
    fix,
    outputFixes,
    errorFiles
  } = await getLinter(quasarConf, compileId)

  return {
    name: 'quasar:eslint',

    setup (build) {
      build.onLoad({
        filter: /\.[jt]sx?$/
      }, async ({ path }) => {
        const file = normalizePath(path)

        if (filter(file) === false || await eslint.isPathIgnored(file) === true) {
          return {}
        }

        const report = await eslint.lintFiles(path)

        if (report.length === 0) {
          return {}
        }

        const {
          errorCount, fixableErrorCount,
          warningCount, fixableWarningCount
        } = report[ 0 ]

        if (fix === true && (fixableErrorCount !== 0 || fixableWarningCount !== 0)) {
          outputFixes(report)
        }

        if (errors === true && errorCount !== 0) {
          errorFiles.add(path)
          console.log()
          error('Error:', 'LINT')
          console.log()
          return { errors: parseIssue(path, report[ 0 ]) }
        }

        if (warnings === true && warningCount !== 0) {
          errorFiles.add(path)
          console.log()
          warning('Warning:', 'LINT')
          console.log()
          return { warnings: parseIssue(path, report[ 0 ]) }
        }

        if (errorFiles.has(path) === true) {
          console.log()
          success(path, 'LINT OK')
          console.log()
          errorFiles.delete(path)
        }

        return {}
      })
    }
  }
}
