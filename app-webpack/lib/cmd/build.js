
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
  boolean: [ 'h', 'd', 'u', 'i' ],
  string: [ 'm', 'T', 'P' ],
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
    # when on Windows and using Powershell:
    $ quasar build -m ios '--' some params --and options --here

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

const { ensureArgv } = require('../utils/ensure-argv.js')
ensureArgv(argv, 'build')

const { ensureVueDeps } = require('../utils/ensure-vue-deps.js')
ensureVueDeps()

const path = require('node:path')

console.log(
  require('node:fs').readFileSync(
    path.join(__dirname, '../../assets/logo.art'),
    'utf8'
  )
)

const { displayBanner } = require('../utils/banner.js')
displayBanner(argv, 'build')

const { log, fatal } = require('../utils/logger.js')
const { printWebpackErrors } = require('../utils/print-webpack-issue/index.js')
const { webpackNames, splitWebpackConfig } = require('../webpack/symbols.js')

const webpack = require('webpack')

function parseWebpackConfig (cfg, mode) {
  let data = splitWebpackConfig(cfg, mode)

  if (mode === 'pwa') {
    // CSW needs to be compiled separately, before UI
    data = data.filter(entry => entry.name !== webpackNames.pwa.csw)
  }

  return {
    configs: data.map(d => d.webpack),
    name: data.map(d => d.name),
    folder: data.map(d => d.webpack.output.path)
  }
}

function finalizeBuild (mode, ctx, quasarConfFile) {
  let Runner

  if ([ 'cordova', 'capacitor' ].includes(mode)) {
    Runner = require(`../${ mode }/index.js`)
  }
  else if (argv[ 'skip-pkg' ] !== true && mode === 'electron') {
    Runner = require('../electron/index.js')
  }

  if (Runner !== void 0) {
    Runner.init(ctx)
    return Runner.build(quasarConfFile, argv)
  }

  return Promise.resolve()
}

async function build () {
  if (argv.mode !== 'spa') {
    const { installMissing } = require('../mode/install-missing.js')
    await installMissing(argv.mode, argv.target)
  }

  const { QuasarConfigFile } = require('../quasar-config-file.js')
  const { EntryFilesGenerator } = require('../entry-files-generator.js')
  const { cleanArtifacts, addArtifacts } = require('../artifacts.js')
  const { getQuasarCtx } = require('../utils/get-quasar-ctx.js')
  const { extensionsRunner } = require('../app-extension/extensions-runner.js')
  const regenerateTypesFeatureFlags = require('../utils/types-feature-flags.js')

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
  await extensionsRunner.registerExtensions(ctx)

  const quasarConfFile = new QuasarConfigFile(ctx, argv)

  const { quasarConf, webpackConf } = await quasarConfFile.read()

  const generator = new EntryFilesGenerator(quasarConfFile)

  regenerateTypesFeatureFlags(quasarConf)

  let outputFolder = quasarConf.build.packagedDistDir || quasarConf.build.distDir

  cleanArtifacts(quasarConf.build.distDir)
  if (quasarConf.build.packagedDistDir) {
    cleanArtifacts(quasarConf.build.packagedDistDir)
  }

  generator.build()

  if (typeof quasarConf.build.beforeBuild === 'function') {
    await quasarConf.build.beforeBuild({ quasarConf })
  }

  // run possible beforeBuild hooks
  await extensionsRunner.runHook('beforeBuild', async hook => {
    log(`Extension(${ hook.api.extId }): Running beforeBuild hook...`)
    await hook.fn(hook.api, { quasarConf })
  })

  // using quasarConfFile.ctx instead of argv.mode
  // because SSR might also have PWA enabled but we
  // can only know it after parsing the quasar.config file
  if (quasarConfFile.ctx.mode.pwa === true) {
    // need to build the custom service worker before renderer
    const Runner = require('../pwa/index.js')
    Runner.init(ctx)
    await Runner.build(quasarConfFile, argv)
  }

  let webpackData = parseWebpackConfig(webpackConf, argv.mode)

  webpack(webpackData.configs, async (err, stats) => {
    if (err) {
      console.error(err.stack || err)

      if (err.details) {
        console.error(err.details)
      }

      process.exit(1)
    }

    addArtifacts(quasarConf.build.distDir)
    if (quasarConf.build.packagedDistDir) {
      addArtifacts(quasarConf.build.packagedDistDir)
    }

    const statsArray = stats.stats

    statsArray.forEach((stats, index) => {
      if (stats.hasErrors() !== true) {
        return
      }

      const summary = printWebpackErrors(webpackData.name[ index ], stats)
      console.log()
      fatal(`for "${ webpackData.name[ index ] }" with ${ summary }. Please check the log above.`, 'COMPILATION FAILED')
    })

    const { printWebpackStats } = require('../utils/print-webpack-stats.js')

    console.log()
    statsArray.forEach((stats, index) => {
      printWebpackStats(stats, webpackData.folder[ index ], webpackData.name[ index ])
    })

    // free up memory
    webpackData = void 0

    finalizeBuild(argv.mode, ctx, quasarConfFile).then(async () => {
      outputFolder = argv.mode === 'cordova'
        ? path.join(outputFolder, '..')
        : outputFolder

      displayBanner(argv, 'build', { outputFolder, transpileBanner: quasarConf.__transpileBanner })

      if (typeof quasarConf.build.afterBuild === 'function') {
        await quasarConf.build.afterBuild({ quasarConf })
      }

      // run possible beforeBuild hooks
      await extensionsRunner.runHook('afterBuild', async hook => {
        log(`Extension(${ hook.api.extId }): Running afterBuild hook...`)
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
        await extensionsRunner.runHook('onPublish', async hook => {
          log(`Extension(${ hook.api.extId }): Running onPublish hook...`)
          await hook.fn(hook.api, opts)
        })
      }
    })
  })
}

build()
