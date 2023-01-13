import { log, fatal } from './logger.js'
import { default as crossSpawn } from 'cross-spawn'

export function spawn (cmd, params, cwd) {
  log(`Running "${cmd} ${params.join(' ')}"`)
  console.log()

  const runner = crossSpawn.sync(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', cwd }
  )

  if (runner.status || runner.error) {
    console.log()
    fatal(`⚠️  Command "${cmd}" failed with exit code: ${runner.status}`)
  }
}
