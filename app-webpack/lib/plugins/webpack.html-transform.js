const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports.HtmlTransformPlugin = class HtmlTransformPlugin {
  #transformHtml

  constructor (transformHtml) {
    this.#transformHtml = transformHtml
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('webpack-plugin-html-addons', compilation => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation)

      hooks.beforeEmit.tapAsync('webpack-plugin-html-addons', (data, callback) => {
        data.html = this.#transformHtml(data.html)
        callback(null, data)
      })
    })
  }
}
