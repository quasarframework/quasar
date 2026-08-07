import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { ensureFreshBuild } from '../../ui/build/build-stamp.js'

// The plugin itself (src/index.js) reads this file at module load, so
// the suites need a fresh ui build — auto-built here when missing or
// stale (same self-healing as the dev scripts and the e2e registry).
const probeFile = join(
  import.meta.dirname,
  '../../ui/dist/transforms/loader-asset-urls.json'
)

export default function ensureUiIsBuilt() {
  ensureFreshBuild()

  // backstop: a "fresh" or just-built dist must actually contain what
  // the plugin reads at module load
  if (!existsSync(probeFile)) {
    throw new Error(
      `The ui build did not produce ${probeFile}, which the vite-plugin ` +
        'test suites need'
    )
  }
}
