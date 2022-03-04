
const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const { existsSync, ensureDirSync, createWriteStream } = require('fs-extra')
const archiver = require('archiver')

const AppBuilder = require('../../app-builder')
const appPaths = require('../../app-paths')
const { progress } = require('../../helpers/logger')
const config = require('./bex-config')

const { name } = require(appPaths.resolve.app('package.json'))

function findAndReplaceInSection (sectionArray, find, replace) {
  const index = sectionArray.indexOf(find)
  sectionArray[index] = replace
}

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

    const folders = {
      src: this.quasarConf.build.distDir,
      dest: join(this.quasarConf.metaConf.packagedDistDir, 'Packaged')
    }

    this.#fixManifest(folders)
    this.#bundlePackages(folders)
  }

  /**
   * This will fix some of the paths in the manifest file which are different in the build version vs dev version.
   */
  #fixManifest (folders) {
    const manifestFilePath = join(folders.src, this.quasarConf.bex.manifestFilename)

    if (existsSync(manifestFilePath) === true) {
      const manifestFileData = readFileSync(manifestFilePath)
      let manifestData = JSON.parse(manifestFileData.toString())

      findAndReplaceInSection(
        manifestData.background.scripts,
        'www/bex-background.js',
        'www/js/bex-background.js'
      )

      findAndReplaceInSection(
        manifestData.content_scripts[0].js,
        'www/bex-content-script.js',
        'www/js/bex-content-script.js'
      )

      const newValue = JSON.stringify(manifestData)
      writeFileSync(manifestFilePath, newValue, 'utf-8')
    }
  }

  #bundlePackages (folders) {
    const done = progress('Bundling in progress...')

    const chromeDir = join(folders.dest, 'chrome')
    ensureDirSync(chromeDir)
    this.#zipFolder(folders.src, chromeDir)


    const firefoxDir = join(folders.dest, 'firefox')
    ensureDirSync(firefoxDir)
    this.#zipFolder(folders.src, firefoxDir)

    done('Chrome and FF bundles have been generated')
  }

  #zipFolder (src, dest) {
    let output = createWriteStream(join(dest, `${ name }.zip`))
    let archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    archive.pipe(output)
    archive.directory(src, false)
    archive.finalize()
  }
}

module.exports = BexBuilder
