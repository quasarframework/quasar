import { existsSync } from 'node:fs'
import { join } from 'node:path'

// The plugin itself (src/index.js) reads this file at module load, so
// without a built ui package every suite dies with a cryptic ENOENT
// deep inside an import chain — fail the run up front with the actual
// instruction instead.
const probeFile = join(
  import.meta.dirname,
  '../../ui/dist/transforms/loader-asset-urls.json'
)

export default function ensureUiIsBuilt() {
  if (!existsSync(probeFile)) {
    throw new Error(
      'The "quasar" (ui) package is not built — the vite-plugin test ' +
        'suites need it.\nBuild it first (from the repo root):  pnpm build\n' +
        'Rebuild it whenever the ui package changes.'
    )
  }
}
