if (process.env.NODE_ENV === void 0) {
  process.env.NODE_ENV = 'development'
}

const parseArgs = require('minimist')

const { log } = require('../utils/logger.js')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    m: 'mode',
    T: 'target', // cordova/capacitor mode only
    e: 'emulator', // cordova-mode only
    p: 'port',
    H: 'hostname',
    i: 'ide',
    h: 'help',
    d: 'devtools'
  },
  boolean: [ 'h', 'i', 'd' ],
  string: [ 'm', 'T', 'H' ],
  default: {
    m: 'spa'
  }
})

if (argv.help) {
  console.log(`
  Description
    Starts the app in development mode (hot-code reloading, error
    reporting, etc)

  Usage
    $ quasar dev
    $ quasar dev -p <port number>

    $ quasar dev -m ssr

    # alias for "quasar dev -m capacitor -T ios"
    $ quasar dev -m ios

    # alias for "quasar dev -m capacitor -T android"
    $ quasar dev -m android

    # passing extra parameters and/or options to
    # underlying "cordova" or "electron" executables:
    $ quasar dev -m cordova -T ios -- some params --and options --here
    $ quasar dev -m electron -- --no-sandbox --disable-setuid-sandbox
    # when on Windows and using Powershell:
    $ quasar dev -m cordova -T ios '--' some params --and options --here
    $ quasar dev -m electron '--' --no-sandbox --disable-setuid-sandbox

  Options
    --mode, -m       App mode [spa|ssr|pwa|cordova|capacitor|electron|bex] (default: spa)
    --port, -p       A port number on which to start the application
    --devtools, -d   Open remote Vue Devtools
    --hostname, -H   A hostname to use for serving the application
    --help, -h       Displays this message

    Only for Cordova mode:
    --target, -T     (required) App target [android|ios]
    --emulator, -e   (optional) Emulator name
                        Examples: iPhone-7, iPhone-X
                        iPhone-X,com.apple.CoreSimulator.SimRuntime.iOS-12-2
    --ide, -i        Open IDE (Android Studio / XCode) instead of letting Cordova
                       boot up the emulator / building in terminal, in which case
                       the "--emulator" param will have no effect

    Only for Capacitor mode:
    --target, -T     (required) App target [android|ios]
  `)
  process.exit(0)
}

const { ensureArgv } = require('../utils/ensure-argv.js')
ensureArgv(argv, 'dev')

const { readFileSync } = require('node:fs')
const { join } = require('node:path')

console.log(
  readFileSync(
    join(__dirname, '../../assets/logo.art'),
    'utf8'
  )
)

function startVueDevtools (ctx, devtoolsPort) {
  const { appPaths: { appDir }, cacheProxy } = ctx

  const { spawn } = require('../utils/spawn.js')
  const { getPackagePath } = require('../utils/get-package-path.js')

  let vueDevtoolsBin = getPackagePath('.bin/vue-devtools', appDir)

  function run () {
    log('Booting up remote Vue Devtools...')
    spawn(vueDevtoolsBin, [], {
      env: {
        ...process.env,
        PORT: devtoolsPort
      }
    })

    log('Waiting for remote Vue Devtools to initialize...')
    return new Promise(resolve => {
      setTimeout(resolve, 1000)
    })
  }

  if (vueDevtoolsBin !== void 0) {
    return run()
  }

  const nodePackager = cacheProxy.getModule('nodePackager')
  nodePackager.installPackage('@vue/devtools', { isDevDependency: true })

  // a small delay is a must, otherwise require.resolve
  // after a installing the dependencies will fail
  return new Promise(resolve => {
    vueDevtoolsBin = getPackagePath('.bin/vue-devtools', appDir)
    run().then(resolve)
  })
}

const { getCtx } = require('../utils/get-ctx.js')
const ctx = getCtx({
  mode: argv.mode,
  target: argv.target,
  emulator: argv.emulator,
  dev: true,
  vueDevtools: argv.devtools
})

async function runDev () {
  // install mode if it's missing
  const { addMode } = require(`../modes/${ argv.mode }/${ argv.mode }-installation.js`)
  await addMode({ ctx, silent: true, target: argv.target })

  const { QuasarConfigFile } = require('../quasar-config-file.js')
  const quasarConfFile = new QuasarConfigFile({
    ctx,
    port: argv.port,
    host: argv.hostname,
    verifyAddress: true,
    watch: quasarConf => {
      log('Applying quasar.config file changes...')
      devServer.run(quasarConf)
    }
  })

  await quasarConfFile.init()

  const quasarConf = await quasarConfFile.read()

  const { ensureTypesFeatureFlags } = require('../utils/types-feature-flags.js')
  ensureTypesFeatureFlags(quasarConf)

  if (quasarConf.metaConf.vueDevtools !== false) {
    await startVueDevtools(ctx, quasarConf.metaConf.vueDevtools.port)
  }

  const { QuasarModeDevserver } = require(`../modes/${ argv.mode }/${ argv.mode }-devserver.js`)
  const devServer = new QuasarModeDevserver({ argv, ctx })

  if (typeof quasarConf.build.beforeDev === 'function') {
    await quasarConf.build.beforeDev({ quasarConf })
  }

  // run possible beforeDev hooks
  await ctx.appExt.runAppExtensionHook('beforeDev', async hook => {
    log(`Extension(${ hook.api.extId }): Running beforeDev hook...`)
    await hook.fn(hook.api, { quasarConf })
  })

  devServer.run(quasarConf).then(async () => {
    if (typeof quasarConf.build.afterDev === 'function') {
      await quasarConf.build.afterDev({ quasarConf })
    }

    // run possible afterDev hooks
    await ctx.appExt.runAppExtensionHook('afterDev', async hook => {
      log(`Extension(${ hook.api.extId }): Running afterDev hook...`)
      await hook.fn(hook.api, { quasarConf })
    })

    quasarConfFile.watch()
  })
}

runDev()
