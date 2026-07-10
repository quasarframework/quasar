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

  readFile(filename) {
    const target = isAbsolute(filename)
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    return fse.readFileSync(target, 'utf8')
  }

  writeFile(filename, content, onOverwrite) {
    const target = isAbsolute(filename)
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    if (onOverwrite && fse.existsSync(target)) {
      onOverwrite()
    }

    fse.ensureDirSync(dirname(target))
    fse.writeFileSync(target, content, 'utf8')
  }

  copyFiles(patterns, targetFolder = this.quasarConf.build.distDir) {
    patterns.forEach(entry => {
      const from = this.ctx.appPaths.resolve.app(entry.from)
      if (fse.existsSync(from)) {
        fse.copySync(from, join(targetFolder, entry.to, basename(from)))
      }
    })
  }

  moveFile(source, destination) {
    const input = isAbsolute(source)
      ? source
      : join(this.quasarConf.build.distDir, source)

    const output = isAbsolute(destination)
      ? destination
      : join(this.quasarConf.build.distDir, destination)

    fse.moveSync(input, output)
  }

  removeFile(filename) {
    const target = isAbsolute(filename)
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    fse.removeSync(target)
  }

  printSummary(folder, showGzipped) {
    if (!this.argv['no-summary']) {
      printBuildSummary(folder, showGzipped)
    }
  }
}
