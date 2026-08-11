import { afterEach } from 'vitest'

// the harness is imported LAZILY on purpose: a static import here
// would evaluate Platform during setup — before the test file's
// boot-mode flag import (server-rendered-flag.js) runs, defeating the
// per-file gate that this whole suite exists to exercise
afterEach(async () => {
  const { cleanupHydrated } = await import('../hydration/hydrate.js')
  cleanupHydrated()
})
