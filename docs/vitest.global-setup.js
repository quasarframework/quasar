import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { ensureFreshBuild } from '../ui/build/build-stamp.js'

// The ai-docs tests render real API JSON from the built ui package —
// auto-built here when missing or stale (same self-healing as the dev
// scripts and the e2e registry).
const probeFile = join(import.meta.dirname, '../ui/dist/api/QKnob.json')

export default function ensureUiIsBuilt() {
  ensureFreshBuild()

  // backstop: a "fresh" or just-built dist must actually contain the
  // generated API files the ai-docs tests render
  if (!existsSync(probeFile)) {
    throw new Error(
      `The ui build did not produce ${probeFile}, which the docs ` +
        'test suite needs'
    )
  }
}
