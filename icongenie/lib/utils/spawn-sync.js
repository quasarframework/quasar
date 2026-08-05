import crossSpawn from 'cross-spawn'
import { relative } from 'node:path'
import { isCI } from 'ci-info'

import {
  enterAlternateScreen,
  exitAlternateScreen,
  log,
  waitForKey
} from './logger.js'

const extraEnvParams = isCI
  ? {}
  : { FORCE_COLOR: process.env.FORCE_COLOR ?? '1' }

/*
 Returns nothing, takes onFail
 */
export async function spawnSync(cmd, params, opts) {
  const targetFolder = opts?.cwd
    ? ` in /${relative(process.cwd(), opts.cwd)}`
    : ''
  const message = `Running "${cmd} ${params.join(' ')}"${targetFolder}`

  log(message)
  enterAlternateScreen(message)

  const runner = crossSpawn.sync(cmd, params, {
    stdio: 'inherit',
    ...opts,
    env: { ...process.env, ...extraEnvParams, ...opts.env }
  })

  if (runner.error || runner.status || runner.status === null) {
    const errorMessage =
      runner.error?.code === 'ENOENT'
        ? `Command "${cmd}" not found! Please install it globally.`
        : runner.signal
          ? `Command "${cmd} ${params.join(' ')}" was terminated by signal: ${runner.signal}`
          : runner.status
            ? `Command "${cmd} ${params.join(' ')}" failed with exit code: ${runner.status}`
            : `Command "${cmd} ${params.join(' ')}" failed!`

    const msg = `⚠️  ⚠️  ⚠️  ${errorMessage} ⚠️  ⚠️  ⚠️ `

    console.log()
    console.error(msg)
    console.log()

    await waitForKey()
    exitAlternateScreen()
    console.error(msg)

    return false
  }

  exitAlternateScreen()
  log(`Executed "${cmd} ${params.join(' ')}"${targetFolder}`)
  return true
}
