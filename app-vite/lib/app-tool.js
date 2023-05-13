
const { build: viteBuild } = require('vite')
const { build: esBuild, context: esContextBuild } = require('esbuild')

const { cleanArtifacts } = require('./artifacts.js')
const { progress } = require('./utils/logger.js')

module.exports.AppTool = class AppTool {
  argv

  constructor (argv) {
    this.argv = argv
  }

  async buildWithVite (threadName, viteConfig) {
    // ensure clean build
    cleanArtifacts(viteConfig.build.outDir)

    const done = progress(
      'Compiling of ___ with Vite in progress...',
      threadName
    )

    await viteBuild(viteConfig)
    done('___ compiled with success')
  }

  async watchWithEsbuild (threadName, esbuildConfig, onRebuildSuccess) {
    let resolve

    if (esbuildConfig.plugins === void 0) {
      esbuildConfig.plugins = []
    }

    esbuildConfig.plugins.push({
      name: 'quasar:on-rebuild',
      setup (build) {
        let isFirst = true
        let done

        build.onStart(() => {
          done = progress(
            'Compiling of ___ with Esbuild in progress...',
            threadName
          )
        })

        build.onEnd(result => {
          if (result.errors.length !== 0) {
            return
          }

          done('___ compiled with success')

          if (isFirst === true) {
            isFirst = false
            resolve()
            return
          }

          onRebuildSuccess()
        })
      }
    })

    const esbuildCtx = await esContextBuild(esbuildConfig)
    await esbuildCtx.watch()

    return new Promise(res => { // eslint-disable-line promise/param-names
      resolve = () => {
        res(esbuildCtx)
      }
    })
  }

  async buildWithEsbuild (threadName, esbuildConfig) {
    const done = progress(
      'Compiling of ___ with Esbuild in progress...',
      threadName
    )

    const esbuildResult = await esBuild(esbuildConfig)

    done('___ compiled with success')
    return esbuildResult
  }
}
