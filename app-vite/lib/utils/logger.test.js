import { afterEach, describe, expect, test, vi } from 'vitest'

// deterministic behavior for the alternate-screen helpers,
// which no-op when running in a CI environment
vi.mock('ci-info', () => ({ isCI: false }))

import {
  cancelPromptSession,
  dot,
  enterAlternateScreen,
  error,
  errorPill,
  exitAlternateScreen,
  fatal,
  getError,
  getInfo,
  getSuccess,
  getWarning,
  info,
  infoPill,
  log,
  progress,
  success,
  successPill,
  supressLogger,
  taskLogger,
  tip,
  warn,
  warning,
  warningPill
} from './logger.js'

/**
 * Not covered here (interactive/TTY-bound):
 * - clearConsole (behavior is fixed at import time based on process.stdout.isTTY)
 * - createPromptSession() and the prompt-session flavor of taskLogger()
 *   (interactive @clack/prompts UI)
 * - waitForKey() (raw-mode stdin key press)
 */

function spyLog() {
  return vi.spyOn(console, 'log').mockImplementation(() => {})
}

function spyWarn() {
  return vi.spyOn(console, 'warn').mockImplementation(() => {})
}

function spyError() {
  return vi.spyOn(console, 'error').mockImplementation(() => {})
}

function spyExit() {
  return vi.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called')
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('[logger.js]', () => {
  test('dot holds the separator character', () => {
    expect(dot).toBe('•')
  })

  test('pills wrap the message in padding', () => {
    for (const pill of [successPill, infoPill, errorPill, warningPill]) {
      expect(pill('MSG')).toContain(' MSG ')
    }
  })

  test.each([
    ['getSuccess', getSuccess],
    ['getInfo', getInfo],
    ['getError', getError],
    ['getWarning', getWarning]
  ])('%s() renders the title and message', (_, fn) => {
    const banner = fn('the message', 'TITLE')
    expect(banner).toContain('the message')
    expect(banner).toContain(' TITLE ')
    expect(banner).toContain('App')
  })

  test.each([
    ['getSuccess', getSuccess, 'SUCCESS'],
    ['getInfo', getInfo, 'INFO'],
    ['getError', getError, 'ERROR'],
    ['getWarning', getWarning, 'WARNING']
  ])('%s() falls back to its default title', (_, fn, defaultTitle) => {
    expect(fn('the message')).toContain(` ${defaultTitle} `)
  })

  test('getError()/getWarning() have default titles', () => {
    expect(getError('the message')).toContain(' ERROR ')
    expect(getWarning('the message')).toContain(' WARNING ')
  })

  describe('console output', () => {
    test('log() prints the message with the App banner', () => {
      const logSpy = spyLog()

      log('building')
      expect(logSpy.mock.calls[0][0]).toContain('App')
      expect(logSpy.mock.calls[0][0]).toContain('building')

      log('building', 'EXT')
      expect(logSpy.mock.calls[1][0]).toContain('EXT')

      log()
      expect(logSpy.mock.calls[2][0]).toBe('')
    })

    test('tip() prints the TIP pill', () => {
      const logSpy = spyLog()

      tip('use SSR')
      expect(logSpy.mock.calls[0][0]).toContain(' TIP ')
      expect(logSpy.mock.calls[0][0]).toContain('use SSR')

      tip()
      expect(logSpy.mock.calls[1][0]).toBe('')
    })

    test('warn() prints the warning with an optional pill', () => {
      const warnSpy = spyWarn()

      warn('careful', 'EXT')
      const line = warnSpy.mock.calls[0][0]
      expect(line).toContain('careful')
      expect(line).toContain(' EXT ')
      expect(line).toContain('⚠️')

      warn()
      expect(warnSpy).toHaveBeenLastCalledWith()
    })

    test.each([
      ['success', success, 'SUCCESS'],
      ['info', info, 'INFO'],
      ['error', error, 'ERROR'],
      ['warning', warning, 'WARNING']
    ])('%s() prints with its default title', (_, fn, title) => {
      const logSpy = spyLog()

      fn('the message')
      const line = logSpy.mock.calls[0][0]
      expect(line).toContain(` ${title} `)
      expect(line).toContain('the message')

      fn('the message', 'CUSTOM')
      expect(logSpy.mock.calls[1][0]).toContain(' CUSTOM ')
    })
  })

  describe('fatal()', () => {
    test('prints the message and exits with code 1', () => {
      const errSpy = spyError()
      const exitSpy = spyExit()

      expect(() => fatal('game over', 'DIE')).toThrow('process.exit called')
      expect(exitSpy).toHaveBeenCalledWith(1)

      const line = errSpy.mock.calls[0][0]
      expect(line).toContain('game over')
      expect(line).toContain(' DIE ')
    })

    test('exits with an empty error line without a message', () => {
      const errSpy = spyError()
      spyExit()

      expect(() => fatal()).toThrow('process.exit called')
      expect(errSpy).toHaveBeenCalledWith()
    })
  })

  describe('progress()', () => {
    test('reports WAIT then DONE with the elapsed time', () => {
      vi.useFakeTimers()
      const logSpy = spyLog()

      const done = progress({
        tool: 'Vite',
        waitAction: 'Compiling',
        doneAction: 'Compiled',
        target: 'SPA'
      })

      const waitLine = logSpy.mock.calls[0][0]
      expect(waitLine).toContain(' WAIT ')
      expect(waitLine).toContain('Vite')
      expect(waitLine).toContain('Compiling SPA...')

      vi.advanceTimersByTime(125)
      done()

      const doneLine = logSpy.mock.calls[1][0]
      expect(doneLine).toContain(' DONE ')
      expect(doneLine).toContain('Compiled SPA')
      expect(doneLine).toContain('125ms')
    })

    test('the done callback accepts action/target overrides', () => {
      vi.useFakeTimers()
      const logSpy = spyLog()

      const done = progress({
        tool: 'Vite',
        waitAction: 'Compiling',
        doneAction: 'Compiled',
        target: 'SPA'
      })

      done({ doneAction: 'Bundled', target: ' PWA' })

      const doneLine = logSpy.mock.calls[1][0]
      expect(doneLine).toContain('Bundled PWA')
      expect(doneLine).not.toContain('Compiled')
    })
  })

  describe('taskLogger()', () => {
    test('falls back to plain logging without a prompt session', async () => {
      const logSpy = spyLog()
      const warnSpy = spyWarn()

      const task = await taskLogger('doing work')

      expect(logSpy.mock.calls[0][0]).toContain('doing work')

      task.success('done')
      expect(warnSpy).not.toHaveBeenCalled()

      task.error('failed hard')
      expect(warnSpy).toHaveBeenCalledTimes(2)
      expect(warnSpy.mock.calls[1][0]).toContain('failed hard')
    })
  })

  test('cancelPromptSession() is a no-op without an active session', () => {
    expect(() => cancelPromptSession('bye')).not.toThrow()
  })

  describe('alternate screen', () => {
    test('enterAlternateScreen()/exitAlternateScreen() emit terminal escapes', () => {
      const writeSpy = vi
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true)
      const logSpy = spyLog()

      enterAlternateScreen('starting task')
      expect(writeSpy).toHaveBeenCalledWith('\u001B[?1049h')
      expect(writeSpy).toHaveBeenCalledWith('\u001B[H')
      expect(logSpy).toHaveBeenCalledWith('>>> starting task\n')

      logSpy.mockClear()
      enterAlternateScreen()
      expect(logSpy).not.toHaveBeenCalled()

      exitAlternateScreen()
      expect(writeSpy).toHaveBeenCalledWith('\u001B[?1049l')
    })
  })

  // must stay the last spec in this file: suppression is
  // irreversible for this module instance
  describe('supressLogger()', () => {
    test('suppresses all subsequent output', () => {
      const logSpy = spyLog()
      const warnSpy = spyWarn()
      const errSpy = spyError()
      const exitSpy = spyExit()

      supressLogger()

      log('hidden')
      success('hidden')
      info('hidden')
      error('hidden')
      warning('hidden')
      warn('hidden')
      tip('hidden')

      expect(logSpy).not.toHaveBeenCalled()
      expect(warnSpy).not.toHaveBeenCalled()

      // fatal() prints nothing, but still exits the process
      expect(() => fatal('hidden')).toThrow('process.exit called')
      expect(errSpy).not.toHaveBeenCalled()
      expect(exitSpy).toHaveBeenCalledExactlyOnceWith(1)
    })
  })
})
