import { describe, expect, test, vi } from 'vitest'

import { hydrate } from 'testing/hydration/hydrate.js'

import {
  basic,
  broken,
  brokenSrc,
  deferred,
  emitted,
  noSpinner,
  optIn,
  src,
  withHeight,
  withPlaceholder
} from './QImg.hydration.fixtures.js'

const fixturesPath = import.meta.url

function getImages(host) {
  return [...host.querySelectorAll('img')]
}

// the image is either reconciled at mount (settled before hydration) or
// caught by the listeners hydration attached; the harness inserts the
// server HTML right before mounting, so here it is usually the latter
async function waitForEmit(name) {
  await vi.waitFor(() => {
    expect(emitted.length).toBeGreaterThan(0)
  })
  expect(emitted[0][0]).toBe(name)
}

// the server HTML carries the image itself (not only its wrapper)
function isServerRendered(serverHtml, imgSrc = src) {
  return serverHtml.includes(`src="${imgSrc}"`)
}

describe('QImg SSR hydration', () => {
  test('server-renders the image visible, then hydrates cleanly', async () => {
    emitted.length = 0
    const result = await hydrate(fixturesPath, 'basic', basic)

    expect(result.consoleOutput).toEqual([])
    expect(isServerRendered(result.serverHtml)).toBe(true)
    expect(result.serverHtml).toContain('q-img__image--loaded')
    expect(result.serverHtml).not.toContain('q-img__loading')

    await waitForEmit('load')
    expect(emitted[0][1]).toBe(src)
    expect(result.host.querySelector('.q-img__loading')).toBeNull()
    const images = getImages(result.host)
    expect(images).toHaveLength(1)
    expect(images[0].classList.contains('q-img__image--loaded')).toBe(true)
    expect(images[0].classList.contains('q-img__image--current')).toBe(false)
  })

  test('hydrates cleanly with a placeholder underneath', async () => {
    emitted.length = 0
    const result = await hydrate(
      fixturesPath,
      'withPlaceholder',
      withPlaceholder
    )

    expect(result.consoleOutput).toEqual([])
    expect(
      result.serverHtml.indexOf('q-img__image--current') >
        result.serverHtml.indexOf('q-img__image--loaded')
    ).toBe(true)

    // the placeholder is dropped once the image is loaded
    await waitForEmit('load')
    expect(getImages(result.host)).toHaveLength(1)
  })

  test('hydrates cleanly without a spinner', async () => {
    const result = await hydrate(fixturesPath, 'noSpinner', noSpinner)

    expect(result.consoleOutput).toEqual([])
    expect(isServerRendered(result.serverHtml)).toBe(true)
  })

  test('a fixed height server-renders the image too', async () => {
    const result = await hydrate(fixturesPath, 'withHeight', withHeight)

    expect(result.consoleOutput).toEqual([])
    expect(isServerRendered(result.serverHtml)).toBe(true)
  })

  test('defers an image of unknown box shape until hydrated', async () => {
    emitted.length = 0
    const result = await hydrate(fixturesPath, 'deferred', deferred)

    expect(result.consoleOutput).toEqual([])
    expect(isServerRendered(result.serverHtml)).toBe(false)
    expect(emitted).toEqual([])

    // added at mount, taking the regular (hidden until loaded) path
    const images = getImages(result.host)
    expect(images).toHaveLength(1)
    expect(images[0].classList.contains('q-img__image--current')).toBe(true)
    expect(images[0].classList.contains('q-img__image--loaded')).toBe(false)
  })

  test('server-renders an image of unknown box shape when opted in', async () => {
    emitted.length = 0
    const result = await hydrate(fixturesPath, 'optIn', optIn)

    expect(result.consoleOutput).toEqual([])
    expect(isServerRendered(result.serverHtml)).toBe(true)
    await waitForEmit('load')
    // the box took the natural ratio of the image
    expect(
      Number.parseFloat(result.host.querySelector('.q-img').style.aspectRatio)
    ).toBeCloseTo(16 / 9)
  })

  test('reconciles an image that failed before hydration', async () => {
    emitted.length = 0
    const result = await hydrate(fixturesPath, 'broken', broken)

    expect(result.consoleOutput).toEqual([])
    expect(isServerRendered(result.serverHtml, brokenSrc)).toBe(true)

    await waitForEmit('error')
    expect(result.host.querySelector('.q-img__content').textContent).toBe(
      'failed'
    )
    // the error image took over
    expect(result.host.querySelector('img').getAttribute('src')).toBe(src)
  })
})
