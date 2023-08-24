const { join } = require('node:path')
const fse = require('fs-extra')

const appPaths = require('../../app-paths.js')
const { cleanArtifacts } = require('../../artifacts.js')
const { injectHtml } = require('../inject.html.js')

const assetsFolder = appPaths.resolve.bex('assets')
const iconsFolder = appPaths.resolve.bex('icons')
const localesFolder = appPaths.resolve.bex('_locales')

module.exports.injectBexRenderer = function injectBexRenderer (chain, cfg) {
  const rootPath = cfg.build.distDir
  const outputPath = join(rootPath, 'www')

  const copyPatterns = [
    { from: assetsFolder, to: join(cfg.build.distDir, 'assets'), noErrorOnMissing: true },
    { from: iconsFolder, to: join(cfg.build.distDir, 'icons'), noErrorOnMissing: true },
    { from: localesFolder, to: join(cfg.build.distDir, '_locales'), noErrorOnMissing: true }
  ]

  // Add a copy config to copy the static folder for both dev and build.
  if (cfg.build.ignorePublicFolder !== true) {
    copyPatterns.push({
      from: appPaths.resolve.app('public'),
      to: outputPath,
      noErrorOnMissing: true
    })
  }

  // Copy our entry BEX files to the .quasar/bex folder.
  fse.copySync(appPaths.resolve.cli('templates/entry/bex'), appPaths.resolve.app('.quasar/bex'))

  chain.output
    .path(outputPath)

  // We shouldn't minify BEX code. This option is disabled by default for BEX mode in quasar-conf.js.
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Source_Code_Submission#Provide_your_extension_source_code
  chain.optimization.minimize(cfg.build.minify)

  if (cfg.ctx.dev) {
    // Clean old dir
    cleanArtifacts(outputPath) // TODO still necessary?
  }
  else {
    // We need this bundled in with the rest of the source to match the manifest instructions.
    // Could use Webpack Copy here but this is more straight forward.
    cfg.build.htmlFilename = join('www', 'index.html')

    // Package the browser extension
    const { BexPackagerPlugin } = require('./plugin.bex-packager.js')
    chain.plugin('webpack-bex-packager')
      .use(BexPackagerPlugin, [ cfg ])
  }

  injectHtml(chain, cfg)

  // Copy any files we've registered during the chain.
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  chain.plugin('copy-webpack')
    .use(CopyWebpackPlugin, [ { patterns: copyPatterns } ])
}
