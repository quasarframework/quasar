import crossSpawn from 'cross-spawn'
import { log, warn, fatal } from './logger.js'

/*
 Returns pid, takes onClose
 */
export function spawn (cmd, params, opts, onClose) {
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
export function spawnSync (cmd, params, opts, onFail) {
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
