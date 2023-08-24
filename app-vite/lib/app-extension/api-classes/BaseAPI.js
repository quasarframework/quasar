
import { cliPkg } from '../../utils/cli-runtime.js'

export class BaseAPI {
  engine = cliPkg.name
  hasWebpack = false
  hasVite = true

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
