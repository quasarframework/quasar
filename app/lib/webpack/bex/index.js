const
  appPaths = require('../../app-paths'),
  path = require('path'),
  fse = require('fs-extra')

module.exports = function (chain, cfg) {
  const
    chunkManifest = 'chunk-manifest.json',
    extensionBuildKey = cfg.bex.extensionBuildKey
  
  // Generate a log of all chunks so they can be manually added to the
  // web browser for in page extensions.
  const Chunks2JsonPlugin = require('chunks-2-json-webpack-plugin')
  chain.plugin('chunks-2-json-webpack')
    .use(Chunks2JsonPlugin, [{
      outputDir: appPaths.bexDir,
      publicPath: cfg.ctx.dev ? cfg.devServer.publicPath : '',
      filename: chunkManifest
    }])
  
  if (cfg.ctx.dev) {
    const outputPath = path.join(appPaths.bexDir, 'www')
    // clean up
    fse.removeSync(outputPath)
    
    // Extensions need to be manually added to the browser
    // so we need the dev files available for them to be targeted.
    cfg.devServer.writeToDisk = true
    
    chain.output
      .path(outputPath) // Output to our src-bex/www folder.
      .publicPath(`chrome-extension://${extensionBuildKey}/www/`) // Required for paths
  
    // Copy statics
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [
        [{
          from: path.join(appPaths.srcDir, 'statics'),
          to: path.join(appPaths.bexDir, 'www', 'statics')
        }]
      ])
  
    // Don't watch our manifest file as this'll cause loops.
    const webpack = require('webpack')
    chain.plugin('watch-ignore')
      .use(webpack.WatchIgnorePlugin, [[path.join(appPaths.bexDir, chunkManifest)]])
  
    const TransformInit = require('./transformInit')
    chain.plugin('webpack-transform-init')
      .use(TransformInit, [{
        src: appPaths.bexDir,
        chunkManifest: path.join(appPaths.bexDir, chunkManifest)
      }])
  } else {
    const
      unpackedBuildDir = path.join(cfg.build.distDir, 'unpacked'),
      packedBuildDir = path.join(cfg.build.distDir, 'packed'),
      packageName = require(path.join(appPaths.appDir, 'package.json')).name
  
    // We need this bundled in with the rest of the source to match the manifest instructions.
    cfg.build.htmlFilename = path.join('unpacked', 'www', 'index.html')
  
    chain.output
      .path(path.join(unpackedBuildDir, 'www'))
      .publicPath(`chrome-extension://${extensionBuildKey}/www/`) // Required for paths
  
    // Copy manifest / background.js to dist
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [
        [{
          from: appPaths.bexDir,
          to: unpackedBuildDir,
          exclude: [appPaths.bexDir, path.join(chunkManifest)]
        },
        { // TODO: Shouldn't statics copy automatically?
          from: path.join(appPaths.srcDir, 'statics'),
          to: path.join(unpackedBuildDir, 'www', 'statics')
        }],
        {
          ignore: [{
            dot: true,
            glob: 'www/**/*'
          }]
        }
      ])
  
    const TransformInit = require('./transformInit')
    chain.plugin('webpack-transform-init')
      .use(TransformInit, [{
        src: path.join(cfg.build.distDir, 'unpacked'),
        chunkManifest: path.join(appPaths.bexDir, chunkManifest)
      }])
  
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
