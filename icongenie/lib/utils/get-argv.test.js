import { afterEach, describe, expect, test, vi } from 'vitest'

import { getArgv } from './get-argv.js'

const options = {
  icon: { type: 'string', short: 'i' },
  'skip-trim': { type: 'boolean' },
  'theme-color': { type: 'string' },
  help: { type: 'boolean', short: 'h' }
}

const originalArgv = process.argv

function withArgv(args) {
  process.argv = [...originalArgv.slice(0, 2), ...args]
}

afterEach(() => {
  process.argv = originalArgv
  vi.restoreAllMocks()
})

describe('getArgv', () => {
  test('camel cases the option names and keeps the positionals', () => {
    withArgv(['--icon', 'a.png', '--skip-trim', '--theme-color=abc', 'extra'])

    expect(getArgv(options)).toEqual({
      icon: 'a.png',
      skipTrim: true,
      themeColor: 'abc',
      _: ['extra']
    })
  })

  test('short aliases', () => {
    withArgv(['-i', 'a.png', '-h'])

    expect(getArgv(options)).toEqual({ icon: 'a.png', help: true, _: [] })
  })

  test('an unknown option turns into a help request that fails on report', () => {
    withArgv(['--bogus'])

    const argv = getArgv(options)
    expect(argv).toMatchObject({ help: true, _: [] })
    expect(argv.__warn).toBeInstanceOf(Function)

    vi.spyOn(process, 'exit').mockImplementation(code => {
      throw new Error(`exit(${code})`)
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(() => argv.__warn()).toThrow('exit(1)')
    expect(warn.mock.calls[0][0]).toContain('--bogus')
  })

  test('a missing option value is reported the same way', () => {
    withArgv(['--icon'])

    expect(getArgv(options)).toMatchObject({ help: true })
  })

  test('non strict parsing tolerates unknown options', () => {
    withArgv(['--bogus', '--icon', 'a.png'])

    expect(getArgv(options, { strict: false })).toEqual({
      bogus: true,
      icon: 'a.png',
      _: []
    })
  })
})
