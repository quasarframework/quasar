const warn = require('./logger')('app:ensure-argv', 'red')

module.exports = function (argv, cmd) {
  if (argv.mode) {
    if (argv.mode === 'ios') {
      argv.m = argv.mode = 'cordova'
      argv.T = argv.target = 'ios'

      console.log()
      console.log(` Converting to long form: -m cordova -T ios`)
    }
    else if (argv.mode === 'android') {
      argv.m = argv.mode = 'cordova'
      argv.T = argv.target = 'android'

      console.log()
      console.log(` Converting to long form: -m cordova -T android`)
    }
  }

  if (!['spa', 'pwa', 'cordova', 'electron', 'ssr'].includes(argv.mode)) {
    warn(`⚠️  Unknown mode "${ argv.mode }"`)
    warn()
    process.exit(1)
  }

  if (cmd === 'inspect') {
    return
  }

  if (argv.mode === 'cordova') {
    const targets = ['android', 'ios', 'blackberry10', 'browser', 'osx', 'ubuntu', 'webos', 'windows']
    if (!argv.target) {
      warn(`⚠️  Please also specify a target (-T <${targets.join('|')}>)`)
      warn()
      process.exit(1)
    }
    if (!targets.includes(argv.target)) {
      warn(`⚠️  Unknown target "${ argv.target }" for Cordova`)
      warn()
      process.exit(1)
    }
  }

  if (cmd === 'build' && argv.mode === 'electron') {
    if (![undefined, 'packager', 'builder'].includes(argv.bundler)) {
      warn(`⚠️  Unknown bundler "${ argv.bundler }" for Electron`)
      warn()
      process.exit(1)
    }

    if ([undefined, 'packager'].includes(argv.bundler)) {
      if (![undefined, 'all', 'darwin', 'win32', 'linux', 'mas'].includes(argv.target)) {
        warn(`⚠️  Unknown target "${ argv.target }" for electron-packager`)
        warn()
        process.exit(1)
      }
      if (![undefined, 'ia32', 'x64', 'armv7l', 'arm64', 'mips64el', 'all'].includes(argv.arch)) {
        warn(`⚠️  Unknown architecture "${ argv.arch }" for electron-packager`)
        warn()
        process.exit(1)
      }
    }
    else { // electron-builder bundler
      if (![undefined, 'all', 'darwin', 'mac', 'win32', 'win', 'linux'].includes(argv.target)) {
        warn(`⚠️  Unknown target "${ argv.target }" for electron-builder`)
        warn()
        process.exit(1)
      }
      if (![undefined, 'ia32', 'x64', 'armv7l', 'arm64', 'all'].includes(argv.arch)) {
        warn(`⚠️  Unknown architecture "${ argv.arch }" for electron-builder`)
        warn()
        process.exit(1)
      }
    }
  }
}
