import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getCallerPath () {
  const _prepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = (_, stack) => stack
  const stack = new Error().stack.slice(1)
  Error.prepareStackTrace = _prepareStackTrace
  const filename = stack[ 1 ].getFileName()
  return dirname(
    filename.startsWith('file://')
      ? fileURLToPath(filename)
      : filename
  )
}
