const { join } = require('node:path')
const fse = require('fs-extra')
const archiver = require('archiver')

const { AppBuilder } = require('../../app-builder.js')
const { progress } = require('../../utils/logger.js')
const { quasarBexConfig } = require('./bex-config.js')
const { createManifest, copyBexAssets } = require('./utils.js')

module.exports.QuasarModeBuilder = class QuasarModeBuilder extends AppBuilder {
  async build () {
    const webpackConf = await quasarBexConfig.webpack(this.quasarConf)
    await this.buildWithWebpack('BEX UI', webpackConf)

    const { err } = createManifest(this.quasarConf)
    if (err !== void 0) { process.exit(1) }

    const backgroundConfig = await quasarBexConfig.backgroundScript(this.quasarConf)
    await this.buildWithEsbuild('Background Script', backgroundConfig)

    for (const name of this.quasarConf.bex.contentScripts) {
      const contentConfig = await quasarBexConfig.contentScript(this.quasarConf, name)
      await this.buildWithEsbuild('Content Script', contentConfig)
    }

    const domConfig = await quasarBexConfig.domScript(this.quasarConf)
    await this.buildWithEsbuild('Dom Script', domConfig)

    copyBexAssets(this.quasarConf)

    this.printSummary(this.quasarConf.build.distDir)

    this.#bundlePackage(this.quasarConf.build.distDir)
  }

  #bundlePackage (dir) {
    const done = progress('Bundling in progress...')
    const zipName = `Packaged.${ this.ctx.pkg.appPkg.name }.zip`
    const file = join(dir, zipName)

    const output = fse.createWriteStream(file)
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    archive.pipe(output)
    archive.directory(dir, false, entryData => ((entryData.name !== zipName) ? entryData : false))
    archive.finalize()

    done(`Bundle has been generated at: ${ file }`)
  }
}
