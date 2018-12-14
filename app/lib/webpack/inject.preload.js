module.exports = function (chain, cfg) {
  if (cfg.ctx.prod && cfg.build.preloadChunks) {
    const PreloadPlugin = require('preload-webpack-plugin')

    chain.plugin('preload')
      .use(PreloadPlugin, [{
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      }])
    chain.plugin('prefetch')
      .use(PreloadPlugin, [{
        rel: 'prefetch',
        include: 'asyncChunks'
      }])
  }
}
