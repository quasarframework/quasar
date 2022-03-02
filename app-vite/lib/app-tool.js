
const { build: viteBuild } = require('vite')
const { build: esBuild } = require('esbuild')
const { bold, underline, green } = require('chalk')
const debounce = require('lodash.debounce')

const { log, info, success, dot } = require('./helpers/logger')

function coloredName (name) {
  return bold(underline(green(name)))
}

class AppTool {
  argv

  constructor (argv) {
    this.argv = argv
  }

  async buildWithVite (threadName, viteConfig) {
    const name = coloredName(threadName)
    const startTime = Date.now()

    info(`Compiling of "${name}" with Vite in progress...`, 'WAIT')
    log()
    await viteBuild(viteConfig)
    log()

    const diffTime = +new Date() - startTime
    success(`"${name}" compiled with success ${dot} ${diffTime}ms`, 'DONE')
    log()
  }

  async buildWithEsbuild (threadName, esbuildConfig, onRebuildSuccess) {
    const name = coloredName(threadName)
    const startTime = Date.now()

    const cfg = onRebuildSuccess !== void 0
      ? {
        ...esbuildConfig,
        watch: {
          onRebuild: debounce(error => {
            if (!error) {
              onRebuildSuccess()
            }
          }, 600)
        }
      }
      : esbuildConfig

    info(`Compiling of "${name}" with Esbuild in progress...`, 'WAIT')
    const result = await esBuild(cfg)

    const diffTime = +new Date() - startTime
    success(`"${name}" compiled with success ${dot} ${diffTime}ms`, 'DONE')
    log()

    return result
  }
}

module.exports = AppTool
