import { ensureFreshBuild } from './build-stamp.js'

// CLI wrapper (used by test:build): builds the docs site only when
// its inputs changed since the last successful build, per the stamp
if (!ensureFreshBuild()) {
  console.log('docs build is fresh — skipping')
}
