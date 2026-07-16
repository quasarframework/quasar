if (process.env.NODE_ENV === void 0) {
  process.env.NODE_ENV = 'production'
}

import { getArgv } from '../utils/get-argv.js'

const argv = getArgv({
  mode: { type: 'string', short: 'm', default: 'spa' },
  target: { type: 'string', short: 'T' }, // cordova/capacitor/bex mode only
  arch: { type: 'string', short: 'A' },
  bundler: { type: 'string', short: 'b' },
  'skip-pkg': { type: 'boolean', short: 's' },
  ide: { type: 'boolean', short: 'i' },
  debug: { type: 'boolean', short: 'd' },
  publish: { type: 'string', short: 'P' },
  'no-summary': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  help: { type: 'boolean', short: 'h' }
})

if (argv.help) {
  console.log(`
  Description
    Builds distributables of your app.

  Usage
    $ quasar build

    $ quasar build -m ssr
    $ quasar build -m capacitor -T ios

  Options
    --mode, -m      App mode [spa|ssr|ssg|pwa|cordova|capacitor|electron|bex] (default: spa)
    --target, -T    App target
                      - Cordova (default: all installed)
                        [android|ios]
                      - Capacitor
                        [android|ios]
                      - Electron with default "@electron/packager" bundler (default: yours)
                        [darwin|win32|linux|mas|all]
                      - Electron with "electron-builder" bundler (default: yours)
                        [darwin|mac|win32|win|linux|all]
                      - Bex
                        [chrome|firefox]
    --publish, -P   Also trigger publishing hooks (if any are specified)
                      - Has special meaning when building with Electron mode and using
                        electron-builder as bundler
    --debug, -d     Build for debugging purposes
    --skip-pkg, -s  Build only UI (skips creating Cordova/Capacitor/Electron executables or BEX zip file)
                      - Cordova (it only fills in /src-cordova/www folder with the UI code)
                      - Capacitor (it only fills in /src-capacitor/www folder with the UI code)
                      - Electron (it only creates the unpackaged app folder)
                      - BEX (it only creates the unpackaged extension folder)
    --no-summary    Don't output build summary at the end of the process
    --no-color      Disable colored output
    --help, -h      Displays this message

    ONLY for Cordova and Capacitor mode:
    --ide, -i       Open IDE (Android Studio / XCode) instead of finalizing with a
                      terminal/console-only build

    ONLY for Electron mode:
    --bundler, -b   Bundler (@electron/packager or electron-builder)
                      [packager|builder]
    --arch, -A      App architecture (default: yours)
                      - with default "@electron/packager" bundler:
                          [ia32|x64|armv7l|arm64|mips64el|all]
                      - with "electron-builder" bundler:
                          [ia32|x64|armv7l|arm64|all]

    ONLY for electron-builder (when using "publish" parameter):
    --publish, -P   Publish options [onTag|onTagOrDraft|always|never]
                      - see https://www.electron.build/configuration/publish

  `)

  argv.__warn?.()
  process.exit(0)
}

const { showCliBanner } = await import('@quasar/art')
showCliBanner()

const { ensureArgv } = await import('../utils/ensure-argv.js')
ensureArgv(argv, 'build')

const { getCtx } = await import('../utils/get-ctx.js')
const ctx = getCtx({
  mode: argv.mode,
  target: argv.target,
  arch: argv.arch,
  bundler: argv.bundler,
  debug: argv.debug,
  prod: true,
  publish: argv.publish
})

const { displayBanner } = await import('../utils/banner.js')
await displayBanner({ argv, ctx, cmd: 'build' })

const { log, fatal } = await import('../utils/logger.js')

// install mode if it's missing
const { addMode } = await import(
  `../modes/${argv.mode}/${argv.mode}-installation.js`
)
await addMode({ ctx, silent: true, target: argv.target })

const { QuasarConfigFile } = await import('../quasar-config-file.js')
const quasarConfFile = new QuasarConfigFile({ ctx })
const quasarConf = await quasarConfFile.read()

const { QuasarModeBuilder } = await import(
  `../modes/${argv.mode}/${argv.mode}-builder.js`
)
const appBuilder = new QuasarModeBuilder({ argv, quasarConf })

const { default: fse } = await import('fs-extra')
let outputFolder = quasarConf.build.distDir
fse.removeSync(outputFolder)

const { EntryFilesGenerator } = await import('../entry-files-generator.js')
const entryFiles = new EntryFilesGenerator(ctx)
entryFiles.generate(quasarConf)

const { generateTypes } = await import('../types-generator.js')
generateTypes(quasarConf)

if (typeof quasarConf.build.beforeBuild === 'function') {
  await quasarConf.build.beforeBuild({ quasarConf })
}

// run possible beforeBuild hooks
await ctx.appExt.runAppExtensionHook('beforeBuild', async hook => {
  hook.api.logger.log(`Running beforeBuild hook...`)
  await hook.fn(hook.api, { quasarConf })
})

log()

// oxlint-disable-next-line unicorn/prefer-top-level-await
appBuilder
  .build()
  .catch(err => {
    console.error(err)
    fatal('App build failed (check the log above)', 'FAIL')
  })
  .then(async signal => {
    if (signal !== void 0) {
      const { SIGNALS } = await import('../utils/signals.js')
      if (signal === SIGNALS.BUILD_EXTERNAL_TOOL_SPAWNED) {
        const { platform } = await import('node:process')

        // We simply return and let Windows be able to
        // spawn the external tool (requires extra time)
        if (platform === 'win32') return
        // Otherwise, we force exit the process.
        // See process.exit(0) at the end of this then() for the explanation.
        process.exit(0)
      }
    }

    if (argv.mode === 'cordova') {
      const { join } = await import('node:path')
      outputFolder = join(outputFolder, '..')
    }

    await displayBanner({
      argv,
      ctx,
      cmd: 'build',
      details: {
        buildOutputFolder: outputFolder,
        target: quasarConf.build.target
      }
    })

    if (typeof quasarConf.build.afterBuild === 'function') {
      await quasarConf.build.afterBuild({ quasarConf })
    }

    // run possible beforeBuild hooks
    await ctx.appExt.runAppExtensionHook('afterBuild', async hook => {
      hook.api.logger.log(`Running afterBuild hook...`)
      await hook.fn(hook.api, { quasarConf })
    })

    if (argv.publish !== void 0) {
      const opts = {
        arg: argv.publish,
        distDir: outputFolder,
        quasarConf
      }

      if (typeof quasarConf.build.onPublish === 'function') {
        await quasarConf.build.onPublish(opts)
      }

      // run possible onPublish hooks
      await ctx.appExt.runAppExtensionHook('onPublish', async hook => {
        hook.api.logger.log(`Running onPublish hook...`)
        await hook.fn(hook.api, opts)
      })
    }

    /**
     * We're done, but there may be some underlying tools which
     * haven't freed up the Node's JS execution stack yet (like Rolldown or Vite).
     * So, we're forcing the process to exit to avoid losing time.
     */
    process.exit(0)
  })
