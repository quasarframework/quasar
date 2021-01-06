#!/usr/bin/env node

if (process.env.NODE_ENV === void 0) {
  process.env.NODE_ENV = 'production'
}

const parseArgs = require('minimist')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    m: 'mode',
    T: 'target',
    A: 'arch',
    b: 'bundler',
    s: 'skip-pkg',
    i: 'ide',
    d: 'debug',
    h: 'help',
    P: 'publish'
  },
  boolean: ['h', 'd', 'u', 'i'],
  string: ['m', 'T', 'P'],
  default: {
    m: 'spa'
  }
})

if (argv.help) {
  console.log(`
  Description
    Builds distributables of your app.

  Usage
    $ quasar build
    $ quasar build -p <port number>

    $ quasar build -m ssr

    # alias for "quasar build -m cordova -T ios"
    $ quasar build -m ios

    # alias for "quasar build -m cordova -T android"
    $ quasar build -m android

    # passing extra parameters and/or options to
    # underlying "cordova" executable:
    $ quasar build -m ios -- some params --and options --here

  Options
    --mode, -m      App mode [spa|ssr|pwa|cordova|capacitor|electron|bex] (default: spa)
    --target, -T    App target
                      - Cordova (default: all installed)
                        [android|ios]
                      - Capacitor
                        [android|ios]
                      - Electron with default "electron-packager" bundler (default: yours)
                        [darwin|win32|linux|mas|all]
                      - Electron with "electron-builder" bundler (default: yours)
                        [darwin|mac|win32|win|linux|all]
    --publish, -P   Also trigger publishing hooks (if any are specified)
                      - Has special meaning when building with Electron mode and using
                        electron-builder as bundler
    --debug, -d     Build for debugging purposes
    --skip-pkg, -s  Build only UI (skips creating Cordova/Capacitor/Electron executables)
                      - Cordova (it only fills in /src/cordova/www folder with the UI code)
                      - Capacitor (it only fills in /src/capacitor/www folder with the UI code)
                      - Electron (it only creates the /dist/electron/UnPackaged folder)
    --help, -h      Displays this message

    ONLY for Cordova and Capacitor mode:
    --ide, -i       Open IDE (Android Studio / XCode) instead of finalizing with a
                    terminal/console-only build

    ONLY for Electron mode:
    --bundler, -b   Bundler (electron-packager or electron-builder)
                      [packager|builder]
    --arch, -A      App architecture (default: yours)
                      - with default "electron-packager" bundler:
                          [ia32|x64|armv7l|arm64|mips64el|all]
                      - with "electron-builder" bundler:
                          [ia32|x64|armv7l|arm64|all]

    ONLY for electron-builder (when using "publish" parameter):
    --publish, -P  Publish options [onTag|onTagOrDraft|always|never]
                     - see https://www.electron.build/configuration/publish

  `)
  process.exit(0)
}

const ensureArgv = require('../lib/helpers/ensure-argv')
ensureArgv(argv, 'build')

const banner = require('../lib/helpers/banner')
banner(argv, 'build')

const { log, warn, fatal } = require('../lib/helpers/logger')

const chalk = require('chalk')
const path = require('path')
const webpack = require('webpack')

function splitConfig (webpackConf, mode) {
  if (mode === 'ssr') {
    return [
      { webpack: webpackConf.server, name: 'Server' },
      { webpack: webpackConf.client, name: 'Client' },
      { webpack: webpackConf.webserver, name: 'Webserver' }
    ]
  }

  if (['electron', 'bex'].includes(mode)) {
    return [
      { webpack: webpackConf.renderer, name: 'Renderer process' },
      { webpack: webpackConf.main, name: 'Main process' }
    ]
  }

  return [
    { webpack: webpackConf, name: 'Build' }
  ]
}

function parseWebpackConfig (cfg, mode) {
  const data = splitConfig(cfg, mode)

  return {
    configs: data.map(d => d.webpack),
    name: data.map(d => d.name),
    folder: data.map(d => d.webpack.output.path)
  }
}

