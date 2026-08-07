import { join } from 'node:path'

import {
  publishToLocalRegistry,
  setup as registrySetup
} from '../../../create-quasar/test/e2e/local-registry.js'

// Boots the shared local registry (monorepo packages, always local —
// see the imported module) and additionally publishes the qe2e fixture
// extension, so "quasar ext add" performs a REAL registry install.
// Published under the org-owned @quasar scope (the on-disk fixture
// stays unscoped for the symlink-based unit/playground suites): the
// registry serves that name local-only, and even without that rule a
// name-squatted npmjs package could never shadow an org-scoped name.
export async function setup() {
  const teardown = await registrySetup()

  try {
    await publishToLocalRegistry(
      join(import.meta.dirname, '../fixtures/quasar-app-extension-qe2e'),
      { name: '@quasar/quasar-app-extension-qe2e' }
    )
  } catch (err) {
    teardown()
    throw err
  }

  return teardown
}
