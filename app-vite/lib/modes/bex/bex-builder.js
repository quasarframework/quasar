import { join, relative, sep } from 'node:path'
import fse from 'fs-extra'
import { Zip, ZipDeflate } from 'fflate'

import { AppBuilder } from '../../app-builder.js'
import { progress, warn } from '../../utils/logger.js'
import { quasarBexConfig } from './bex-config.js'
import { copyBexAssets, createManifest } from './bex-utils.js'

export class QuasarModeBuilder extends AppBuilder {
  async build() {
    this.cleanArtifacts()
    const viteConfig = await quasarBexConfig.vite(this.quasarConf)

    const { err, scriptList } = await createManifest(this.quasarConf)
    if (err !== void 0) process.exit(1)

    copyBexAssets(this.quasarConf)

    await Promise.all([
      this.buildWithVite('BEX UI', viteConfig),

      ...scriptList.map(entry =>
        quasarBexConfig
          .bexScript(this.quasarConf, entry)
          .then(contentConfig =>
            this.buildWithRolldown(`Bex Script (${entry.name})`, contentConfig)
          )
      )
    ])

    this.printSummary(this.quasarConf.build.distDir)

    if (this.argv['skip-pkg'] !== true) {
      await this.#bundlePackage(this.quasarConf.build.distDir)
    }
  }

  #bundlePackage(dir) {
    const zipName = `Packaged.${this.ctx.pkg.appPkg.name}.zip`
    const done = progress({
      tool: 'ZIP',
      waitAction: 'Bundling',
      doneAction: 'Bundled',
      target: zipName
    })
    const file = join(dir, zipName)

    const output = fse.createWriteStream(file)
    const { promise, resolve, reject } = Promise.withResolvers()

    output.on('error', reject)
    output.on('close', () => {
      done()
      console.log()
      resolve()
    })

    // The callback fires every time fflate generates a chunk of the ZIP file
    const zip = new Zip((err, chunk, final) => {
      if (err) return reject(err)
      output.write(chunk)
      if (final) output.end()
    })

    // Recursively walk the directory
    const walkDirectory = async currentDir => {
      const items = await fse.readdir(currentDir)

      for (const item of items) {
        const fullPath = join(currentDir, item)
        const relativePath = relative(dir, fullPath)

        // Skip the zip file being generated, identical to the archiver filter
        if (relativePath === zipName) continue

        const stat = await fse.stat(fullPath)

        if (stat.isDirectory()) {
          await walkDirectory(fullPath) // Recurse into directories
        } else if (stat.isFile()) {
          const posixPath = relativePath.split(sep).join('/')
          const deflater = new ZipDeflate(posixPath, { level: 9 })
          zip.add(deflater)

          const {
            promise: localPromise,
            resolve: localResolve,
            reject: localReject
          } = Promise.withResolvers()

          const readStream = fse.createReadStream(fullPath)

          // Node Buffers are Uint8Arrays under the hood, so fflate accepts them directly
          readStream.on('data', chunk => deflater.push(chunk, false))
          readStream.on('error', localReject)
          readStream.on('end', () => {
            // Passing `true` as the second argument signals EOF for this file
            deflater.push(new Uint8Array(0), true)
            localResolve()
          })

          await localPromise
        } else if (typeof warn === 'function') {
          // Ignore things like sockets or symlinks and emit a warning
          warn(`Skipping unsupported entry type at ${fullPath}`)
        }
      }
    }

    // Start the walk then finalize the zip when done
    walkDirectory(dir)
      .then(() => zip.end())
      .catch(err => {
        zip.terminate()
        reject(err)
      })

    return promise
  }
}