function finalizeBuild (mode, ctx, quasarConfFile) {
  let Runner

  if (['cordova', 'capacitor'].includes(mode)) {
    Runner = require('../lib/' + mode)
  }
  else if (argv['skip-pkg'] !== true && mode === 'electron') {
    Runner = require('../lib/electron')
  }

  if (Runner !== void 0) {
    Runner.init(ctx)
    return Runner.build(quasarConfFile, argv)
  }

  return Promise.resolve()
}

async function build () {
  if (argv.mode !== 'spa') {
    const installMissing = require('../lib/mode/install-missing')
    await installMissing(argv.mode, argv.target)
  }

  const QuasarConfFile = require('../lib/quasar-conf-file')
  const Generator = require('../lib/generator')
  const artifacts = require('../lib/artifacts')
  const getQuasarCtx = require('../lib/helpers/get-quasar-ctx')
  const extensionRunner = require('../lib/app-extension/extensions-runner')
  const regenerateTypesFeatureFlags = require('../lib/helpers/types-feature-flags')

  const ctx = getQuasarCtx({
    mode: argv.mode,
    target: argv.target,
    arch: argv.arch,
    bundler: argv.bundler,
    debug: argv.debug,
    prod: true,
    publish: argv.publish
  })

  // register app extensions
  await extensionRunner.registerExtensions(ctx)

  const quasarConfFile = new QuasarConfFile(ctx, argv)

  try {
    await quasarConfFile.prepare()
  }
  catch (e) {
    console.log(e)
    fatal(`[FAIL] quasar.conf.js has JS errors`)
  }

  await quasarConfFile.compile()

  const generator = new Generator(quasarConfFile)
  const quasarConf = quasarConfFile.quasarConf
  const webpackConf = quasarConfFile.webpackConf

  regenerateTypesFeatureFlags(quasarConf)

  let outputFolder = quasarConf.build.packagedDistDir ||
  quasarConf.build.distDir

  artifacts.clean(outputFolder)
  generator.build()

  if (typeof quasarConf.build.beforeBuild === 'function') {
    await quasarConf.build.beforeBuild({ quasarConf })
  }

  // run possible beforeBuild hooks
  await extensionRunner.runHook('beforeBuild', async hook => {
    log(`Extension(${hook.api.extId}): Running beforeBuild hook...`)
    await hook.fn(hook.api, { quasarConf })
  })

  log(`Compiling with Webpack...`)

  let webpackData = parseWebpackConfig(webpackConf, argv.mode)

  webpack(webpackData.configs, async (err, stats) => {
    if (err) {
      console.error(err.stack || err)

      if (err.details) {
        console.error(err.details)
      }

      process.exit(1)
    }

    artifacts.add(outputFolder)

    const statsArray = stats.stats || [ stats ]

    statsArray.forEach(stat => {
      if (stat.hasErrors() !== true) {
        return
      }

      const info = stat.toJson()
      const errNumber = info.errors.length
      const errDetails = `${errNumber} error${errNumber > 1 ? 's' : ''}`

      warn()
      warn(chalk.red(`${errDetails} encountered:\n`))

      info.errors.forEach(err => {
        console.error(err)
      })

      warn()
      warn(chalk.red(`[FAIL] Build failed with ${errDetails}. Check log above.\n`))

      process.exit(1)
    })

    const printWebpackStats = require('../lib/helpers/print-webpack-stats')

    console.log()
    statsArray.forEach((stats, index) => {
      printWebpackStats(stats, webpackData.folder[index], webpackData.name[index])
    })

    // free up memory
    webpackData = void 0

    finalizeBuild(argv.mode, ctx, quasarConfFile).then(async () => {
      outputFolder = argv.mode === 'cordova'
        ? path.join(outputFolder, '..')
        : outputFolder

      banner(argv, 'build', { outputFolder, transpileBanner: quasarConf.__transpileBanner })

      if (typeof quasarConf.build.afterBuild === 'function') {
        await quasarConf.build.afterBuild({ quasarConf })
      }

      // run possible beforeBuild hooks
      await extensionRunner.runHook('afterBuild', async hook => {
        log(`Extension(${hook.api.extId}): Running afterBuild hook...`)
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
        await extensionRunner.runHook('onPublish', async hook => {
          log(`Extension(${hook.api.extId}): Running onPublish hook...`)
          await hook.fn(hook.api, opts)
        })
      }
    })
  })
}

build()
