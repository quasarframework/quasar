if (process.env.NODE_ENV === void 0) {
  process.env.NODE_ENV = 'development'
}

import { getArgv } from '../utils/get-argv.js'
import { log } from '../utils/logger.js'

const argv = getArgv({
  mode: { type: 'string', short: 'm', default: 'spa' },
  target: { type: 'string', short: 'T' }, // cordova/capacitor/bex mode only
  port: { type: 'string', short: 'p' },
  hostname: { type: 'string', short: 'H' },
  devtools: { type: 'boolean', short: 'd' },
  ide: { type: 'boolean', short: 'i' },
  'no-color': { type: 'boolean' },
  help: { type: 'boolean', short: 'h' }
})

if (argv.help) {
  console.log(`
  Description
    Starts the app in development mode (HMR, error reporting, etc)

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
    $ quasar dev -m electron -- --force-device-scale-factor=1
    # when on Windows and using Powershell:
    $ quasar dev -m cordova -T ios '--' some params --and options --here
    $ quasar dev -m electron '--' --force-device-scale-factor=1

  Options
    --mode, -m       App mode [spa|ssr|ssg|pwa|cordova|capacitor|electron|bex] (default: spa)
    --port, -p       A port number on which to start the application
    --hostname, -H   A hostname to use for serving the application
    --target, -T     App target
                       - Capacitor & Cordova: [android|ios]
                       - Bex: [chrome|firefox]
    --devtools, -d   Open remote Vue Devtools
    --no-color       Disable colored output
    --help, -h       Displays this message

    Only for Capacitor & Cordova modes:
    --ide, -i        (prod only) Open IDE to build the app instead of using CLI tools

  `)

  argv.__warn?.()
  process.exit(0)
}

const { showCliBanner } = await import('@quasar/art')
showCliBanner()

const { ensureArgv } = await import('../utils/ensure-argv.js')
ensureArgv(argv, 'dev')

async function startVueDevtools(ctx, devtoolsPort) {
  const {
    appPaths: { appDir },
    cacheProxy
  } = ctx

  const { spawn } = await import('../utils/spawn.js')
  const { getPackagePath } = await import('../utils/get-package-path.js')

  let vueDevtoolsBin = getPackagePath('.bin/vue-devtools', appDir)

  async function run() {
    log('Booting up remote Vue Devtools...')
    spawn(vueDevtoolsBin, [], {
      env: {
        ...process.env,
        PORT: devtoolsPort
      }
    })

    log('Waiting for remote Vue Devtools to initialize...')
    const { promise, resolve } = Promise.withResolvers()
    setTimeout(resolve, 1000)
    await promise
  }

  if (vueDevtoolsBin !== void 0) {
    await run()
    return
  }

  const nodePackager = await cacheProxy.getModule('nodePackager')
  await nodePackager.installPackage('@vue/devtools', { isDevDependency: true })

  // a small delay is a must, otherwise require.resolve
  // after a installing the dependencies will fail
  vueDevtoolsBin = getPackagePath('.bin/vue-devtools', appDir)
  await run()
}

const { getCtx } = await import('../utils/get-ctx.js')
const ctx = getCtx({
  mode: argv.mode,
  target: argv.target,
  dev: true,
  vueDevtools: argv.devtools
})

// install mode if it's missing
const { addMode } = await import(
  `../modes/${argv.mode}/${argv.mode}-installation.js`
)
await addMode({ ctx, silent: true, target: argv.target })

const { QuasarConfigFile } = await import('../quasar-config-file.js')
const quasarConfFile = new QuasarConfigFile({
  ctx,
  port: argv.port,
  host: argv.hostname,
  verifyAddress: true,
  watch: true
})

const quasarConf = await quasarConfFile.read()

if (quasarConf.metaConf.vueDevtools) {
  await startVueDevtools(ctx, quasarConf.metaConf.vueDevtools.port)
}

const { QuasarModeDevserver } = await import(
  `../modes/${argv.mode}/${argv.mode}-devserver.js`
)
const devServer = new QuasarModeDevserver({ argv, ctx })

if (typeof quasarConf.build.beforeDev === 'function') {
  await quasarConf.build.beforeDev({ quasarConf })
}

// run possible beforeDev hooks
await ctx.appExt.runAppExtensionHook('beforeDev', async hook => {
  hook.api.logger.log(`Running beforeDev hook...`)
  await hook.fn(hook.api, { quasarConf })
})

const onQuasarConfChange = qConf => {
  log('Applying quasar.config changes...')
  devServer.run(qConf)
}

await devServer.run(quasarConf)

if (typeof quasarConf.build.afterDev === 'function') {
  await quasarConf.build.afterDev({ quasarConf })
}

// run possible afterDev hooks
await ctx.appExt.runAppExtensionHook('afterDev', async hook => {
  hook.api.logger.log(`Running afterDev hook...`)
  await hook.fn(hook.api, { quasarConf })
})

quasarConfFile.watch(onQuasarConfChange)
