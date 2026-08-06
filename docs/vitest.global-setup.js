import { existsSync } from 'node:fs'
import { join } from 'node:path'

// The ai-docs tests render real API JSON from the built ui package —
// fail the run up front with the actual instruction instead of
// letting those tests die on a missing file.
const probeFile = join(import.meta.dirname, '../ui/dist/api/QKnob.json')

export default function ensureUiIsBuilt() {
  if (!existsSync(probeFile)) {
    throw new Error(
      'The "quasar" (ui) package is not built — the docs test suite ' +
        'needs its generated API files.\n' +
        'Build it first (from the repo root):  pnpm --filter quasar build\n' +
        'Rebuild it whenever the ui package changes.'
    )
  }
}
