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

  register () {
    this.hooks = {}
    this.extensions.forEach(async (ext) => {
      const hooks = await ext.run()
      this.hooks = merge(this.hooks, hooks)
    })
  }

  runHook (hookName, fn) {
    if (this.hooks[hookName] && this.hooks[hookName].length > 0) {
      this.hooks[hookName].forEach(hook => hook(fn))
    }
  }
}

module.exports = new ExtensionsRunner()
