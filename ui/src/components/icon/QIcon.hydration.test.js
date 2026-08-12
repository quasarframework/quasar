import { describe, expect, test } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import { basic, svgPath, webfont } from './QIcon.hydration.fixtures.js'

const fixturesPath = import.meta.url

describe('QIcon SSR hydration', () => {
  test('hydrates cleanly', async () => {
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates a class-based webfont icon cleanly', async () => {
    const result = await hydrate(fixturesPath, 'webfont', webfont)

    expect(result.consoleOutput).toEqual([])
  })

  test('hydrates an svg path icon cleanly', async () => {
    const result = await hydrate(fixturesPath, 'svgPath', svgPath)

    expect(result.consoleOutput).toEqual([])
  })
})
