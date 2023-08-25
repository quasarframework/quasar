const { join } = require('node:path')
const fse = require('fs-extra')

const webpack = require('webpack')
const { build: esBuild, context: esContextBuild } = require('esbuild')

const { fatal, progress } = require('./utils/logger.js')

const cordovaWWW = join('src-cordova', 'www')
const capacitorWWW = join('src-capacitor', 'www')

module.exports.AppTool = class AppTool {
  argv
  ctx

  constructor ({ argv, ctx }) {
    this.argv = argv
    this.ctx = ctx
  }

  buildWithWebpack (threadName, webpackConf) {
    // ensure clean build
    this.cleanArtifacts(webpackConf.output.path)

    return new Promise(resolve => {
      webpack(webpackConf, async (err, stats) => {
        if (err) {
          console.error(err.stack || err)

          if (err.details) {
            console.error(err.details)
          }

          process.exit(1)
        }

        if (stats.hasErrors() === true) {
          const { printWebpackErrors } = require('./utils/print-webpack-issue/index.js')
          const summary = printWebpackErrors(threadName, stats)
          console.log()
          fatal(`for "${ threadName }" with ${ summary }. Please check the log above.`, 'COMPILATION FAILED')
        }

        const { printWebpackStats } = require('./utils/print-webpack-stats.js')

        console.log()
        printWebpackStats(stats, webpackConf.output.path, threadName)

        resolve()
      })
    })
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

          done('___ compiled with success by Esbuild')

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

    done('___ compiled with success by Esbuild')
    return esbuildResult
  }

  cleanArtifacts (dir) {
    if (dir.endsWith(cordovaWWW)) {
      fse.emptyDirSync(dir)
    }
    else if (dir.endsWith(capacitorWWW)) {
      const { appPaths } = this.ctx

      fse.emptyDirSync(dir)
      fse.copySync(
        appPaths.resolve.cli('templates/capacitor/www'),
        appPaths.resolve.capacitor('www')
      )
    }
    else {
      fse.removeSync(dir)
    }
  }
}
