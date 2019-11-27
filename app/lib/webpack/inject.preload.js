module.exports = function (chain, cfg) {
  if (cfg.build.preloadChunks) {
    const PreloadPlugin = require('@vue/preload-webpack-plugin')

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
