
const fglob = require('fast-glob')
const { lstatSync } = require('fs')
const { readFileSync, writeFileSync, copySync, existsSync } = require('fs-extra')
const { join, isAbsolute, basename } = require('path')

const { build: viteBuild } = require('vite')
const { build: esBuild } = require('esbuild')
const { bold, underline, green } = require('chalk')

const appPaths = require('./app-paths')
const { log, info, success } = require('./helpers/logger')

function coloredName (name) {
  return bold(underline(green(name)))
}

class AppBuilder {
  constructor ({ argv, quasarConf }) {
    this.argv = argv
    this.quasarConf = quasarConf
    this.ctx = quasarConf.ctx
  }

  async buildWithVite (name, viteConfig) {
    const thread = coloredName(name)
    const startTime = Date.now()

    info(`Compiling of "${thread}" with Vite in progress...`, 'WAIT')
    log()
    await viteBuild(viteConfig)
    log()

    // error(`"${this.state.name}" compiled with errors • ${diffTime}ms`, 'DONE')
    // warning(`"${this.state.name}" compiled, but with warnings • ${diffTime}ms`, 'DONE')
    const diffTime = +new Date() - startTime
    success(`"${thread}" compiled with success • ${diffTime}ms`, 'DONE')
    log()
  }

  async buildWithEsbuild (name, esbuildConfig) {
    const thread = coloredName(name)
    const startTime = Date.now()

    info(`Compiling of "${thread}" with Vite in progress...`, 'WAIT')
    log()
    await esBuild(esbuildConfig)
    log()

    const diffTime = +new Date() - startTime
    success(`"${thread}" compiled with success • ${diffTime}ms`, 'DONE')
    log()
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
}

module.exports = AppBuilder
