module.exports = class BootDefaultExport {
  apply (compiler) {
    compiler.hooks.done.tap('boot-default-export', stats => {
      // we filter out warnings about the default export
      // in boot files (we want to be able to not export anything)

      stats.compilation.warnings = stats.compilation.warnings.filter(
        warn => !(
          warn.name === 'ModuleDependencyWarning' &&
          warn.message.includes(`export 'default'`) &&
          warn.message.includes('qboot_')
        )
      )
    })
  }
}
