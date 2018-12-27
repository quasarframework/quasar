const
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:ensure-dev-deps'),
  warn = logger('app:ensure-dev-deps', 'red'),
  spawn = require('./spawn'),
  nodePackager = require('./node-packager')

function needsStripAnsi (pkg) {
  if (pkg.devDependencies && pkg.devDependencies['strip-ansi'] && pkg.devDependencies['strip-ansi'].indexOf('3.0.1') > -1) {
    return false
  }
  if (pkg.dependencies && pkg.dependencies['strip-ansi'] && pkg.dependencies['strip-ansi'].indexOf('3.0.1') > -1) {
    return false
  }

  return true
}

module.exports = function () {
  const pkg = require(appPaths.resolve.app('package.json'))

  if (needsStripAnsi(pkg)) {
    const cmdParam = nodePackager === 'npm'
      ? ['install', '--save-dev']
      : ['add', '--dev']

    cmdParam.push('strip-ansi@=3.0.1')

    log(`Pinning strip-ansi dependency...`)
    spawn.sync(
      nodePackager,
      cmdParam,
      appPaths.appDir,
      () => warn('Failed to install strip-ansi dependency')
    )
  }
}
