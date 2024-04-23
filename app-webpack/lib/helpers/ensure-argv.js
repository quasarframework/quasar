const { fatal } = require('./logger')

module.exports = function (argv, cmd) {
  if (argv.mode) {
    if (argv.mode === 'ios') {
      argv.m = argv.mode = 'cordova'
      argv.T = argv.target = 'ios'

      console.log()
      console.log(' Converting to long form: -m cordova -T ios')
    }
    else if (argv.mode === 'android') {
      argv.m = argv.mode = 'cordova'
      argv.T = argv.target = 'android'

      console.log()
      console.log(' Converting to long form: -m cordova -T android')
    }
  }

  if (![ 'spa', 'pwa', 'cordova', 'capacitor', 'electron', 'ssr', 'bex' ].includes(argv.mode)) {
    fatal(`Unknown mode "${ argv.mode }"`)
  }

  if (cmd === 'inspect') {
    return
  }

  if (argv.mode === 'capacitor') {
    const targets = [ 'android', 'ios' ]
    if (!argv.target) {
      fatal(`Please also specify a target (-T <${ targets.join('|') }>)`)
    }
    if (!targets.includes(argv.target)) {
      fatal(`Unknown target "${ argv.target }" for Capacitor`)
    }
  }

  if (argv.mode === 'cordova') {
    const targets = [ 'android', 'ios', 'electron', 'blackberry10', 'browser', 'osx', 'ubuntu', 'webos', 'windows' ]
    if (!argv.target) {
      fatal(`Please also specify a target (-T <${ targets.join('|') }>)`)
    }
    if (!targets.includes(argv.target)) {
      fatal(`Unknown target "${ argv.target }" for Cordova\n`)
    }
  }

  if (cmd === 'build' && argv.mode === 'electron') {
    if (![ undefined, 'packager', 'builder' ].includes(argv.bundler)) {
      fatal(`Unknown bundler "${ argv.bundler }" for Electron`)
    }
  }
}

module.exports.ensureElectronArgv = function (bundlerName, argv) {
  if (![ 'packager', 'builder' ].includes(bundlerName)) {
    fatal(`Unknown bundler "${ bundlerName }" for Electron`)
  }

  if (bundlerName === 'packager') {
    if (![ undefined, 'all', 'darwin', 'win32', 'linux', 'mas' ].includes(argv.target)) {
      fatal(`Unknown target "${ argv.target }" for @electron/packager`)
    }
    if (![ undefined, 'ia32', 'x64', 'armv7l', 'arm64', 'mips64el', 'all' ].includes(argv.arch)) {
      fatal(`Unknown architecture "${ argv.arch }" for @electron/packager`)
    }
  }
  else { // electron-builder bundler
    if (![ undefined, 'all', 'darwin', 'mac', 'win32', 'win', 'linux' ].includes(argv.target)) {
      fatal(`Unknown target "${ argv.target }" for electron-builder`)
    }
    if (![ undefined, 'ia32', 'x64', 'armv7l', 'arm64', 'all' ].includes(argv.arch)) {
      fatal(`Unknown architecture "${ argv.arch }" for electron-builder`)
    }
  }
}
