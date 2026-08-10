import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { autogrow, basic, decorated } from './QInput.hydration.fixtures.js'

const fixturesPath = 'src/components/input/QInput.hydration.fixtures.js'

describe('QInput SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates cleanly with field decorations', async () => {
    const result = await hydrate(fixturesPath, 'decorated', decorated)

    expect(result.consoleOutput).toEqual([])
    // the counter derives from the model on the server already
    expect(result.host.textContent).toContain('4 / 20')
  })

  test('hydrates cleanly as an autogrow textarea', async () => {
    const result = await hydrate(fixturesPath, 'autogrow', autogrow)

    expect(result.consoleOutput).toEqual([])
  })
})
