const fse = require('fs-extra')
const os = require('os')
const { posix } = require('path')
const { createFilter } = require('@rollup/pluginutils')

const { dim, underline, bold } = require('kolorist')

const { encodeForDiff } = require('../utils/encode-for-diff.js')
const { warning, error, success } = require('../utils/logger.js')

const eslintUrl = underline(dim('http://eslint.org/docs/rules/'))
const isWindows = os.platform() === 'win32'
const windowsSlashRE = /\\/g

function normalizePath (id) {
  return posix.normalize(
    isWindows === true
      ? id.replace(windowsSlashRE, '/')
      : id
  )
}

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

function extractStore ({
  cache,
  cacheLocation, // injected by us

  formatter,
  fix,
  warnings,
  errors,
  include,
  exclude,

  rawEsbuildEslintOptions = {}
}, {
  ESLint,
  resolveToAppDir
}) {
  const eslintOptions = {
    cache,
    cacheLocation,
    fix,
    errorOnUnmatchedPattern: false,
    ...rawEsbuildEslintOptions
  }

  if (cache === true) {
    fse.removeSync(cacheLocation)
    fse.ensureDirSync(cacheLocation)
  }

  const eslint = new ESLint(eslintOptions)
  const mapIncludeExclude = entry => {
    return typeof entry === 'string'
      ? resolveToAppDir(entry)
      : entry
  }

  const includeOptions = [
    /\.([jt]sx?|vue)$/,
    ...include.map(mapIncludeExclude)
  ]

  const excludeOptions = [
    /node_modules/,
    ...exclude.map(mapIncludeExclude)
  ]

  const filter = createFilter(includeOptions, excludeOptions)

  return {
    eslint,
    filter,
    errors,
    warnings,
    fix,
    outputFixes: ESLint.outputFixes,
    formatter,
    errorFiles: new Set()
  }
}

function getLinter (quasarConf, compileId) {
  const {
    ctx: { appPaths, cacheProxy },
    eslint: { rawWebpackEslintPluginOptions, ...eslintOptions }
  } = quasarConf

  const cacheId = `eslint-${ compileId }`

  const eslintConfig = {
    ...eslintOptions,
    cacheLocation: appPaths.resolve.cache(cacheId)
  }

  const configHash = encodeForDiff(eslintConfig)
  const cachedLinter = cacheProxy.getRuntime(cacheId, () => ({}))

  if (cachedLinter.configHash !== configHash) {
    const { ESLint } = cacheProxy.getModule('eslint')
    const store = extractStore(eslintConfig, {
      ESLint,
      resolveToAppDir: appPaths.resolve.app
    })

    cacheProxy.setRuntime(cacheId, {
      configHash,
      store
    })

    return store
  }

  return cachedLinter.store
}

module.exports.quasarEsbuildESLintPlugin = async function quasarEsbuildESLintPlugin (quasarConf, compileId) {
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
