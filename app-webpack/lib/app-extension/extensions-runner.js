const extensionJson = require('./extension-json')
const Extension = require('./Extension')
const { merge } = require('webpack-merge')

class ExtensionsRunner {
  constructor () {
    const list = extensionJson.getList()

    this.hooks = {}
    this.extensions = Object.keys(list).map(ext => new Extension(ext))
  }

  async registerExtensions (ctx) {
    this.hooks = {}
    for (const ext of this.extensions) {
      const hooks = await ext.run(ctx)
      this.hooks = merge({}, this.hooks, hooks)
    }
  }

  async runHook (hookName, fn) {
    if (this.hooks[ hookName ] && this.hooks[ hookName ].length > 0) {
      for (const hook of this.hooks[ hookName ]) {
        await fn(hook)
      }
    }
  }
}

module.exports = new ExtensionsRunner()
