const
  appPaths = require('../../app-paths'),
  path = require('path'),
  fse = require('fs-extra')

module.exports = function (chain, cfg) {
  const
    unpackedBuildDir = path.join(cfg.build.distDir, 'unpacked'),
    outputPath = cfg.ctx.dev
      ? path.join(appPaths.bexDir, 'www')
      : path.join(unpackedBuildDir, 'www')

  chain.output
    .path(outputPath) // Output to our src-bex/www folder.

  // Copy statics
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  chain.plugin('copy-webpack')
    .use(CopyWebpackPlugin, [
      [{
        from: path.join(appPaths.srcDir, 'statics'),
        to: path.join(outputPath, 'statics')
      }]
    ])

  chain.entry('bex-init')
    .add(appPaths.resolve.bex('js/core/init/index.js'))

  chain.entry('bex-background')
  .add(appPaths.resolve.bex('js/core/background/background.js'))

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
}
