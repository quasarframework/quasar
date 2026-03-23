const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports.HtmlTransformPlugin = class HtmlTransformPlugin {
  #transformHtmlFn

  constructor(transformHtmlFn) {
    this.#transformHtmlFn = transformHtmlFn
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
      'webpack-plugin-html-addons',
      compilation => {
        const hooks = HtmlWebpackPlugin.getHooks(compilation)

        hooks.beforeEmit.tapAsync(
          'webpack-plugin-html-addons',
          (data, callback) => {
            this.#transformHtmlFn(data.html)
              .then(html => {
                data.html = html
                callback(null, data)
              })
              .catch(err => {
                callback(err, data)
              })
          }
        )
      }
    )
  }
}
