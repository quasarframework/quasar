import { describe, expect, test } from 'vitest'

import { SIGNALS } from './signals.js'

describe('[signals.js]', () => {
  test('exposes the build external tool spawned signal', () => {
    expect(SIGNALS.BUILD_EXTERNAL_TOOL_SPAWNED).toBe(
      'SIGNAL__BUILD_EXTERNAL_TOOL_SPAWNED'
    )
  })
})
