import { ensureFreshBuild } from './build-stamp.js'

// CLI wrapper (used by the dev scripts of the ui/dist-consuming
// packages and by vite-plugin's prepublishOnly): builds the ui package
// only when dist is missing or stale, per the build stamp.
if (!ensureFreshBuild()) {
  console.log('ui/dist is fresh — skipping the ui build')
}
