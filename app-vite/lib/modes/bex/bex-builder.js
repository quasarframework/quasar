
const { join } = require('path')
const { createWriteStream } = require('fs-extra')
const archiver = require('archiver')

const AppBuilder = require('../../app-builder')
const appPaths = require('../../app-paths')
const { progress } = require('../../helpers/logger')
const config = require('./bex-config')
const { createManifest, copyBexAssets } = require('./utils')

const { name } = require(appPaths.resolve.app('package.json'))

class BexBuilder extends AppBuilder {
  async build () {
    const viteConfig = await config.vite(this.quasarConf)
    await this.buildWithVite('BEX UI', viteConfig)

    const { err } = createManifest(this.quasarConf)
    if (err !== void 0) { process.exit(1) }

    const backgroundConfig = await config.backgroundScript(this.quasarConf)
    await this.buildWithEsbuild('Background Script', backgroundConfig)

    for (const name of this.quasarConf.bex.contentScripts) {
      const contentConfig = await config.contentScript(this.quasarConf, name)
      await this.buildWithEsbuild('Content Script', contentConfig)
    }

    const domConfig = await config.domScript(this.quasarConf)
    await this.buildWithEsbuild('Dom Script', domConfig)

    copyBexAssets(this.quasarConf)

    this.printSummary(this.quasarConf.build.distDir)
    this.#bundlePackage(this.quasarConf.build.distDir)
  }

  #bundlePackage (folder) {
    const done = progress('Bundling in progress...')
    const zipName = `Packaged.${ name }.zip`
    const file = join(folder, zipName)

    const output = createWriteStream(file)
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    archive.pipe(output)
    archive.directory(folder, false, entryData => ((entryData.name !== zipName) ? entryData : false))
    archive.finalize()

    done(`Bundle has been generated at: ${ file }`)
  }
}

module.exports = BexBuilder
