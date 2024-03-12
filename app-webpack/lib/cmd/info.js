const parseArgs = require('minimist')
const { green, gray } = require('kolorist')

const { getPackageJson } = require('../utils/get-package-json.js')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: [ 'h' ]
})

if (argv.help) {
  console.log(`
  Description
    Displays information about your machine and your Quasar App.

  Usage
    $ quasar info

  Options
    --help, -h     Displays this message
  `)
  process.exit(0)
}

const os = require('node:os')
const { sync: spawnSync } = require('cross-spawn')

const { getCtx } = require('../utils/get-ctx.js')
const { appPaths, appExt: { extensionList } } = getCtx()

function getSpawnOutput (command) {
  try {
    const child = spawnSync(command, [ '--version' ])
    return child.status === 0
      ? green(String(child.output[ 1 ]).trim())
      : gray('Not installed')
  }
  catch (err) {
    return gray('Not installed')
  }
}

function safePkgInfo (pkg, dir) {
  const json = getPackageJson(pkg, dir)

  if (json !== void 0) {
    return {
      key: `  ${ String(json.name).trim() }`,
      value: `${ green(String(json.version).trim()) }${ json.description ? ` -- ${ json.description }` : '' }`
    }
  }
  else {
    return {
      key: `  ${ pkg }`,
      value: gray('Not installed')
    }
  }
}

function print (m) {
  console.log(`${ m.section ? '\n' : '' }${ m.key }${ m.value === undefined ? '' : ' - ' + m.value }`)
}

print({ key: 'Operating System', value: green(`${ os.type() }(${ os.release() }) - ${ os.platform() }/${ os.arch() }`), section: true })
print({ key: 'NodeJs', value: green(process.version.slice(1)) })
print({ key: 'Global packages', section: true })
print({ key: '  NPM', value: getSpawnOutput('npm') })
print({ key: '  yarn', value: getSpawnOutput('yarn') })
print({ key: '  pnpm', value: getSpawnOutput('pnpm') })
print({ key: '  bun', value: getSpawnOutput('bun') })
print({ key: '  @quasar/cli', value: green(process.env.QUASAR_CLI_VERSION) })
print({ key: '  @quasar/icongenie', value: getSpawnOutput('icongenie') })
print({ key: '  cordova', value: getSpawnOutput('cordova') })

print({ key: 'Important local packages', section: true })

;[
  'quasar',
  '@quasar/app-webpack',
  '@quasar/extras',
  'eslint-plugin-quasar',
  'vue',
  'vue-router',
  'pinia',
  'vuex',
  'eslint',
  'esbuild',
  'typescript',
  '@babel/core',
  'webpack',
  'webpack-dev-server',
  'workbox-webpack-plugin',
  'register-service-worker',
  'electron',
  'electron-packager',
  'electron-builder'
].forEach(pkg => print(safePkgInfo(pkg, appPaths.appDir)))

;[
  '@capacitor/core',
  '@capacitor/cli',
  '@capacitor/android',
  '@capacitor/ios'
].forEach(pkg => print(safePkgInfo(pkg, appPaths.capacitorDir)))

print({ key: 'Quasar App Extensions', section: true })

if (extensionList.length !== 0) {
  extensionList.forEach(ext => {
    print(safePkgInfo(ext.packageName, appPaths.appDir))
  })
}
else {
  print({ key: '  *None installed*' })
}

print({ key: 'Networking', section: true })
print({ key: '  Host', value: green(os.hostname()) })

const { getExternalNetworkInterface } = require('../utils/net.js')
getExternalNetworkInterface().forEach(intf => {
  print({
    key: `  ${ intf.deviceName }`,
    value: green(intf.address)
  })
})

console.log()
