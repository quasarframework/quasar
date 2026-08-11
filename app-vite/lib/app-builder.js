import fse from 'fs-extra'
import { basename, dirname, isAbsolute, join } from 'node:path'

import { AppTool } from './app-tool.js'
import { printBuildSummary } from '../lib/utils/print-build-summary.js'

export class AppBuilder extends AppTool {
  quasarConf

  constructor({ argv, quasarConf }) {
    super({ argv, ctx: quasarConf.ctx })
    this.quasarConf = quasarConf
  }

  /** async */
  readFile(filename) {
    const target = isAbsolute(filename)
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    return fse.readFile(target, 'utf8')
  }

  async writeFile(filename, content, noOverwrite) {
    const target = isAbsolute(filename)
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    fse.ensureDirSync(dirname(target))

    try {
      await fse.writeFile(
        target,
        content,
        noOverwrite === true
          ? { encoding: 'utf8', flag: 'wx' }
          : { encoding: 'utf8' }
      )
    } catch (err) {
      if (noOverwrite === true && err.code === 'EEXIST') {
        return true
      }

      throw err
    }
  }

  async copyFiles(patterns, targetFolder = this.quasarConf.build.distDir) {
    for (const entry of patterns) {
      const from = this.ctx.appPaths.resolve.app(entry.from)
      if (await fse.pathExists(from)) {
        await fse.copy(from, join(targetFolder, entry.to, basename(from)))
      }
    }
  }

  /** async */
  moveFile(source, destination) {
    const input = isAbsolute(source)
      ? source
      : join(this.quasarConf.build.distDir, source)

    const output = isAbsolute(destination)
      ? destination
      : join(this.quasarConf.build.distDir, destination)

    return fse.move(input, output)
  }

  /** async */
  removeFile(filename) {
    const target = isAbsolute(filename)
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    return fse.remove(target)
  }

  printSummary(folder, showGzipped) {
    if (!this.argv['no-summary']) {
      printBuildSummary(folder, showGzipped)
    }
  }
}
