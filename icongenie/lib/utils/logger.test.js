import { afterEach, describe, expect, test, vi } from 'vitest'

import { fatal, log, warn } from './logger.js'

const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

afterEach(() => {
  vi.clearAllMocks()
})

describe('logger', () => {
  test('log prefixes the message with the banner, or prints an empty line', () => {
    log('hello')
    expect(consoleLog.mock.calls[0][0]).toMatch(/^ \S+ hello$/)

    log()
    expect(consoleLog.mock.calls[1][0]).toBe('')
  })

  test('warn goes to stderr with the warning sign', () => {
    warn('careful')
    expect(consoleWarn.mock.calls[0][0]).toMatch(/^ \S+ ⚠️ {2}careful\n$/)

    warn()
    expect(consoleWarn.mock.calls[1][0]).toBe('')
  })

  test('fatal reports and exits with 1', () => {
    const exit = vi.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`exit(${code})`)
    })

    expect(() => fatal('boom')).toThrow('exit(1)')
    expect(consoleError.mock.calls[0][0]).toContain('boom')

    exit.mockRestore()
  })
})
