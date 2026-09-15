import { ensureFreshBuild } from './build-stamp.js'

// CLI wrapper, the `ensure-fresh-build` script (the ui/dist-consuming
// packages run it through `pnpm --filter quasar ensure-fresh-build`):
// builds the ui package only when dist is missing or stale, per the
// build stamp.
if (!ensureFreshBuild()) {
  console.log('ui/dist is fresh — skipping the ui build')
}
