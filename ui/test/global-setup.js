import { ensureFreshBuild } from '../build/build-stamp.js'

// Freshness guard for run paths that bypass the package scripts'
// pretest hooks (the workspace-root IDE projects config): the suites
// read ui/dist (css through the sass alias, the server bundle for
// hydration), so a stale dist must self-heal here too.
export default function globalSetup() {
  ensureFreshBuild()
}
