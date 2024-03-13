const { cliPkg } = require('../../utils/cli-runtime.js')
const { getPackagePath } = require('../../utils/get-package-path.js')

module.exports.BaseAPI = class BaseAPI {
  engine = cliPkg.name

  hasWebpack = true
  hasVite = false

  ctx
  extId
  resolve
  appDir

  constructor ({ ctx, extId }) {
    this.ctx = ctx
    this.extId = extId
    this.resolve = ctx.appPaths.resolve
    this.appDir = ctx.appPaths.appDir
  }

  /**
   * Is the host project using Typescript?
   *
   * @return {boolean} true | false
   */
  hasTypescript () {
    return this.ctx.cacheProxy.getModule('hasTypescript')
  }

  /**
   * Is the host project using linting (ESLint)?
   *
   * @return {boolean} true | false
   */
  hasLint () {
    const { hasEslint } = this.ctx.cacheProxy.getModule('eslint')
    return hasEslint
  }

  /**
   * Is the host project using Pinia or Vuex?
   *
   * @return {string} 'pinia' | 'vuex' | undefined
   */
  getStorePackageName () {
    if (getPackagePath('pinia', this.ctx.appPaths.appDir) !== void 0) {
      return 'pinia'
    }

    if (getPackagePath('vuex', this.ctx.appPaths.appDir) !== void 0) {
      return 'vuex'
    }
  }

  /**
   * What is the host project's node packager?
   *
   * @return {Promise<'npm' | 'yarn' | 'pnpm' | 'bun'>}
   */
  async getNodePackagerName () {
    const nodePackager = this.ctx.cacheProxy.getModule('nodePackager')
    return nodePackager.name
  }
}
