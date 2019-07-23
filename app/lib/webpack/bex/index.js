const
  appPaths = require('../../app-paths'),
  path = require('path'),
  fse = require('fs-extra')

module.exports = function (chain, cfg) {
  const
    chunkManifest = 'chunk-manifest.json',
    unpackedBuildDir = path.join(cfg.build.distDir, 'unpacked'),
    outputPath = cfg.ctx.dev
      ? path.join(appPaths.bexDir, 'www')
      : path.join(unpackedBuildDir, 'www')
  
  chain.output
    .path(outputPath) // Output to our src-bex/www folder.
  
  // Generate a log of all chunks so they can be manually added to the
  // web browser for in page extensions.
  const Chunks2JsonPlugin = require('chunks-2-json-webpack-plugin')
  chain.plugin('chunks-2-json-webpack')
    .use(Chunks2JsonPlugin, [{
      outputDir: appPaths.bexDir,
      publicPath: cfg.ctx.dev ? cfg.devServer.publicPath : '',
      filename: chunkManifest
    }])
  
  // Copy statics
  const CopyWebpackPlugin = require('copy-webpack-plugin')
  chain.plugin('copy-webpack')
    .use(CopyWebpackPlugin, [
      [{
        from: path.join(appPaths.srcDir, 'statics'),
        to: path.join(outputPath, 'statics')
      }]
    ])
  
  if (cfg.ctx.dev) {
    // Clean old dir
    fse.removeSync(outputPath)
    
    // Public path on dev so we can hijack and re-map to an extension URL
    chain.output.publicPath(`http://127.0.0.1/__q-bex_ext_id__`)
    
    // Extensions need to be manually added to the browser
    // so we need the dev files available for them to be targeted.
    cfg.devServer.writeToDisk = true
  
    // Don't watch our manifest file as this'll cause loops.
    const webpack = require('webpack')
    chain.plugin('watch-ignore')
      .use(webpack.WatchIgnorePlugin, [[path.join(appPaths.bexDir, chunkManifest)]])
  
    const TransformInit = require('./initTransformer')
    chain.plugin('webpack-transform-init')
      .use(TransformInit, [{
        src: appPaths.bexDir,
        chunkManifest: path.join(appPaths.bexDir, chunkManifest)
      }])
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
          to: unpackedBuildDir,
          exclude: [appPaths.bexDir, path.join(chunkManifest)]
        }],
        {
          ignore: [{
            dot: true,
            glob: 'www/**/*'
          }]
        }
      ])
  
    const InitTransformer = require('./initTransformer')
    chain.plugin('webpack-init-transformer')
      .use(InitTransformer, [{
        src: unpackedBuildDir,
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
