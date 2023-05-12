const crossSpawn = require('cross-spawn')

const { log, warn, fatal } = require('./logger.js')

/*
 Returns pid, takes onClose
 */
module.exports.spawn = function spawn (cmd, params, opts, onClose) {
  if (!cmd) {
    fatal('Command name was not available. Please run again.')
  }

  const targetFolder = opts && opts.cwd
    ? ` in ${ opts.cwd }`
    : ''

  log(`Running "${ cmd } ${ params.join(' ') }"${ targetFolder }`)
  log()

  const runner = crossSpawn(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', ...opts }
  )

  runner.on('close', code => {
    log()
    if (code) {
      log(`Command "${ cmd }" failed with exit code: ${ code }`)
    }

    onClose && onClose(code)
  })

  if (opts.detach === true) {
    runner.unref()
  }

  return runner.pid
}

/*
 Returns nothing, takes onFail
 */
module.exports.spawnSync = function spawnSync (cmd, params, opts, onFail) {
  const targetFolder = opts && opts.cwd
    ? ` in ${ opts.cwd }`
    : ''

  log(`[sync] Running "${ cmd } ${ params.join(' ') }"${ targetFolder }`)
  log()

  const runner = crossSpawn.sync(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', ...opts }
  )

  if (runner.status || runner.error) {
    warn()
    warn(`Command "${ cmd }" failed with exit code: ${ runner.status }`)
    if (runner.status === null) {
      warn(`Please globally install "${ cmd }"`)
    }
    onFail && onFail()
    process.exit(1)
  }
}
