const { cliPkg } = require('../../utils/cli-runtime.js')

module.exports.BaseAPI = class BaseAPI {
  engine = cliPkg.name
  hasWebpack = true
  hasVite = false

  ctx
  extId
  prompts
  resolve
  appDir

  constructor ({ ctx, extId, prompts }) {
    this.ctx = ctx
    this.extId = extId
    this.prompts = prompts
    this.resolve = ctx.appPaths.resolve
    this.appDir = ctx.appPaths.appDir
  }
}
