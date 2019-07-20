const
  appPaths = require('../../app-paths'),
  path = require('path')

module.exports = function (chain, cfg) {
  if (cfg.ctx.dev) {
    // Extensions need to be manually added to the browser
    // so we need the dev files available for them to be targeted.
    cfg.devServer.writeToDisk = true
  
    // Output to our src-bex/www folder.
    chain.output.path(path.join(appPaths.bexDir, 'www'))
  } else {
    const
      unpackedDir = path.join(cfg.build.distDir, 'unpacked'),
      packedDir = path.join(cfg.build.distDir, 'packed'),
      packageName = require(path.join(appPaths.appDir, 'package.json')).name
  
    // We need this bundled in with the rest of the source to match the manifest instructions.
    cfg.build.htmlFilename = path.join('unpacked', 'www', 'index.html')
  
    chain
      .output.path(path.join(unpackedDir, 'www'))
  
    // Copy manifest / background.js to dist
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [
        [{
          from: appPaths.bexDir,
          to: unpackedDir
        }],
        {
          ignore: [{
            dot: true,
            glob: 'www/**/*'
          }]
        }
      ])
  
    // Register out plugin and package the browser extensions.
    const WebpackBexPackager = require('./WebpackBexPackager')
    chain.plugin('webpack-bex-packager')
      .use(WebpackBexPackager, [{
        src: unpackedDir,
        dest: packedDir,
        name: packageName
      }])
    
  }
}
