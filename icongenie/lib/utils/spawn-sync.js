
import crossSpawn from 'cross-spawn'

import { log, warn } from './logger.js'

export function spawnSync (cmd, params, opts, onFail) {
  log(`[sync] Running "${ cmd } ${ params.join(' ') }"\n`)

  const runner = crossSpawn.sync(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', ...opts }
  )

  if (runner.status || runner.error) {
    warn()
    warn(`Command "${ cmd }" failed with exit code: ${ runner.status }`)
    onFail && onFail()
  }
}
