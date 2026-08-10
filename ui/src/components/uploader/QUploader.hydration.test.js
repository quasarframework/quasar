import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QUploader.hydration.fixtures.js'

const fixturesPath = 'src/components/uploader/QUploader.hydration.fixtures.js'

describe('QUploader SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
