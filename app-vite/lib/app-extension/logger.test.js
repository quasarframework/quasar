import { afterEach, describe, expect, test, vi } from 'vitest'

// record the composed messages instead of printing them
vi.mock('../utils/logger.js', () => ({
  dot: '•',
  log: vi.fn(),
  warn: vi.fn(),
  fatal: vi.fn(),
  info: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  tip: vi.fn(),
  progress: vi.fn(() => 'progress-acc')
}))

import {
  error,
  fatal,
  info,
  log,
  progress,
  success,
  tip,
  warn,
  warning
} from '../utils/logger.js'
import { getExtensionLogger } from './logger.js'

const aePill = 'AE (my-ext)'
const logger = getExtensionLogger('my-ext')

afterEach(() => {
  vi.clearAllMocks()
})

describe('[logger.js] getExtensionLogger()', () => {
  test('returns a frozen object exposing the separator character', () => {
    expect(Object.isFrozen(logger)).toBe(true)
    expect(logger.dot).toBe('•')
  })

  test('log()/warn()/fatal() pass the AE pill along', () => {
    logger.log('the message')
    expect(log).toHaveBeenCalledExactlyOnceWith('the message', aePill)

    logger.warn('the warning')
    expect(warn).toHaveBeenCalledExactlyOnceWith('the warning', aePill)

    logger.fatal('the failure')
    expect(fatal).toHaveBeenCalledExactlyOnceWith('the failure', aePill)
  })

  test.each([
    ['info', logger.info, info, 'INFO'],
    ['success', logger.success, success, 'SUCCESS'],
    ['error', logger.error, error, 'ERROR'],
    ['warning', logger.warning, warning, 'WARNING']
  ])(
    '%s() composes the AE pill into the title',
    (_, extMethod, baseMethod, defaultTitle) => {
      extMethod('the message', 'CUSTOM')
      expect(baseMethod).toHaveBeenCalledWith(
        'the message',
        `${aePill} • CUSTOM`
      )

      extMethod('the message')
      expect(baseMethod).toHaveBeenCalledWith(
        'the message',
        `${aePill} • ${defaultTitle}`
      )
    }
  )

  test('tip() prefixes the message itself', () => {
    logger.tip('do the thing')
    expect(tip).toHaveBeenCalledExactlyOnceWith(`${aePill} • do the thing`)
  })

  test('progress() brands the tool name and passes the rest through', () => {
    const acc = logger.progress({ tool: 'vite', banner: 'compiling' })

    expect(progress).toHaveBeenCalledExactlyOnceWith({
      banner: 'compiling',
      tool: `${aePill} • vite`
    })
    expect(acc).toBe('progress-acc')
  })
})
