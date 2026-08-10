import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, multipleChips } from './QSelect.hydration.fixtures.js'

const fixturesPath = 'src/components/select/QSelect.hydration.fixtures.js'

describe('QSelect SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly with multiple selection chips', async () => {
    const result = await hydrate(fixturesPath, 'multipleChips', multipleChips)

    expect(result.consoleOutput).toEqual([])
    // the model-derived chips were server-rendered
    expect(result.serverHtml).toContain('q-chip')
  })
})
