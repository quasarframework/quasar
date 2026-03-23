import { cliPkg } from '../../utils/cli-runtime.js'
import { getPackagePath } from '../../utils/get-package-path.js'

export class BaseAPI {
  engine = cliPkg.name

  hasWebpack = false
  hasVite = true

  ctx
  extId
  resolve
  appDir

  constructor({ ctx, extId }) {
    this.ctx = ctx
    this.extId = extId
    this.resolve = ctx.appPaths.resolve
    this.appDir = ctx.appPaths.appDir
  }

  /**
   * Is the host project using Typescript?
   *
   * @return {Promise<boolean>}
   */
  hasTypescript() {
    // implicit async return value
    return this.ctx.cacheProxy.getModule('hasTypescript')
  }

  /**
   * Is the host project using linting (ESLint)?
   *
   * @return {Promise<boolean>}
   */
  async hasLint() {
    const { hasEslint } = await this.ctx.cacheProxy.getModule('eslint')
    return hasEslint
  }

  /**
   * Get the installed and active store package name, if any
   *
   * @return {'pinia' | undefined}
   */
  getStorePackageName() {
    if (getPackagePath('pinia', this.ctx.appPaths.appDir) !== void 0) {
      return 'pinia'
    }
  }

  /**
   * What is the host project's node packager?
   *
   * @return {Promise<'npm' | 'yarn' | 'pnpm' | 'bun'>}
   */
  async getNodePackagerName() {
    const nodePackager = await this.ctx.cacheProxy.getModule('nodePackager')
    return nodePackager.name
  }
}
