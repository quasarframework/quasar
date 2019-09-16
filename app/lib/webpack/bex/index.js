const
  appPaths = require('../../app-paths'),
  path = require('path'),
  fse = require('fs-extra'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  injectClientSpecifics = require('../inject.client-specifics'),
  injectHotUpdate = require('../inject.hot-update'),
  injectPreload = require('../inject.preload')

const renderFile = function (fileName) {
  fse.copySync(path.join(appPaths.cliDir, 'templates', 'bex', 'js', 'core', fileName), path.join(appPaths.resolve.bex('js/core'), fileName))
}

module.exports = function (chain, cfg) {
  const
    unpackedBuildDir = path.join(cfg.build.distDir, 'unpacked'),
    outputPath = cfg.ctx.dev
      ? path.join(appPaths.bexDir, 'www')
      : path.join(unpackedBuildDir, 'www')

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
  } else {
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

  // TODO: I don't like this at all. I just need to exclude bex-contentScript.js
  // and bex-background.js from the final output file but can't find another way
  // than using my own template, setting inject: false and manually adding the files.
  // I could edit the file manually on bundle complete but that seems just as nasty
  // RAZVAN - some guidance would be great.
  chain.plugin('html-webpack')
    .use(HtmlWebpackPlugin, [{
      ...cfg.__html.variables,

      filename: cfg.ctx.dev
        ? 'index.html'
        : path.join(cfg.build.distDir, cfg.build.htmlFilename),
      template: path.join(__dirname, 'bex.index.html'),
      minify: cfg.__html.minifyOptions,
      chunksSortMode: 'none',
      // inject script tags for bundle
      inject: false,
      cache: true
    }])

  injectClientSpecifics(chain, cfg)
  injectHotUpdate(chain, cfg)
  injectPreload(chain, cfg)
}
