
const parseArgs = require('minimist')
const chalk = require('chalk')

const getPackageJson = require('../helpers/get-package-json')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: ['h']
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

const os = require('os')
const spawn = require('cross-spawn').sync

const appPaths = require('../app-paths')

function getSpawnOutput (command) {
  try {
    const child = spawn(command, ['--version'])
    return child.status === 0
      ? chalk.green(String(child.output[1]).trim())
      : chalk.grey('Not installed')
  }
  catch (err) {
    return chalk.grey('Not installed')
  }
}

function safePkgInfo (pkg, folder) {
  const json = getPackageJson(pkg, folder)

  if (json !== void 0) {
    return {
      key: `  ${String(json.name).trim()}`,
      value: `${chalk.green(String(json.version).trim())}${json.description ? ` -- ${json.description}` : ''}`
    }
  }
  else {
    return {
      key: `  ${pkg}`,
      value: chalk.grey('Not installed')
    }
  }
}

function print(m) {
  console.log(`${m.section ? '\n' : ''}${ m.key }${ m.value === undefined ? '' : ' - ' + m.value }`)
}

print({ key: 'Operating System', value: chalk.green(`${os.type()}(${os.release()}) - ${os.platform()}/${os.arch()}`), section: true })
print({ key: 'NodeJs', value: chalk.green(process.version.slice(1)) })
print({ key: 'Global packages', section: true })
print({ key: '  NPM', value: getSpawnOutput('npm') })
print({ key: '  yarn', value: getSpawnOutput('yarn') })
print({ key: '  @quasar/cli', value: chalk.green(process.env.QUASAR_CLI_VERSION) })
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
  'electron',
  'electron-packager',
  'electron-builder',
  '@babel/core',
  'webpack',
  'webpack-dev-server',
  'workbox-webpack-plugin',
  'register-service-worker',
  'typescript'
].forEach(pkg => print(safePkgInfo(pkg, appPaths.appDir)))

;[
  '@capacitor/core',
  '@capacitor/cli',
  '@capacitor/android',
  '@capacitor/ios',
].forEach(pkg => print(safePkgInfo(pkg, appPaths.capacitorDir)))

print({ key: 'Quasar App Extensions', section: true })

const extensionJson = require('../app-extension/extension-json')
const extensions = Object.keys(extensionJson.getList())

if (extensions.length > 0) {
  const Extension = require('../app-extension/Extension.js')
  extensions.forEach(ext => {
    const instance = new Extension(ext)
    print(safePkgInfo(instance.packageName))
  })
}
else {
  print({ key: '  *None installed*' })
}

print({ key: 'Networking', section: true })
print({ key: '  Host', value: chalk.green(os.hostname()) })

const getExternalIPs = require('../helpers/net').getExternalNetworkInterface
getExternalIPs().forEach(intf => {
  print({
    key: `  ${ intf.deviceName }`,
    value: chalk.green(intf.address)
  })
})

console.log()
