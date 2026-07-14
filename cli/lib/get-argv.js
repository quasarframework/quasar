import { parseArgs } from 'node:util'
import { warn } from './logger.js'

export function getArgv(options, { strict = true } = {}) {
  try {
    const { values, positionals } = parseArgs({
      options,
      strict,
      allowPositionals: true
    })

    return { ...values, _: positionals }
  } catch (err) {
    return {
      help: true,
      _: [],

      // Should be handled if (argv.help) in the caller
      __warn() {
        warn(
          err instanceof Error
            ? err.message
            : 'Unknown error while parsing arguments'
        )
        warn()
        process.exit(1)
      }
    }
  }
}
