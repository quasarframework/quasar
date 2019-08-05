const
  appPaths = require('../../app-paths'),
  path = require('path'),
  fse = require('fs-extra'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  injectClientSpecifics = require('../inject.client-specifics'),
  injectHotUpdate = require('../inject.hot-update'),
  injectPreload = require('../inject.preload')

// TODO: Use this to copy app/temaplate/bex files which the user
// shouldn't be editing to make sure we get the latest versions.
const renderFile = function (fileName, api) {
  console.log(chalk.yellow(`    Copying ${fileName}`))
  fse.copySync(path.join(__dirname, 'templates', 'src-bex', 'js', fileName), path.join(api.resolve.bex('js'), fileName))
}

module.exports = function (chain, cfg) {
  const
    unpackedBuildDir = path.join(cfg.build.distDir, 'unpacked'),
    outputPath = cfg.ctx.dev
      ? path.join(appPaths.bexDir, 'www')
      : path.join(unpackedBuildDir, 'www')

  chain.output
    .path(outputPath) // Output to our src-bex/www folder.

  // Copy statics (shouldn't this happen automatically?!)
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  chain.plugin('copy-webpack')
    .use(CopyWebpackPlugin, [
      [{
        from: path.join(appPaths.srcDir, 'statics'),
        to: path.join(outputPath, 'statics')
      }]
    ])

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

    // This is required for some reason. Without it, the splitChunks causes issues with the connection
    // between the client and the background script. I assume because it's expecting a chunk to be available
    // via traditional loading methods but we only specify one file for background in the manifest so it needs
    // to container EVERYTHING it needs.
    chain.optimization.splitChunks(undefined)

    // Copy manifest / background.js to dist
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [
        [{
          from: appPaths.bexDir,
          to: unpackedBuildDir
        }],
        {
          ignore: [{
            dot: true,
            glob: 'www/**/*'
          }]
        }
      ])

    // Register out plugin and package the browser extensions.
    const WebpackBexPackager = require('./webpackBexPackager')
    chain.plugin('webpack-bex-packager')
      .use(WebpackBexPackager, [{
        src: unpackedBuildDir,
        dest: packedBuildDir,
        name: packageName
      }])

  }

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
