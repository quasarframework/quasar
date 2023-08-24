
const { readFileSync, writeFileSync } = require('node:fs')

const appPaths = require('../../app-paths.js')

const contentScriptTemplate = readFileSync(
  appPaths.resolve.cli('templates/bex/entry-content-script.js'),
  'utf-8'
)

module.exports.injectBexMain = function injectBexMain (chain, cfg) {
  // Reset some bits we don't need following the default createChain() call.
  // We only want the entry points we're adding in this file so remove all others.
  chain.entryPoints.clear()

  // The renderer chain is responsible for public statics / file copying so remove from this chain
  chain.plugins.delete('copy-webpack')

  // splitChunks causes issues with the connection between the client and the background script.
  // This is because it's expecting a chunk to be available via traditional loading methods but
  // we only specify one file for background in the manifest so it needs to contain EVERYTHING it needs.
  chain.optimization.splitChunks(void 0)

  const { BexManifestPlugin } = require('./plugin.bex-manifest.js')
  chain.plugin('webpack-bex-manifest')
    .use(BexManifestPlugin, [ cfg ])

  if (cfg.ctx.prod) {
    // We shouldn't minify BEX code. This option is disabled by default for BEX mode in quasar-conf.js.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Source_Code_Submission#Provide_your_extension_source_code
    chain.optimization.minimize(cfg.build.minify)
  }

  chain.entry('background')
    .add(appPaths.resolve.app('.quasar/bex/entry-background.js'))

  chain.entry('dom')
    .add(appPaths.resolve.app('.quasar/bex/entry-dom.js'))

  for (const name of cfg.bex.contentScripts) {
    const entry = appPaths.resolve.app(`.quasar/bex/entry-content-script-${ name }.js`)

    writeFileSync(
      entry,
      contentScriptTemplate.replace('__NAME__', name),
      'utf-8'
    )

    chain.entry(name)
      .add(entry)
  }

  chain.output
    .path(cfg.build.distDir)
    .filename(`[name].js`)

  return chain
}
