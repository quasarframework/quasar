const
  logger = require('./logger'),
  log = logger('app:spawn'),
  warn = logger('app:spawn', 'red'),
  crossSpawn = require('cross-spawn')

/*
 Returns pid, takes onClose
 */
module.exports.spawn = function (cmd, params, cwd, onClose) {
  log(`Running "${cmd} ${params.join(' ')}"`)
  log()

  const runner = crossSpawn(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', cwd }
  )

  runner.on('close', code => {
    log()
    if (code) {
      log(`Command "${cmd}" failed with exit code: ${code}`)
    }

    onClose && onClose(code)
  })

  return runner.pid
}

/*
 Returns nothing, takes onFail
 */
module.exports.spawnSync = function (cmd, params, cwd, onFail) {
  log(`[sync] Running "${cmd} ${params.join(' ')}"`)
  log()

  const runner = crossSpawn.sync(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', cwd }
  )

  if (runner.status || runner.error) {
    warn()
    warn(`⚠️  Command "${cmd}" failed with exit code: ${runner.status}`)
    if (runner.status === null) {
      warn(`⚠️  Please globally install "${cmd}"`)
    }
    onFail && onFail()
    process.exit(1)
  }
}

module.exports.spawnAE = function (cmd, params, cwd, opts, sync) {
  log(`[sync] Running "${cmd} ${params.join(' ')}"`)
  log()

  const spawnOpts = Object.assign(
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', cwd },
    opts
  )

  if (sync !== true) {
    return crossSpawn(
      cmd,
      params,
      spawnOpts
    )
  }

  return new Promise((resolve, reject) => {
    const runner = crossSpawn.sync(
      cmd,
      params,
      spawnOpts
    )

    if (runner.status || runner.error) {
      reject(runner)
    }
    else {
      resolve(runner)
    }
  })
}
