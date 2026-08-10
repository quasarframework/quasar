import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import {
  autogrow,
  basic,
  decorated,
  errorState
} from './QInput.hydration.fixtures.js'

const fixturesPath = import.meta.url

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

  test('hydrates cleanly across errorState', async () => {
    const result = await hydrate(fixturesPath, 'errorState', errorState)

    expect(result.consoleOutput).toEqual([])
    expect(result.serverHtml).toContain('This field is required')
  })
})
