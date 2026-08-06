import { existsSync } from 'node:fs'
import { join } from 'node:path'

// @quasar/vite-plugin reads this file at module load, so without a
// built ui package every suite touching the quasar config file dies
// with a cryptic ENOENT deep inside an import chain — fail the run
// up front with the actual instruction instead.
const probeFile = join(
  import.meta.dirname,
  '../ui/dist/transforms/loader-asset-urls.json'
)

export default function ensureUiIsBuilt() {
  if (!existsSync(probeFile)) {
    throw new Error(
      'The "quasar" (ui) package is not built — the app-vite test suites ' +
        'need it.\nBuild it first (from /app-vite):  pnpm --dir ../ui build\n' +
        'Rebuild it whenever the ui package changes.'
    )
  }
}
