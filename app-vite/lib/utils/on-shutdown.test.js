import { afterEach, describe, expect, test, vi } from 'vitest'

import { onShutdown } from './on-shutdown.js'
import { log } from './logger.js'

vi.mock('./logger.js', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  fatal: vi.fn(msg => {
    throw new Error(`FATAL: ${msg}`)
  })
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('[on-shutdown.js]', () => {
  test('registers one cleanup handler for exit and termination signals', () => {
    const onSpy = vi.spyOn(process, 'on').mockImplementation(() => process)

    onShutdown(() => {})

    expect(onSpy.mock.calls.map(call => call[0])).toEqual([
      'exit',
      'SIGINT',
      'SIGTERM',
      'SIGHUP',
      'SIGBREAK'
    ])

    const handlers = new Set(onSpy.mock.calls.map(call => call[1]))
    expect(handlers.size).toBe(1)

    onSpy.mockRestore()
  })

  test('cleanup logs the message, runs the fn and exits', () => {
    const onSpy = vi.spyOn(process, 'on').mockImplementation(() => process)
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {})
    const fn = vi.fn()

    onShutdown(fn, 'shutting down')
    const cleanup = onSpy.mock.calls[0][1]

    cleanup()

    expect(log).toHaveBeenCalledWith('shutting down')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(exitSpy).toHaveBeenCalledTimes(1)

    onSpy.mockRestore()
    exitSpy.mockRestore()
  })

  test('cleanup skips logging without a message', () => {
    const onSpy = vi.spyOn(process, 'on').mockImplementation(() => process)
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {})

    onShutdown(() => {})
    const cleanup = onSpy.mock.calls[0][1]

    cleanup()

    expect(log).not.toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalledTimes(1)

    onSpy.mockRestore()
    exitSpy.mockRestore()
  })

  test('cleanup still exits when the shutdown fn throws', () => {
    const onSpy = vi.spyOn(process, 'on').mockImplementation(() => process)
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {})

    onShutdown(() => {
      throw new Error('boom')
    })
    const cleanup = onSpy.mock.calls[0][1]

    expect(() => cleanup()).toThrow('boom')
    expect(exitSpy).toHaveBeenCalledTimes(1)

    onSpy.mockRestore()
    exitSpy.mockRestore()
  })
})
