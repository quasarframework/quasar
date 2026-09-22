import { afterEach, describe, expect, test, vi } from 'vitest'

import { mountTag } from './mount-tag.js'

const log = vi.spyOn(console, 'log').mockImplementation(() => {})

afterEach(() => {
  log.mockClear()
})

describe('mountTag', () => {
  test('prints the tags of the files that have one', () => {
    mountTag([
      { name: 'favicon.ico', tag: '<link rel="icon" href="favicon.ico">' },
      { name: 'icon.png' },
      {
        name: 'launch.png',
        tag: '<!-- iPad -->\n<link rel="apple-touch-startup-image">'
      }
    ])

    const printed = log.mock.calls.map(call => call[0] ?? '')

    expect(printed.some(line => line.includes('/index.html'))).toBe(true)
    expect(printed).toContain('<link rel="icon" href="favicon.ico">')
    expect(printed).toContain(
      '<!-- iPad -->\n<link rel="apple-touch-startup-image">'
    )
  })

  test('stays silent without tags', () => {
    mountTag([{ name: 'icon.png' }])

    expect(log).not.toHaveBeenCalled()
  })
})
