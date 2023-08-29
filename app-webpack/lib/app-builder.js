const { lstatSync } = require('node:fs')
const fse = require('fs-extra')
const { join, isAbsolute, basename, dirname } = require('node:path')

const { AppTool } = require('./app-tool.js')
const { printBuildSummary } = require('../lib/utils/print-build-summary.js')

module.exports.AppBuilder = class AppBuilder extends AppTool {
  quasarConf

  constructor ({ argv, quasarConf }) {
    super({ argv, ctx: quasarConf.ctx })
    this.quasarConf = quasarConf
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
        : this.ctx.appPaths.resolve.app(entry.from)

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
