
const { build: viteBuild } = require('vite')
const { build: esBuild } = require('esbuild')
const debounce = require('lodash/debounce')

const { log, progress } = require('./helpers/logger')

class AppTool {
  argv

  constructor (argv) {
    this.argv = argv
  }

  async buildWithVite (threadName, viteConfig) {
    const done = progress(
      'Compiling of ___ with Vite in progress...',
      threadName
    )

    await viteBuild(viteConfig)
    log()

    done('___ compiled with success')
  }

  async buildWithEsbuild (threadName, esbuildConfig, onRebuildSuccess) {
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

    const done = progress(
      'Compiling of ___ with Esbuild in progress...',
      threadName
    )

    const result = await esBuild(cfg)

    done('___ compiled with success')
    return result
  }
}

module.exports = AppTool
