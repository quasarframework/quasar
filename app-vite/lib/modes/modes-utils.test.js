import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, test, vi } from 'vitest'

// deterministic across local and CI runs: interactivity must only
// depend on the stdin TTY toggled by the tests below
vi.mock('ci-info', () => ({ isCI: false }))
vi.mock('../utils/logger.js', () => ({
  createPromptSession: vi.fn(),
  info: vi.fn(),
  fatal: msg => {
    throw new Error(msg)
  }
}))

const { resolvePromptAnswer, resolveSsrWebserver, ssrWebservers } =
  await import('./modes-utils.js')

const originalStdinTTY = process.stdin.isTTY
afterEach(() => {
  process.stdin.isTTY = originalStdinTTY
})

function fakePromptSession(selectAnswer) {
  const session = {
    log: { info: vi.fn() },
    select: vi.fn(() => selectAnswer),
    // mirrors createPromptSession().prompt(): runs each question fn
    prompt: vi.fn(async questions => {
      const scope = {}
      for (const key in questions) {
        scope[key] = await questions[key]()
      }
      return scope
    })
  }
  return session
}

describe('[modes-utils.js] ssrWebservers', () => {
  test('every entry has a matching template folder', () => {
    const templatesDir = join(import.meta.dirname, '../../templates/ssr')

    for (const { value, label } of ssrWebservers) {
      expect(existsSync(join(templatesDir, value)), value).toBe(true)
      expect(label).toBeTypeOf('string')
    }
  })
})

describe('[modes-utils.js] resolvePromptAnswer()', () => {
  test('honors an explicit falsy (but defined) value', async () => {
    const promptSession = fakePromptSession()

    await expect(
      resolvePromptAnswer({
        promptSession,
        value: false,
        fallback: true,
        fallbackNote: 'irrelevant',
        question: () => true
      })
    ).resolves.toBe(false)

    expect(promptSession.prompt).not.toHaveBeenCalled()
    expect(promptSession.log.info).not.toHaveBeenCalled()
  })

  test('rejects an explicit value failing validation', async () => {
    await expect(
      resolvePromptAnswer({
        promptSession: fakePromptSession(),
        value: '',
        validate: val => (val ? void 0 : 'cannot be empty'),
        fallback: 'default',
        fallbackNote: 'irrelevant',
        question: () => 'whatever'
      })
    ).rejects.toThrow('cannot be empty')
  })

  test('rejects a non-interactive fallback failing validation', async () => {
    process.stdin.isTTY = false

    await expect(
      resolvePromptAnswer({
        promptSession: fakePromptSession(),
        validate: val =>
          /^[0-9]/.test(val) ? 'cannot start with a number' : void 0,
        fallback: '1st App',
        fallbackNote: 'irrelevant',
        question: () => 'whatever'
      })
    ).rejects.toThrow('cannot start with a number')
  })
})

describe('[modes-utils.js] resolveSsrWebserver()', () => {
  test('returns an explicitly requested webserver without prompting', async () => {
    const promptSession = fakePromptSession()

    await expect(
      resolveSsrWebserver({
        promptSession,
        webserver: 'fastify',
        message: 'irrelevant'
      })
    ).resolves.toBe('fastify')

    expect(promptSession.prompt).not.toHaveBeenCalled()
    expect(promptSession.log.info).not.toHaveBeenCalled()
  })

  test('rejects an unknown explicitly requested webserver', async () => {
    await expect(
      resolveSsrWebserver({
        promptSession: fakePromptSession(),
        webserver: 'nginx',
        message: 'irrelevant'
      })
    ).rejects.toThrow('Unknown SSR webserver "nginx"')
  })

  test('defaults to hono when the terminal is non-interactive', async () => {
    process.stdin.isTTY = false
    const promptSession = fakePromptSession()

    await expect(
      resolveSsrWebserver({ promptSession, message: 'irrelevant' })
    ).resolves.toBe('hono')

    expect(promptSession.prompt).not.toHaveBeenCalled()
    expect(promptSession.log.info).toHaveBeenCalledOnce()
  })

  test('prompts when the terminal is interactive', async () => {
    process.stdin.isTTY = true
    const promptSession = fakePromptSession('koa')

    await expect(
      resolveSsrWebserver({ promptSession, message: 'Pick one' })
    ).resolves.toBe('koa')

    expect(promptSession.select).toHaveBeenCalledWith({
      message: 'Pick one',
      options: ssrWebservers
    })
  })
})
