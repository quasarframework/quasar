const
  extensionJson = require('./extension-json'),
  Extension = require('./Extension'),
  merge = require('webpack-merge')

class ExtensionsRunner {
  constructor () {
    const list = extensionJson.getList()

    this.hooks = {}
    this.extensions = Object.keys(list).map(ext => new Extension(ext))
  }

  async registerExtensions (ctx) {
    this.hooks = {}
    for (let ext of this.extensions) {
      const hooks = await ext.run(ctx)
      this.hooks = merge(this.hooks, hooks)
    }
  }

  runHook (hookName, fn) {
    if (this.hooks[hookName] && this.hooks[hookName].length > 0) {
      for (let hook of this.hooks[hookName]) {
        fn(hook)
      }
    }
  }
}

module.exports = new ExtensionsRunner()
