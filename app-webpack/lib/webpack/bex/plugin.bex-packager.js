const path = require('path')
const fse = require('fs')
const archiver = require('archiver')
const mkdirp = require('mkdirp')

function findAndReplaceInSection (sectionArray, find, replace) {
  const index = sectionArray.indexOf(find)
  sectionArray[index] = replace
}

class BexPackager {
  constructor (options) {
    this.options = options
    this.chromeDir = path.join(options.dest, 'chrome')
    this.firefoxDir = path.join(options.dest, 'firefox')
  }

  apply (compiler) {
    compiler.hooks.done.tap('done-compiling', stats => {
      if (stats.hasErrors() === false) {
        this.setupDirectories()
        this.fixManifest()
        this.bundleChrome()
        this.bundleFirefox()
      }
    })
  }

  /**
   * This will fix some of the paths in the manifest file which are different in the build version vs dev version.
   */
  fixManifest () {
    const manifestFilePath = path.join(this.options.src, 'manifest.json')
    if (fse.existsSync(manifestFilePath) === true) {
      const manifestFileData = fse.readFileSync(manifestFilePath)
      let manifestData = JSON.parse(manifestFileData.toString())

      findAndReplaceInSection(manifestData.background.scripts, 'www/bex-background.js', 'www/js/bex-background.js')
      findAndReplaceInSection(manifestData.content_scripts[0].js, 'www/bex-content-script.js', 'www/js/bex-content-script.js')
      const newValue = JSON.stringify(manifestData)
      fse.writeFileSync(manifestFilePath, newValue, 'utf-8')
    }
  }

  setupDirectories () {
    mkdirp.sync(this.chromeDir)
    mkdirp.sync(this.firefoxDir)
  }

  bundleChrome () {
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

module.exports = BexPackager
