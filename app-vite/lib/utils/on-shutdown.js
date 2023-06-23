import { log } from './logger.js'

export function onShutdown (fn, msg) {
  const cleanup = () => {
    try {
      msg && log(msg)
      fn()
    }
    finally {
      process.exit()
    }
  }

  process.on('exit', cleanup)
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
  process.on('SIGHUP', cleanup)
  process.on('SIGBREAK', cleanup)
}
