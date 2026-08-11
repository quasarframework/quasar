import { afterEach, describe, expect, test, vi } from 'vitest'

import { spawn, spawnSync } from './spawn.js'
import { log, taskLogger } from './logger.js'

vi.mock('./logger.js', () => {
  const taskLog = {
    success: vi.fn(),
    error: vi.fn()
  }

  return {
    cancelPromptSession: vi.fn(),
    enterAlternateScreen: vi.fn(),
    exitAlternateScreen: vi.fn(),
    fatal: vi.fn(msg => {
      throw new Error(`FATAL: ${msg}`)
    }),
    log: vi.fn(),
    taskLogger: vi.fn(() => Promise.resolve(taskLog)),
    waitForKey: vi.fn(() => Promise.resolve())
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('[spawn.js]', () => {
  describe('spawn()', () => {
    test('runs a command and reports exit code 0 through onClose', async () => {
      let pid

      const code = await new Promise(resolve => {
        pid = spawn(process.execPath, ['-e', 'process.exit(0)'], {}, resolve)
      })

      expect(code).toBe(0)
      expect(pid).toBeTypeOf('number')
      expect(pid).toBeGreaterThan(0)
    })

    test('reports a non-zero exit code and logs the failure', async () => {
      const code = await new Promise(resolve => {
        spawn(process.execPath, ['-e', 'process.exit(7)'], {}, resolve)
      })

      expect(code).toBe(7)
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining('failed with exit code: 7')
      )
    })

    test('fails fast when the command name is missing', () => {
      expect(() => spawn('', [], {})).toThrow(
        'FATAL: Command name was not available. Please run again.'
      )
    })
  })

  describe('spawnSync()', () => {
    test('resolves on success and reports it to the task logger', async () => {
      await expect(
        spawnSync(process.execPath, ['-e', 'process.exit(0)'], {})
      ).resolves.toBeUndefined()

      const taskLog = await taskLogger()
      expect(taskLog.success).toHaveBeenCalledWith(
        expect.stringContaining('Executed')
      )
      expect(taskLog.error).not.toHaveBeenCalled()
    })

    test('runs onFail and exits the process on a non-zero exit code', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(code => {
        throw new Error(`EXIT:${code}`)
      })
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const consoleLogSpy = vi
        .spyOn(console, 'log')
        .mockImplementation(() => {})
      const onFail = vi.fn()

      await expect(
        spawnSync(process.execPath, ['-e', 'process.exit(2)'], {}, onFail)
      ).rejects.toThrow('EXIT:1')

      expect(onFail).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('failed with exit code: 2')
      )

      const taskLog = await taskLogger()
      expect(taskLog.error).toHaveBeenCalled()

      exitSpy.mockRestore()
      consoleErrorSpy.mockRestore()
      consoleLogSpy.mockRestore()
    })

    test('reports a missing command distinctly', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(code => {
        throw new Error(`EXIT:${code}`)
      })
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const consoleLogSpy = vi
        .spyOn(console, 'log')
        .mockImplementation(() => {})

      await expect(
        spawnSync('q-definitely-not-a-command', [], {})
      ).rejects.toThrow('EXIT:1')

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Command "q-definitely-not-a-command" not found!'
        )
      )

      exitSpy.mockRestore()
      consoleErrorSpy.mockRestore()
      consoleLogSpy.mockRestore()
    })
  })
})
