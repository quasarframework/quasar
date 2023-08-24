import { join } from 'node:path'
import fse from 'fs-extra'

import { build as viteBuild } from 'vite'
import { build as esBuild, context as esContextBuild } from 'esbuild'

import { progress } from './utils/logger.js'

const cordovaWWW = join('src-cordova', 'www')
const capacitorWWW = join('src-capacitor', 'www')

export class AppTool {
  argv
  ctx

  constructor ({ argv, ctx }) {
    this.argv = argv
    this.ctx = ctx
  }

  async buildWithVite (threadName, viteConfig) {
    // ensure clean build
    this.cleanArtifacts(viteConfig.build.outDir)

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

  cleanArtifacts (dir) {
    if (dir.endsWith(cordovaWWW)) {
      fse.emptyDirSync(dir)
    }
    else if (dir.endsWith(capacitorWWW)) {
      const { appPaths } = this.ctx

      fse.emptyDirSync(dir)
      fse.copySync(
        appPaths.resolve.cli('templates/capacitor/www'),
        appPaths.capacitorDir
      )
    }
    else {
      fse.removeSync(dir)
    }
  }
}
