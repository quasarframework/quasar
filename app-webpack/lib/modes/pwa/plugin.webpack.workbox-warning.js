const msgRE = /^(GenerateSW|InjectManifest) has been called multiple times/

const filterFn = warn => !(
  warn.name === 'Error'
  && msgRE.test(warn.message) === true
)

module.exports.WorkboxWarningPlugin = class WorkboxWarningPlugin {
  apply (compiler) {
    compiler.hooks.done.tap('pwa-custom-sw-warning', stats => {
      stats.compilation.warnings = stats.compilation.warnings.filter(filterFn)
    })
  }
}
