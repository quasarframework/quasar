const
  path = require('path')

const
  appPaths = require('../../app-paths'),
  createChain = require('../create-chain')

module.exports = function (cfg, configName) {
  const
    // use the main chain as there's no point duplicating code
    chain = createChain(cfg, configName),
    outputPath = path.join(cfg.ctx.dev ? appPaths.bexDir : cfg.build.distDir, 'www')

  // Reset some bits we don't need following the default createChain() call.
  // We only want the entry points we're adding in this file so remove all others.
  chain.entryPoints.clear()

  // The renderer chain is responsible for statics / file copying so remove from this chain
  chain.plugins.delete('copy-webpack')

  if (cfg.ctx.prod) {
    // splitChunks causes issues with the connection between the client and the background script.
    // This is  because it's expecting a chunk to be available via traditional loading methods but
    // we only specify one file for background in the manifest so it needs to container EVERYTHING it needs.
    chain.optimization.splitChunks(undefined)

    // Strictly speaking, best practice would be to *not* minify but leave it up to the user.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Source_Code_Submission#Provide_your_extension_source_code
    chain.optimization.minimize(cfg.build.minify)
  }

  chain.entry('bex-background')
    .add(appPaths.resolve.bex('js/core/background/background.js'))

  chain.entry('bex-contentScript')
    .add(appPaths.resolve.bex('js/core/content/contentScript.js'))

  chain.output
    .path(outputPath)

  return chain
}
