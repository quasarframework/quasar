const path = require('path')

const
  appPaths = require('../app-paths'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  HtmlAddonsPlugin = require('./plugin.html-addons').plugin

module.exports = function (chain, cfg) {
  chain.plugin('html-webpack')
    .use(HtmlWebpackPlugin, [
      Object.assign({}, cfg.__html.variables, {
        filename: cfg.ctx.dev
          ? 'index.html'
          : path.join(cfg.build.distDir, cfg.build.htmlFilename),
        template: appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate),
        minify: cfg.__html.minifyOptions,

        chunksSortMode: 'none',
        // inject script tags for bundle
        inject: true,
        cache: true
      })
    ])

  chain.plugin('html-addons')
    .use(HtmlAddonsPlugin, [ cfg ])
}
