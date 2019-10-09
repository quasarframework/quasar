const fs = require('fs')
const path = require('path')
const open = require('open')
const { execSync } = require('child_process')

const appPaths = require('../app-paths')
const warn = require('./logger')('app:open-ide', 'red')

function findXcodeWorkspace (folder, end) {
  const root = fs.readdirSync(folder)

  for (let item of root) {
    const __path = path.join(folder, item)

    if (item.endsWith('.xcworkspace')) {
      return __path
    }
    else if (end !== true && fs.lstatSync(__path).isDirectory()) {
      const res = findXcodeWorkspace(__path, true)
      if (res) {
        return res
      }
    }
  }
}

function runMacOS (mode, target) {
  if (target === 'ios') {
    const folder = mode === 'cordova'
      ? appPaths.resolve.cordova('platforms/ios')
      : appPaths.resolve.capacitor('ios')

    open(findXcodeWorkspace(folder), {
      wait: false
    })
  }
  else {
    const folder = mode === 'cordova'
      ? appPaths.resolve.cordova('platforms/android')
      : appPaths.resolve.capacitor('android')

    open(folder, {
      app: 'android studio',
      wait: false
    })
  }
}

function getLinuxPath () {
  const canonicalPaths = [
    '/usr/local/android-studio/bin/studio.sh',
    '/opt/android-studio/bin/studio.sh'
  ]

  for (let studioPath of canonicalPaths) {
    if (fs.existsSync(studioPath)) {
      return studioPath
    }
  }
}

function runLinux (mode, target) {
  if (target === 'android') {
    const studioPath = getLinuxPath()
    if (studioPath) {
      const folder = mode === 'cordova'
        ? appPaths.resolve.cordova('platforms/android')
        : appPaths.resolve.capacitor('android')

      open(folder, {
        app: studioPath,
        wait: false
      })
      return
    }
  }

  warn(`⚠️  Cannot determine path to IDE executable`)
  process.exit(1)
}

function getWindowsPath () {
  const studioPath = 'C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe'
  if (fs.existsSync(studioPath)) {
    return studioPath
  }

  try {
    const buffer = execSync('REG QUERY "HKEY_LOCAL_MACHINE\\SOFTWARE\\Android Studio" /v Path')
    const bufferString = buffer.toString('utf-8').replace(/(\r\n|\n|\r)/gm, '')
    const index = bufferString.indexOf('REG_SZ')

    if (index > 0) {
      const asPath = bufferString.substring(ix + 6).trim() + '\\bin\\studio64.exe'
      if (fs.existsSync(asPath)) {
        return asPath
      }
    }
  }
  catch (e) {}
}

function runWindows (mode, target) {
  if (target === 'android') {
    const studioPath = getWindowsPath()
    if (studioPath) {
      const folder = mode === 'cordova'
        ? appPaths.resolve.cordova('platforms/android')
        : appPaths.resolve.capacitor('android')

      open(folder, {
        app: studioPath,
        wait: false
      })
      return
    }
  }

  warn(`⚠️  Cannot determine path to IDE executable`)
  process.exit(1)
}

module.exports = function (mode, target, dev) {
  console.log()
  console.log(` ⚠️  `)
  console.log(` ⚠️  Opening ${target === 'ios' ? 'XCode' : 'Android Studio'} IDE...`)
  if (dev) {
    console.log(` ⚠️  From there, use the IDE to run the app.`)
    console.log(` ⚠️  DO NOT close the terminal as this will kill the devserver.`)
  }
  else {
    console.log(` ⚠️  From there, use the IDE to build the final package.`)
  }
  console.log(` ⚠️  `)
  console.log()

  switch (process.platform) {
    case 'darwin':
      return runMacOS(mode, target)
    case 'linux':
      return runLinux(mode, target)
    case 'win32':
      return runWindows(mode, target)
    default:
      warn(`⚠️  Unsupported host OS for opening the IDE`)
      process.exit(1)
  }
}
