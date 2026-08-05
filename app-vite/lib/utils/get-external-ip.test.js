import { beforeEach, describe, expect, test, vi } from 'vitest'

const state = vi.hoisted(() => ({
  interfaces: [],
  warnings: [],
  selectCalls: [],
  selectedIndex: 0,
  sessionEnded: false
}))

vi.mock('./net.js', () => ({
  getExternalNetworkInterface: () => state.interfaces
}))

// fatal() would process.exit(1); the prompt session is interactive
vi.mock('./logger.js', () => ({
  fatal: msg => {
    throw new Error(`FATAL: ${msg}`)
  },
  warn: msg => {
    state.warnings.push(msg)
  },
  createPromptSession: () =>
    Promise.resolve({
      select: opts => {
        state.selectCalls.push(opts)
        return Promise.resolve(opts.options[state.selectedIndex].value)
      },

      async prompt(questions) {
        const scope = {}
        for (const key in questions) {
          scope[key] = await questions[key]()
        }
        return scope
      },

      end: () => {
        state.sessionEnded = true
      }
    })
}))

import { getExternalIP } from './get-external-ip.js'

beforeEach(() => {
  state.interfaces = []
  state.warnings = []
  state.selectCalls = []
  state.selectedIndex = 0
  state.sessionEnded = false
})

describe('[get-external-ip.js]', () => {
  test('fails when no external IP is detected', async () => {
    await expect(getExternalIP()).rejects.toThrow(/No external IP detected/)
  })

  test('uses a single detected external IP directly', async () => {
    state.interfaces = [{ deviceName: 'en0', address: '192.168.1.20' }]

    await expect(getExternalIP()).resolves.toBe('192.168.1.20')

    expect(state.warnings).toHaveLength(1)
    expect(state.warnings[0]).toContain('192.168.1.20')
    expect(state.selectCalls).toHaveLength(0)
  })

  test('prompts to pick one of multiple external IPs', async () => {
    state.interfaces = [
      { deviceName: 'en0', address: '192.168.1.20' },
      { deviceName: 'en5', address: '10.0.0.7' }
    ]
    state.selectedIndex = 1

    await expect(getExternalIP()).resolves.toBe('10.0.0.7')

    expect(state.selectCalls).toHaveLength(1)
    expect(state.selectCalls[0].options).toEqual([
      { label: '192.168.1.20', value: '192.168.1.20' },
      { label: '10.0.0.7', value: '10.0.0.7' }
    ])
    expect(state.sessionEnded).toBe(true)
    expect(state.warnings).toHaveLength(0)
  })
})
