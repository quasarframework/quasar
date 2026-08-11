import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'

import { getApi } from './get-api.js'
import { getCtx } from './get-ctx.js'

vi.mock('./logger.js', async importOriginal => {
  const original = await importOriginal()
  return {
    ...original,
    fatal: vi.fn(msg => {
      throw new Error(`FATAL: ${msg}`)
    })
  }
})

// getCtx() resolves the app from process.cwd(), so run it
// from within a real Quasar app (the js playground)
const playgroundDir = join(import.meta.dirname, '../../playground-js')
const originalCwd = process.cwd()

let ctx

beforeAll(() => {
  process.chdir(playgroundDir)
  ctx = getCtx({ mode: 'spa' })
})

afterAll(() => {
  process.chdir(originalCwd)
})

describe('[get-api.js]', () => {
  test('fetches a component API from the quasar package', async () => {
    const result = await getApi('QBtn', ctx)

    expect(result.api).toBeTypeOf('object')
    expect(result.api.type).toBe('component')
    expect(result.api.props).toBeTypeOf('object')
    expect(Object.keys(result.api.props).length).toBeGreaterThan(0)

    // no App Extension supplied it, so no supplier is reported
    expect(result.supplier).toBeUndefined()
  })

  test('fetches a plugin API from the quasar package', async () => {
    const result = await getApi('AppFullscreen', ctx)

    expect(result.api).toBeTypeOf('object')
    expect(result.api.type).toBe('plugin')
  })

  test('fails when no API exists for the requested item', async () => {
    await expect(getApi('QDefinitelyMissing', ctx)).rejects.toThrow(
      'FATAL: No API found for requested "QDefinitelyMissing"'
    )
  })
})
