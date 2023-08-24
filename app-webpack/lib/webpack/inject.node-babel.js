const appPaths = require('../app-paths.js')

module.exports.injectNodeBabel = function injectNodeBabel (cfg, chain) {
  if (cfg.build.transpile === true) {
    chain.module.rule('babel')
      .test(/\.js$/)
      .exclude
      .add(/node_modules/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        extends: appPaths.babelConfigFilename
      })
  }
}
