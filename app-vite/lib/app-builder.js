
const fglob = require('fast-glob')
const { lstatSync } = require('fs')
const { readFileSync, writeFileSync, copySync, existsSync, ensureDirSync, moveSync, removeSync } = require('fs-extra')
const { join, isAbsolute, basename, dirname } = require('path')

const AppTool = require('./app-tool')
const appPaths = require('./app-paths')

class AppBuilder extends AppTool {
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

    return readFileSync(target, 'utf-8')
  }

  writeFile (filename, content) {
    const target = isAbsolute(filename) === true
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    ensureDirSync(dirname(target))
    writeFileSync(target, content, 'utf-8')
  }

  copyFiles (patterns, targetFolder = this.quasarConf.build.distDir) {
    patterns.forEach(entry => {
      const from = isAbsolute(entry.from) === true
        ? entry.from
        : appPaths.resolve.app(entry.from)

      if (existsSync(from) !== true) {
        return
      }

      const to = isAbsolute(entry.to) === true
        ? entry.to
        : join(targetFolder, entry.to)

      const files = lstatSync(from).isDirectory() === true
        ? fglob.sync(['**/*'], { cwd: from }).map(file => join(from, file))
        : [ from ]

      files.forEach(entry => {
        copySync(entry, join(to, basename(entry)))
      })
    })
  }

  moveFile (source, destination) {
    const input = isAbsolute(source) === true
      ? source
      : join(this.quasarConf.build.distDir, source)

    const output = isAbsolute(destination) === true
      ? destination
      : join(this.quasarConf.build.distDir, destination)

    moveSync(input, output)
  }

  removeFile (filename) {
    const target = isAbsolute(filename) === true
      ? filename
      : join(this.quasarConf.build.distDir, filename)

    removeSync(target)
  }
}

module.exports = AppBuilder
