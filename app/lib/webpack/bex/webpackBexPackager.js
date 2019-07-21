const
  path = require('path')
  fse = require('fs'),
  archiver = require('archiver')


class WebpackBexPackager {
  constructor (options) {
    this.options = options
    this.chromeDir = path.join(options.dest, 'chrome')
    this.firefoxDir = path.join(options.dest, 'firefox')
  }
  
  apply (compiler) {
    compiler.hooks.done.tap('done-compiling', async () => {
      await this.setupDirectories()
      this.bundleChrome()
      this.bundleFirefox()
    })
  }
  
  setupDirectories () {
    const mkdirp = require('mkdirp')
    mkdirp.sync(this.chromeDir)
    mkdirp.sync(this.firefoxDir)
  }
  
  bundleChrome () {
    // TODO: We might also need to support outputting of CRX files
    // Chrome store will convert zip to crx but linux might need us to build it.
    this.outputToZip(this.options.src, this.chromeDir, this.options.name)
  }
  
  bundleFirefox () {
    this.outputToZip(this.options.src, this.firefoxDir, this.options.name)
  }
  
  outputToZip (src, dest, fileName) {
    let output = fse.createWriteStream(path.join(dest, fileName + '.zip'))
    let archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })
  
    archive.pipe(output)
    archive.directory(src, false)
    archive.finalize()
  }
}

module.exports = WebpackBexPackager
