import { join } from 'node:path'
import fse from 'fs-extra'
import archiver from 'archiver'

import { AppBuilder } from '../../app-builder.js'
import { progress, warn } from '../../utils/logger.js'
import { quasarBexConfig } from './bex-config.js'
import { createManifest, copyBexAssets } from './bex-utils.js'

export class QuasarModeBuilder extends AppBuilder {
  async build () {
    const viteConfig = await quasarBexConfig.vite(this.quasarConf)
    await this.buildWithVite('BEX UI', viteConfig)

    const { err, scriptList } = createManifest(this.quasarConf)
    if (err !== void 0) process.exit(1)

    for (const entry of scriptList) {
      const contentConfig = await quasarBexConfig.bexScript(this.quasarConf, entry)
      await this.buildWithEsbuild(`Bex Script (${ entry.name })`, contentConfig)
    }

    copyBexAssets(this.quasarConf)

    this.printSummary(this.quasarConf.build.distDir)
    await this.#bundlePackage(this.quasarConf.build.distDir)
  }

  async #bundlePackage (dir) {
    const done = progress('Bundling in progress...')
    const zipName = `Packaged.${ this.ctx.pkg.appPkg.name }.zip`
    const file = join(dir, zipName)

    const output = fse.createWriteStream(file)
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    archive.pipe(output)
    archive.directory(dir, false, entryData => ((entryData.name !== zipName) ? entryData : false))

    return new Promise((resolve, reject) => {
      archive.on('warning', (error) => {
        /*
          It could be any of the following:
          - stat failures (e.g. ENOENT)
          - symlink/directory not supported by module (e.g. zip), but it is supported, so it won't happen
          - given file is not a file/directory/symlink, but something else (e.g. socket)
        */
        if (error instanceof archiver.ArchiverError && error.code === 'ENTRYNOTSUPPORTED') {
          warn(error)
        }
        else {
          reject(error)
          archive.abort()
        }
      })
      archive.on('error', error => reject(error))

      output.on('close', () => {
        done(`Bundle has been generated at: ${ file }`)
        resolve()
      })

      archive.finalize()
    })
  }
}
