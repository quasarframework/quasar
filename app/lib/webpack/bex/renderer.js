const path = require('path')
const fse = require('fs-extra')

const appPaths = require('../../app-paths')
const artifacts = require('../../artifacts')
const injectHtml = require('../inject.html')

module.exports = function (chain, cfg) {
  injectHtml(chain, cfg)

  const rootPath = cfg.ctx.dev ? appPaths.bexDir : cfg.build.distDir
  const outputPath = path.join(rootPath, 'www')

  const copyPatterns = []

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
    .path(outputPath) // Output to our src-bex/www folder or dist/bex/unpacked/www.

  // We shouldn't minify BEX code. This option is disabled by default for BEX mode in quasar-conf.js.
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Source_Code_Submission#Provide_your_extension_source_code
  chain.optimization.minimize(cfg.build.minify)

  if (cfg.ctx.dev) {
    // Clean old dir
    artifacts.clean(outputPath)
  }
  else {
    // We need this bundled in with the rest of the source to match the manifest instructions.
    // Could use Webpack Copy here but this is more straight forward.
    cfg.build.htmlFilename = path.join('www', 'index.html')

    // Register our plugin, update the manifest and package the browser extension.
    const BexPackager = require('./plugin.bex-packager')
    chain.plugin('webpack-bex-packager')
      .use(BexPackager, [{
        src: cfg.bex.builder.directories.input,
        dest: cfg.bex.builder.directories.output,
        name: require(appPaths.resolve.app('package.json')).name
      }])

    // Copy our user edited BEX files to the dist dir (excluding the already built www folder)
    copyPatterns.push({
      from: appPaths.bexDir,
      to: cfg.build.distDir,
      noErrorOnMissing: true,
      globOptions: {
        dot: false,
        // These ignores are relative to the "from" path so no need for full paths here.
        ignore: [
          '**/www/**/*',
          '**/bex-flag.d.ts'
        ]
      }
    })
  }

  // Copy any files we've registered during the chain.
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  chain.plugin('copy-webpack')
    .use(CopyWebpackPlugin, [{ patterns: copyPatterns }])
}
