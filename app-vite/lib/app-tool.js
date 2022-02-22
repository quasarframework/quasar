
const { build: viteBuild } = require('vite')
const { build: esBuild } = require('esbuild')
const { bold, underline, green } = require('chalk')
const debounce = require('lodash.debounce')

const { log, info, success } = require('./helpers/logger')

function coloredName (name) {
  return bold(underline(green(name)))
}

class AppTool {
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

  async buildWithEsbuild (name, esbuildConfig, onRebuildSuccess) {
    const thread = coloredName(name)
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

    info(`Compiling of "${thread}" with Esbuild in progress...`, 'WAIT')
    const result = await esBuild(cfg)

    const diffTime = +new Date() - startTime
    success(`"${thread}" compiled with success • ${diffTime}ms`, 'DONE')
    log()

    return result
  }
}

module.exports = AppTool
