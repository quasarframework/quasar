import { afterEach, describe, expect, test, vi } from 'vitest'

import { getArgv } from './get-argv.js'
import { warn } from './logger.js'

vi.mock('./logger.js', () => ({
  warn: vi.fn()
}))

afterEach(() => {
  vi.clearAllMocks()
})

function parse(args, options, opts) {
  const originalArgv = process.argv
  process.argv = [originalArgv[0], 'quasar', ...args]
  try {
    return getArgv(options, opts)
  } finally {
    process.argv = originalArgv
  }
}

describe('[get-argv.js]', () => {
  test('parses long and short options', () => {
    const argv = parse(['--port', '8080', '-s'], {
      port: { type: 'string', short: 'p' },
      silent: { type: 'boolean', short: 's' }
    })

    expect(argv.port).toBe('8080')
    expect(argv.silent).toBe(true)
  })

  test('applies declared defaults', () => {
    const argv = parse([], {
      port: { type: 'string', default: '4000' }
    })

    expect(argv.port).toBe('4000')
  })

  test('collects positionals under "_"', () => {
    const argv = parse(['./dist', '--silent'], {
      silent: { type: 'boolean' }
    })

    expect(argv._).toEqual(['./dist'])
  })

  test('returns an empty positionals list when none given', () => {
    expect(parse([], {})._).toEqual([])
  })

  test('flags help with a __warn handler on unknown options', () => {
    const argv = parse(['--bogus'], {
      silent: { type: 'boolean' }
    })

    expect(argv.help).toBe(true)
    expect(argv._).toEqual([])
    expect(argv.__warn).toBeTypeOf('function')
  })

  test('__warn() reports the unknown option and exits', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {})
    const argv = parse(['--bogus'], {
      silent: { type: 'boolean' }
    })

    argv.__warn()

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('--bogus'))
    expect(exitSpy).toHaveBeenCalledWith(1)

    exitSpy.mockRestore()
  })

  test('tolerates unknown options when strict is disabled', () => {
    const argv = parse(
      ['--bogus', 'positional'],
      {
        silent: { type: 'boolean' }
      },
      { strict: false }
    )

    expect(argv.help).toBeUndefined()
    expect(argv._).toEqual(['positional'])
  })
})
