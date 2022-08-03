const path = require('path')

const appPaths = require('../../app-paths')

module.exports = function (chain, cfg) {
  const outputPath = path.join(cfg.ctx.dev ? appPaths.bexDir : cfg.build.distDir, 'www')

  // Reset some bits we don't need following the default createChain() call.
  // We only want the entry points we're adding in this file so remove all others.
  chain.entryPoints.clear()

  // The renderer chain is responsible for public statics / file copying so remove from this chain
  chain.plugins.delete('copy-webpack')

  // splitChunks causes issues with the connection between the client and the background script.
  // This is because it's expecting a chunk to be available via traditional loading methods but
  // we only specify one file for background in the manifest so it needs to contain EVERYTHING it needs.
  chain.optimization.splitChunks(void 0)

  if (cfg.ctx.prod) {
    // We shouldn't minify BEX code. This option is disabled by default for BEX mode in quasar-conf.js.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Source_Code_Submission#Provide_your_extension_source_code
    chain.optimization.minimize(cfg.build.minify)
  }

  chain.entry('bex-background')
    .add(appPaths.resolve.app('.quasar/bex/background/background.js'))

  chain.entry('bex-content-script')
    .add(appPaths.resolve.app('.quasar/bex/content/content-script.js'))

  chain.entry('bex-dom')
    .add(appPaths.resolve.app('.quasar/bex/content/dom-script.js'))

  chain.output
    .path(outputPath)

  return chain
}
