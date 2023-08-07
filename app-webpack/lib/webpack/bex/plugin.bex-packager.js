const { join } = require('node:path')
const fse = require('fs-extra')
const archiver = require('archiver')

const { appPkg } = require('../../app-pkg.js')

module.exports.BexPackagerPlugin = class BexPackagerPlugin {
  #quasarConf

  constructor (cfg) {
    this.#quasarConf = cfg
  }

  apply (compiler) {
    compiler.hooks.done.tap('done-compiling', stats => {
      if (stats.hasErrors() === false) {
        this.#bundlePackage(this.#quasarConf.build.distDir)
      }
    })
  }

  #bundlePackage (folder) {
    const zipName = `Packaged.${ appPkg.name }.zip`
    const file = join(folder, zipName)

    const output = fse.createWriteStream(file)
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    archive.pipe(output)
    archive.directory(folder, false, entryData => ((entryData.name !== zipName) ? entryData : false))
    archive.finalize()
  }
}
