import crossSpawn from 'cross-spawn'
import { relative } from 'node:path'
import { isCI } from 'ci-info'

import {
  cancelPromptSession,
  enterAlternateScreen,
  exitAlternateScreen,
  fatal,
  log,
  taskLogger,
  waitForKey
} from './logger.js'

const extraEnvParams = isCI
  ? {}
  : { FORCE_COLOR: process.env.FORCE_COLOR ?? '1' }

/*
 Returns nothing, takes onFail
 */
export async function spawnSync(cmd, params, opts, onFail) {
  opts ??= {}

  const targetFolder = opts?.cwd
    ? ` in /${relative(process.cwd(), opts.cwd)}`
    : ''
  const message = `Running "${cmd} ${params.join(' ')}"${targetFolder}`
  const taskLog = await taskLogger(message)

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
    taskLog.error(msg)
    cancelPromptSession('Operation failed.')

    onFail?.()
    process.exit(1)
  }

  exitAlternateScreen()
  taskLog.success(`Executed "${cmd} ${params.join(' ')}"${targetFolder}`)
}

/*
 Returns pid, takes onClose
 */
export function spawn(cmd, params, opts, onClose) {
  opts ??= {}

  if (!cmd) {
    fatal('Command name was not available. Please run again.')
  }

  const targetFolder = opts?.cwd
    ? ` in /${relative(process.cwd(), opts.cwd)}`
    : ''

  log(`Running "${cmd} ${params.join(' ')}"${targetFolder}`)
  log()

  const runner = crossSpawn(cmd, params, {
    stdio: 'inherit',
    ...opts,
    env: { ...process.env, ...opts.env, ...extraEnvParams }
  })

  runner.on('close', code => {
    log()
    if (code) {
      log(`Command "${cmd}" failed with exit code: ${code}`)
    }

    onClose?.(code)
  })

  if (opts.detach) runner.unref()
  return runner.pid
}
