import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic } from './QChatMessage.hydration.fixtures.js'

const fixturesPath = 'src/components/chat/QChatMessage.hydration.fixtures.js'

describe('QChatMessage SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })
})
