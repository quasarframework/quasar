module.exports = function (cfg, chain) {
  if (cfg.supportTS !== false) {
    chain.resolve.extensions
      .merge([ '.ts' ])

    chain.module
      .rule('typescript')
      .test(/\.ts$/)
      .use('ts-loader')
        .loader('ts-loader')
        .options({
          // While `noEmit: true` is needed in the tsconfig preset to prevent VSCode errors,
          // it prevents emitting transpiled files when run into node context
          compilerOptions: {
            noEmit: false
          },
          onlyCompileBundledFiles: true,
          transpileOnly: false
        })
  }
}
