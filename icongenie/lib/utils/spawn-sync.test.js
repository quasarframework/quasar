import { describe, expect, test, vi } from 'vitest'

import { spawnSync } from './spawn-sync.js'

const log = vi.spyOn(console, 'log').mockImplementation(() => {})
const error = vi.spyOn(console, 'error').mockImplementation(() => {})

// the tests are not interactive: no key press is awaited on failure

describe('spawnSync', () => {
  test('resolves to true on success', async () => {
    const result = await spawnSync(process.execPath, ['-e', 'process.exit(0)'])

    expect(result).toBe(true)
    expect(error).not.toHaveBeenCalled()
  })

  test('reports the exit code of a failed command', async () => {
    const result = await spawnSync(process.execPath, ['-e', 'process.exit(3)'])

    expect(result).toBe(false)
    expect(error.mock.calls.at(-1)[0]).toContain('failed with exit code: 3')
  })

  test('reports a command that is not installed', async () => {
    const result = await spawnSync('icongenie-no-such-command', [])

    expect(result).toBe(false)
    expect(error.mock.calls.at(-1)[0]).toContain('not found')
  })

  test('mentions the target folder', async () => {
    log.mockClear()

    await spawnSync(process.execPath, ['-e', ''], { cwd: process.cwd() })

    expect(log.mock.calls[0][0]).toContain('Running')
    expect(log.mock.calls.at(-1)[0]).toContain('Executed')
  })
})
