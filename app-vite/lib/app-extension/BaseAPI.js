
import appPaths from '../app-paths.js'
import { cliPkg } from '../app-pkg.js'

const { name } = cliPkg

export class BaseAPI {
  engine = name
  hasWebpack = false
  hasVite = true

  extId
  prompts
  resolve = appPaths.resolve
  appDir = appPaths.appDir

  __hooks = {}

  constructor ({ extId, prompts }) {
    this.extId = extId
    this.prompts = prompts
  }

  /**
   * Private-ish methods
   */

  __getHooks () {
    return this.__hooks
  }

  __addHook (name, fn) {
    this.__hooks[ name ].push({ fn, api: this })
  }
}
