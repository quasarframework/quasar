const
  appPaths = require('../../app-paths'),
  path = require('path'),
  fse = require('fs-extra')

/**
 * Copies a file from the BEX template folder into the bexSrc dir.
 * Warning: Will overwrite whatever is there!
 * @param fileName
 */
const renderFile = function (fileName) {
  fse.copySync(path.join(appPaths.cliDir, 'templates', 'bex', 'js', 'core', fileName), path.join(appPaths.resolve.bex('js/core'), fileName))
}

module.exports = function (chain, cfg) {
  const
    unpackedBuildDir = path.join(cfg.build.distDir, 'unpacked'),
    outputPath = cfg.ctx.dev
      ? path.join(appPaths.bexDir, 'www')
      : path.join(unpackedBuildDir, 'www')

  // Add a copy config to copy the static folder for both dev and build.
  let webpackCopyConfigs = [{
    from: path.join(appPaths.srcDir, 'statics'),
    to: path.join(outputPath, 'statics')
  }]

  // Make sure we always have the latest BEX files in the src-bex folder (to get bug fixes etc)
  // These files are marked with DO NOT EDIT so the users have been warned.
  renderFile(path.join('background', 'background.js'))
  renderFile(path.join('content', 'contentScript.js'))
  renderFile(path.join('init', 'connect.js'))
  renderFile(path.join('init', 'index.js'))
  renderFile('bridge.js')

  chain.output
    .path(outputPath) // Output to our src-bex/www folder.

  // Bundle our bex files for inclusion via the manifest.json
  chain.entry('bex-init')
    .add(appPaths.resolve.bex('js/core/init/index.js'))

  // Note: The following entries are manually excluded from the final index.html output via
  // app/lib/webpack/plugin.html-addons.js -> htmlWebpackPluginAlterAssetTags
  chain.entry('bex-background')
    .add(appPaths.resolve.bex('js/core/background/background.js'))

  chain.entry('bex-contentScript')
    .add(appPaths.resolve.bex('js/core/content/contentScript.js'))

  if (cfg.ctx.dev) {
    // Clean old dir
    fse.removeSync(outputPath)

    // Extensions need to be manually added to the browser
    // so we need the dev files available for them to be targeted.
    cfg.devServer.writeToDisk = true
  }
  else {
    const
      packedBuildDir = path.join(cfg.build.distDir, 'packed'),
      packageName = require(path.join(appPaths.appDir, 'package.json')).name

    // We need this bundled in with the rest of the source to match the manifest instructions.
    cfg.build.htmlFilename = path.join('unpacked', 'www', 'index.html')

    // splitChunks causes issues with the connection between the client and the background script.
    // This is  because it's expecting a chunk to be available via traditional loading methods but
    // we only specify one file for background in the manifest so it needs to container EVERYTHING it needs.
    chain.optimization.splitChunks(undefined)

    // Strictly speaking, best practice would be to *not* minify but leave it up to the user.
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Source_Code_Submission#Provide_your_extension_source_code
    chain.optimization.minimize(cfg.build.minify)

    // Register our plugin, update the manifest and package the browser extension.
    const WebpackBexPackager = require('./webpackBexPackager')
    chain.plugin('webpack-bex-packager')
      .use(WebpackBexPackager, [{
        src: unpackedBuildDir,
        dest: packedBuildDir,
        name: packageName
      }])

    // Copy our user edited BEX files to the dist dir (excluding the already build www folder)
    webpackCopyConfigs.push({
      from: appPaths.bexDir,
      to: unpackedBuildDir,
      ignore: ['www/**/*']
    })
  }

  // Copy any files we've registered during the chain.
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  chain.plugin('copy-webpack')
    .use(CopyWebpackPlugin, [webpackCopyConfigs])
}
