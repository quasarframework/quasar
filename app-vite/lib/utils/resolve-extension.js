
import { existsSync } from 'node:fs'

const extensions = [ '', '.js', '.ts', '.jsx', '.tsx' ]

export function resolveExtension (file) {
  for (const ext of extensions) {
    const entry = file + ext
    if (existsSync(entry) === true) {
      return entry
    }
  }
}
