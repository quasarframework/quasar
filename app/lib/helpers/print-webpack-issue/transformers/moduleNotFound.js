
/**
 * Initially forked from friendly-errors-webpack-plugin 2.0.0-beta.2
 */

const TYPE = 'module-not-found'

function isModuleNotFoundError (e) {
  const webpackError = e.webpackError || {}

  return webpackError.dependencies
    && webpackError.dependencies.length > 0
    && e.name === 'ModuleNotFoundError'
    && e.message.indexOf('Module not found') === 0
}

module.exports = function transform (error) {
  const webpackError = error.webpackError

  if (isModuleNotFoundError(error)) {
    const dependency = webpackError.dependencies[0]
    const module = dependency.request || dependency.options.request

    return {
      ...error,
      message: `Module not found ${module}`,
      type: TYPE,
      severity: 900,
      module,
      name: 'Module not found'
    }
  }

  return error
}
