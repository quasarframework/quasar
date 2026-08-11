import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, quasarOptions } from './IconSet.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('IconSet plugin SSR hydration', () => {
  test('an SVG icon set reaches the server render and hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic, {
      quasarOptions
    })

    expect(result.consoleOutput).toEqual([])
    // the dropdown icon server-rendered as an inline svg, not the
    // default font ligature
    expect(result.serverHtml).toContain('<svg')
  })
})
