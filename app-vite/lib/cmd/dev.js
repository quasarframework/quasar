if (process.env.NODE_ENV === void 0) {
  process.env.NODE_ENV = 'development'
}

import parseArgs from 'minimist'

import { log } from '../utils/logger.js'

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
    --hostname, -H   A hostname to use for serving the application
    --help, -h       Displays this message

    Only for Cordova mode:
    --target, -T     (required) App target
                        [android|ios]
    --emulator, -e   (optional) Emulator name
                        Examples: iPhone-7, iPhone-X
                        iPhone-X,com.apple.CoreSimulator.SimRuntime.iOS-12-2
    --ide, -i        Open IDE (Android Studio / XCode) instead of letting Cordova
                        booting up the emulator, in which case the "--emulator"
                        param will have no effect

    --devtools, -d   Open remote Vue Devtools

    Only for Capacitor mode:
    --target, -T     (required) App target
                        [android|ios]
  `)
  process.exit(0)
}

import { ensureArgv } from '../utils/ensure-argv.js'
ensureArgv(argv, 'dev')

import { readFileSync } from 'node:fs'

console.log(
  readFileSync(
    new URL('../../assets/logo.art', import.meta.url),
    'utf8'
  )
)

async function startVueDevtools () {
  const { spawn } = await import('../utils/spawn.js')
  const { getPackagePath } = await import('../utils/get-package-path.js')

  let vueDevtoolsBin = getPackagePath('@vue/devtools/bin.js')

  function run () {
    log('Booting up remote Vue Devtools...')
    spawn(vueDevtoolsBin, [], {})
  }

  if (vueDevtoolsBin !== void 0) {
    run()
    return
  }

  const { nodePackager } = await import('../utils/node-packager.js')

  nodePackager.installPackage('@vue/devtools', { isDevDependency: true })

  // a small delay is a must, otherwise require.resolve
  // after a yarn/npm install will fail
  return new Promise(resolve => {
    vueDevtoolsBin = getPackagePath('@vue/devtools/bin.js')
    run()
    resolve()
  })
}

// install mode if it's missing
const { addMode } = await import(`../modes/${ argv.mode }/${ argv.mode }-installation.js`)
await addMode(true, argv.target)

import { getQuasarCtx } from '../utils/get-quasar-ctx.js'
const ctx = getQuasarCtx({
  mode: argv.mode,
  target: argv.target,
  emulator: argv.emulator,
  dev: true,
  vueDevtools: argv.devtools
})

// register app extensions
import { extensionRunner } from '../app-extension/extensions-runner.js'
await extensionRunner.registerExtensions(ctx)

import { QuasarConfigFile } from '../quasar-config-file.js'
const quasarConfFile = new QuasarConfigFile({
  ctx,
  port: argv.port,
  host: argv.hostname,
  watch: quasarConf => {
    log('Applying quasar.config file changes...')
    devServer.run(quasarConf)
  }
})

await quasarConfFile.init()

const quasarConf = await quasarConfFile.read()

import { regenerateTypesFeatureFlags } from '../utils/types-feature-flags.js'
await regenerateTypesFeatureFlags(quasarConf)

if (quasarConf.metaConf.vueDevtools !== false) {
  await startVueDevtools()
}

const { QuasarModeDevserver } = await import(`../modes/${ argv.mode }/${ argv.mode }-devserver.js`)
const devServer = new QuasarModeDevserver({ argv, ctx, quasarConf })

if (typeof quasarConf.build.beforeDev === 'function') {
  await quasarConf.build.beforeDev({ quasarConf })
}

// run possible beforeDev hooks
await extensionRunner.runHook('beforeDev', async hook => {
  log(`Extension(${ hook.api.extId }): Running beforeDev hook...`)
  await hook.fn(hook.api, { quasarConf })
})

devServer.run(quasarConf).then(async () => {
  if (typeof quasarConf.build.afterDev === 'function') {
    await quasarConf.build.afterDev({ quasarConf })
  }

  // run possible afterDev hooks
  await extensionRunner.runHook('afterDev', async hook => {
    log(`Extension(${ hook.api.extId }): Running afterDev hook...`)
    await hook.fn(hook.api, { quasarConf })
  })

  quasarConfFile.watch()
})
