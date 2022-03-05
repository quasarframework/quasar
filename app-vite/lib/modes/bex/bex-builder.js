
const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const { existsSync, ensureDirSync, createWriteStream, removeSync } = require('fs-extra')
const archiver = require('archiver')

const AppBuilder = require('../../app-builder')
const appPaths = require('../../app-paths')
const { progress, fatal } = require('../../helpers/logger')
const config = require('./bex-config')

const { name } = require(appPaths.resolve.app('package.json'))

class BexBuilder extends AppBuilder {
  async build () {
    const viteConfig = await config.vite(this.quasarConf)
    await this.buildWithVite('BEX UI', viteConfig)

    const backgroundConfig = await config.backgroundScript(this.quasarConf)
    await this.buildWithEsbuild('Background Script', backgroundConfig)

    const contentConfig = await config.contentScript(this.quasarConf)
    await this.buildWithEsbuild('Content Script', contentConfig)

    const domConfig = await config.domScript(this.quasarConf)
    await this.buildWithEsbuild('Dom Script', domConfig)

    const unpackagedDir = join(this.quasarConf.build.distDir, 'UnPackaged')

    this.copyFiles([{
      from: appPaths.bexDir,
      to: unpackagedDir
    }])

    removeSync(join(unpackagedDir, 'bex-flag.d.ts'))

    this.#bundlePackage(
      unpackagedDir,
      join(this.quasarConf.build.distDir, 'Packaged')
    )
  }

  #bundlePackage (src, dest) {
    const done = progress('Bundling in progress...')

    ensureDirSync(dest)

    let output = createWriteStream(join(dest, `${ name }.zip`))
    let archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    archive.pipe(output)
    archive.directory(src, false)
    archive.finalize()

    done('Bundle has been generated')
  }
}

module.exports = BexBuilder
