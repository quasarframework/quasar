module.exports = class ExpressionDependency {
  apply (compiler) {
    compiler.hooks.done.tap('expression-dependency', stats => {
      stats.compilation.warnings = stats.compilation.warnings.filter(
        warn => !(
          warn.name === 'ModuleDependencyWarning' &&
          warn.message.includes(`the request of a dependency is an expression`)
        )
      )
    })
  }
}
