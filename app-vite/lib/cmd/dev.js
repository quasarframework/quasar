if (process.env.NODE_ENV === void 0) {
  process.env.NODE_ENV = 'development'
}

const parseArgs = require('minimist')

const { log, fatal } = require('../helpers/logger')

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

    # alias for "quasar dev -m cordova -T ios"
    $ quasar dev -m ios

    # alias for "quasar dev -m cordova -T android"
    $ quasar dev -m android

    # passing extra parameters and/or options to
    # underlying "cordova" or "electron" executables:
    $ quasar dev -m ios -- some params --and options --here
    $ quasar dev -m electron -- --no-sandbox --disable-setuid-sandbox
    # when on Windows and using Powershell:
    $ quasar dev -m ios '--' some params --and options --here
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
                        booting up the emulator, in which case the "--emulator"
                        param will have no effect

    Only for Capacitor mode:
    --target, -T     (required) App target [android|ios]
  `)
  process.exit(0)
}

const ensureArgv = require('../helpers/ensure-argv')
ensureArgv(argv, 'dev')

console.log(
  require('fs').readFileSync(
    require('path').join(__dirname, '../../assets/logo.art'),
    'utf8'
  )
)

async function startVueDevtools (devtoolsPort) {
  const { spawn } = require('../helpers/spawn')
  const getPackagePath = require('../helpers/get-package-path')

  let vueDevtoolsBin = getPackagePath('.bin/vue-devtools')

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
    await run()
    return
  }

  const nodePackager = require('../helpers/node-packager')

  nodePackager.installPackage('@vue/devtools', { isDevDependency: true })

  // a small delay is a must, otherwise require.resolve
  // after a yarn/npm install will fail
  return new Promise(resolve => {
    vueDevtoolsBin = getPackagePath('.bin/vue-devtools')
    run().then(resolve)
  })
}

async function goLive () {
  // install mode if it's missing
  const { add } = require(`../modes/${ argv.mode }/${ argv.mode }-installation`)
  await add(true, argv.target)

  const getQuasarCtx = require('../helpers/get-quasar-ctx')
  const ctx = getQuasarCtx({
    mode: argv.mode,
    target: argv.target,
    emulator: argv.emulator,
    dev: true,
    vueDevtools: argv.devtools
  })

  // register app extensions
  const extensionRunner = require('../app-extension/extensions-runner')
  await extensionRunner.registerExtensions(ctx)

  const QuasarConfFile = require('../quasar-config-file')
  const quasarConfFile = new QuasarConfFile({
    ctx,
    port: argv.port,
    host: argv.hostname,
    verifyAddress: true
  })

  const quasarConf = await quasarConfFile.read()
  if (quasarConf.error !== void 0) {
    fatal(quasarConf.error, 'FAIL')
  }

  const regenerateTypesFeatureFlags = require('../helpers/types-feature-flags')
  regenerateTypesFeatureFlags(quasarConf)

  if (quasarConf.metaConf.vueDevtools !== false) {
    await startVueDevtools(quasarConf.metaConf.vueDevtools.port)
  }

  const AppDevServer = require(`../modes/${ argv.mode }/${ argv.mode }-devserver`)
  const devServer = new AppDevServer({ argv, ctx, quasarConf })

  if (typeof quasarConf.build.beforeDev === 'function') {
    await quasarConf.build.beforeDev({ quasarConf })
  }

  // run possible beforeDev hooks
  await extensionRunner.runHook('beforeDev', async hook => {
    log(`Extension(${ hook.api.extId }): Running beforeDev hook...`)
    await hook.fn(hook.api, { quasarConf })
  })

  devServer.run(quasarConf)
    .then(async () => {
      if (typeof quasarConf.build.afterDev === 'function') {
        await quasarConf.build.afterDev({ quasarConf })
      }
      // run possible afterDev hooks
      await extensionRunner.runHook('afterDev', async hook => {
        log(`Extension(${ hook.api.extId }): Running afterDev hook...`)
        await hook.fn(hook.api, { quasarConf })
      })
    })

  quasarConfFile.watch(quasarConf => {
    devServer.run(quasarConf)
  })
}

goLive()
