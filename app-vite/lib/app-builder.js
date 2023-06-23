
import { lstatSync } from 'node:fs'
import fse from 'fs-extra'
import { join, isAbsolute, basename, dirname } from 'node:path'

import appPaths from './app-paths.js'
import { AppTool } from './app-tool.js'
import { printBuildSummary } from '../lib/utils/print-build-summary.js'

export class AppBuilder extends AppTool {
  quasarConf
  ctx

  constructor ({ argv, quasarConf }) {
    super(argv)

    this.quasarConf = quasarConf
    this.ctx = quasarConf.ctx
  }

  readFile (filename) {
    const target = isAbsolute(filename) === true
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    return fse.readFileSync(target, 'utf-8')
  }

  writeFile (filename, content) {
    const target = isAbsolute(filename) === true
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    fse.ensureDirSync(dirname(target))
    fse.writeFileSync(target, content, 'utf-8')
  }

  copyFiles (patterns, targetFolder = this.quasarConf.build.distDir) {
    patterns.forEach(entry => {
      const from = isAbsolute(entry.from) === true
        ? entry.from
        : appPaths.resolve.app(entry.from)

      if (fse.existsSync(from) !== true) {
        return
      }

      const to = isAbsolute(entry.to) === true
        ? entry.to
        : join(targetFolder, entry.to)

      fse.copySync(
        from,
        lstatSync(from).isDirectory() === true ? to : join(to, basename(from))
      )
    })
  }

  moveFile (source, destination) {
    const input = isAbsolute(source) === true
      ? source
      : join(this.quasarConf.build.distDir, source)

    const output = isAbsolute(destination) === true
      ? destination
      : join(this.quasarConf.build.distDir, destination)

    fse.moveSync(input, output)
  }

  removeFile (filename) {
    const target = isAbsolute(filename) === true
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    fse.removeSync(target)
  }

  printSummary (folder, showGzipped) {
    printBuildSummary(folder, showGzipped)
  }
}
