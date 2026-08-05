import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, test, vi } from 'vitest'

import { supressLogger } from './logger.js'

// env.js snapshots the (filtered) process.env at import time,
// so the probe keys must be in place before the module is loaded
vi.stubEnv('QENVTEST_PROC_ONLY', 'from-process')
vi.stubEnv('QENVTEST_PRECEDENCE', 'from-process')
vi.stubEnv('QENVTEST_INVALID-KEY(x86)', 'not-a-js-identifier')

// some tests below intentionally use invalid prefixes,
// which would otherwise print warnings
supressLogger()

const {
  defaultBackendAppEnvPrefix,
  defaultClientAppEnvPrefix,
  getAppEnv,
  getQuasarConfEnv
} = await import('./env.js')

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-env-')))

afterAll(() => {
  vi.unstubAllEnvs()
  rmSync(rootDir, { recursive: true, force: true })
})

let appDirId = 0
function createApp({ dotEnvContent, mode = {} } = {}) {
  const appDir = join(rootDir, `app-${appDirId++}`)
  mkdirSync(appDir)

  if (dotEnvContent !== void 0) {
    writeFileSync(join(appDir, '.env'), dotEnvContent)
  }

  return { appDir, ctx: { appPaths: { appDir }, mode } }
}

describe('[env.js]', () => {
  describe('defaultClientAppEnvPrefix', () => {
    test('client app code env keys are expected to start with QCLI_', () => {
      // documented public contract
      expect(defaultClientAppEnvPrefix).toBe('QCLI_')
    })
  })

  describe('defaultBackendAppEnvPrefix', () => {
    test('backend app code env keys are not filtered by a prefix', () => {
      // documented public contract (empty prefix -> no filtering)
      expect(defaultBackendAppEnvPrefix).toBe('')
    })
  })

  describe('getQuasarConfEnv()', () => {
    test('exposes prefixed .env entries as import.meta.env defines', () => {
      const { ctx } = createApp({
        dotEnvContent: 'QT_API=https://api.example.com\nOTHER=nope\n'
      })

      const { envDefineList, envBanner } = getQuasarConfEnv({
        ctx,
        envCfg: { prefix: 'QT_' },
        useSnapshot: false
      })

      expect(envDefineList).toEqual({
        'import.meta.env.QT_API': '"https://api.example.com"'
      })
      expect(envBanner).toContain('prefix QT_')
      expect(envBanner).toContain('dotenv files: .env')
    })

    test('encodes values as JS literals', () => {
      const { ctx } = createApp({
        dotEnvContent: [
          'QVAL_STR=hello world',
          'QVAL_TRUE=true',
          'QVAL_FALSE=false',
          'QVAL_NULL=null',
          'QVAL_INT=42',
          'QVAL_FLOAT=-3.14',
          'QVAL_EXP=1e5',
          'QVAL_LEADING_ZERO=0123',
          'QVAL_EMPTY=',
          ''
        ].join('\n')
      })

      const { envDefineList } = getQuasarConfEnv({
        ctx,
        envCfg: { prefix: 'QVAL_' },
        useSnapshot: false
      })

      expect(envDefineList).toEqual({
        'import.meta.env.QVAL_STR': '"hello world"',
        'import.meta.env.QVAL_TRUE': 'true',
        'import.meta.env.QVAL_FALSE': 'false',
        'import.meta.env.QVAL_NULL': 'null',
        'import.meta.env.QVAL_INT': '42',
        'import.meta.env.QVAL_FLOAT': '-3.14',
        'import.meta.env.QVAL_EXP': '1e5',
        // not a JS numeric literal, so it stays a string
        'import.meta.env.QVAL_LEADING_ZERO': '"0123"',
        'import.meta.env.QVAL_EMPTY': '""'
      })
    })

    test('expands variable references from env files and process.env', () => {
      const { ctx } = createApp({
        dotEnvContent:
          // oxlint-disable-next-line no-template-curly-in-string
          'QT_BASE=base\nQT_DERIVED=${QT_BASE}_x\nQT_REF=${QENVTEST_PROC_ONLY}_ref\n'
      })

      const { envDefineList } = getQuasarConfEnv({
        ctx,
        envCfg: { prefix: 'QT_' },
        useSnapshot: false
      })

      expect(envDefineList).toEqual({
        'import.meta.env.QT_BASE': '"base"',
        'import.meta.env.QT_DERIVED': '"base_x"',
        'import.meta.env.QT_REF': '"from-process_ref"'
      })
    })

    test('process.env values win over env file values', () => {
      const { ctx } = createApp({
        dotEnvContent: 'QENVTEST_PRECEDENCE=from-file\nQENVTEST_FILE=file\n'
      })

      const { envDefineList } = getQuasarConfEnv({
        ctx,
        envCfg: { prefix: 'QENVTEST_' },
        useSnapshot: false
      })

      expect(envDefineList['import.meta.env.QENVTEST_PRECEDENCE']).toBe(
        '"from-process"'
      )
      expect(envDefineList['import.meta.env.QENVTEST_FILE']).toBe('"file"')
    })

    test('drops keys that are not valid JS identifiers', () => {
      const { ctx } = createApp({ dotEnvContent: 'BAD-KEY=1\nGOOD_KEY=2\n' })

      // no prefix configured -> all valid JS keys pass through
      const { envDefineList } = getQuasarConfEnv({
        ctx,
        envCfg: {},
        useSnapshot: false
      })

      expect(envDefineList['import.meta.env.GOOD_KEY']).toBe('2')
      expect('import.meta.env.BAD-KEY' in envDefineList).toBe(false)

      // the process.env snapshot is filtered the same way
      expect(envDefineList['import.meta.env.QENVTEST_PROC_ONLY']).toBe(
        '"from-process"'
      )
      expect('import.meta.env.QENVTEST_INVALID-KEY(x86)' in envDefineList).toBe(
        false
      )
    })

    test('a key equal to the prefix alone does not match', () => {
      const { ctx } = createApp({ dotEnvContent: 'QT_=empty\nQT_OK=1\n' })

      const { envDefineList } = getQuasarConfEnv({
        ctx,
        envCfg: { prefix: 'QT_' },
        useSnapshot: false
      })

      expect(envDefineList).toEqual({ 'import.meta.env.QT_OK': '1' })
    })

    test('accepts a list of prefixes', () => {
      const { ctx } = createApp({
        dotEnvContent: 'AA_ONE=1\nBB_TWO=two\nCC_THREE=3\n'
      })

      const { envDefineList, envBanner } = getQuasarConfEnv({
        ctx,
        envCfg: { prefix: ['AA_', 'BB_'] },
        useSnapshot: false
      })

      expect(envDefineList).toEqual({
        'import.meta.env.AA_ONE': '1',
        'import.meta.env.BB_TWO': '"two"'
      })
      expect(envBanner).toContain('prefix AA_ | BB_')
    })

    test('a prefix containing $ is matched literally', () => {
      const { ctx } = createApp({ dotEnvContent: '$DOLLAR_KEY=dollar\n' })

      const { envDefineList } = getQuasarConfEnv({
        ctx,
        envCfg: { prefix: '$DOLLAR_' },
        useSnapshot: false
      })

      expect(envDefineList).toEqual({
        'import.meta.env.$DOLLAR_KEY': '"dollar"'
      })
    })

    test('an invalid prefix falls back to allowing all valid JS keys', () => {
      const { ctx } = createApp({ dotEnvContent: 'QT_ONE=1\nNOPREF=x\n' })

      for (const prefix of ['not-valid!', ['not-valid!', '']]) {
        const { envDefineList, envBanner } = getQuasarConfEnv({
          ctx,
          envCfg: { prefix },
          useSnapshot: false
        })

        expect(envDefineList['import.meta.env.QT_ONE']).toBe('1')
        expect(envDefineList['import.meta.env.NOPREF']).toBe('"x"')
        expect(envBanner).toContain('no env prefix')
      }
    })

    test('reads env files from custom folders and additional files', () => {
      const { appDir, ctx } = createApp()
      const cfgDir = join(appDir, 'cfg')
      mkdirSync(cfgDir)
      writeFileSync(join(cfgDir, '.env'), 'QF_SUB=insub\n')
      writeFileSync(join(cfgDir, 'extra.env'), 'QF_EXTRA=fromextra\n')

      const { envDefineList, watchEnvFiles } = getQuasarConfEnv({
        ctx,
        envCfg: { prefix: 'QF_', folder: 'cfg', file: 'extra.env' },
        useSnapshot: false
      })

      expect(envDefineList).toEqual({
        'import.meta.env.QF_SUB': '"insub"',
        'import.meta.env.QF_EXTRA': '"fromextra"'
      })
      expect(watchEnvFiles.has(join(cfgDir, '.env'))).toBe(true)
      expect(watchEnvFiles.has(join(cfgDir, 'extra.env'))).toBe(true)
    })

    test('accepts absolute paths for additional env files', () => {
      const { appDir: otherDir } = createApp()
      const absFile = join(otherDir, 'shared.env')
      writeFileSync(absFile, 'QF_SHARED=yes\n')

      const { ctx } = createApp()
      const { envDefineList } = getQuasarConfEnv({
        ctx,
        envCfg: { prefix: 'QF_', file: absFile },
        useSnapshot: false
      })

      expect(envDefineList).toEqual({ 'import.meta.env.QF_SHARED': '"yes"' })
    })

    test('watches all candidate env files, even missing ones', () => {
      const { appDir, ctx } = createApp()

      const { watchEnvFiles, envBanner } = getQuasarConfEnv({
        ctx,
        envCfg: { file: 'custom.env' },
        useSnapshot: false
      })

      expect(watchEnvFiles).toBeInstanceOf(Set)
      expect(watchEnvFiles.has(join(appDir, '.env'))).toBe(true)
      expect(watchEnvFiles.has(join(appDir, 'custom.env'))).toBe(true)
      expect(envBanner).toContain('no dotenv files')
    })

    test('generates a snapshot only when requested', () => {
      const { ctx } = createApp({ dotEnvContent: 'QT_ONE=1\n' })
      const envCfg = { prefix: 'QT_' }

      const plain = getQuasarConfEnv({ ctx, envCfg, useSnapshot: false })
      expect(plain.snapshot).toBeNull()

      const first = getQuasarConfEnv({ ctx, envCfg, useSnapshot: true })
      expect(first.snapshot.envDefineList).toBeTypeOf('string')
      expect(first.snapshot.watchEnvFiles).toBeTypeOf('string')

      // identical configurations encode identically (used for diffing)
      const second = getQuasarConfEnv({ ctx, envCfg, useSnapshot: true })
      expect(second.snapshot).toEqual(first.snapshot)
    })
  })

  describe('getAppEnv()', () => {
    test('splits env between client (QCLI_ by default) and backend code', () => {
      const { ctx } = createApp({
        dotEnvContent: 'QCLI_API=https://api\nSECRET_TOKEN=shh\n'
      })

      const result = getAppEnv({ ctx, envCfg: {}, useSnapshot: false })

      expect(result.clientEnvDefineList).toMatchObject({
        'import.meta.env.QCLI_API': '"https://api"'
      })
      expect('import.meta.env.SECRET_TOKEN' in result.clientEnvDefineList).toBe(
        false
      )

      // backend has no prefix by default, so it sees both
      expect(result.backendEnvDefineList).toMatchObject({
        'import.meta.env.QCLI_API': '"https://api"',
        'import.meta.env.SECRET_TOKEN': '"shh"'
      })
    })

    test('supports custom client and backend prefixes', () => {
      const { ctx } = createApp({
        dotEnvContent: 'PUB_ONE=1\nSRV_TWO=2\nOTHER=3\n'
      })

      const result = getAppEnv({
        ctx,
        envCfg: { clientPrefix: 'PUB_', backendPrefix: 'SRV_' },
        useSnapshot: false
      })

      expect(result.clientEnvDefineList).toEqual({
        'import.meta.env.PUB_ONE': '1'
      })
      expect(result.backendEnvDefineList).toEqual({
        'import.meta.env.SRV_TWO': '2'
      })
    })

    test('an invalid client prefix falls back to the QCLI_ default', () => {
      const { ctx } = createApp({
        dotEnvContent: 'QCLI_KEPT=yes\nOTHER=nope\n'
      })

      const result = getAppEnv({
        ctx,
        envCfg: { clientPrefix: 'bad-prefix' },
        useSnapshot: false
      })

      expect(result.clientEnvDefineList).toEqual({
        'import.meta.env.QCLI_KEPT': '"yes"'
      })
    })

    test('the filter callback can reshape or clear the define lists', () => {
      const { ctx } = createApp({ dotEnvContent: 'QCLI_APP=app\n' })

      const filterArgs = []
      const result = getAppEnv({
        ctx,
        envCfg: {
          filter: (defineList, target) => {
            filterArgs.push([defineList, target])
            return target === 'client'
              ? { picked: defineList['import.meta.env.QCLI_APP'] }
              : null // falsy return -> {}
          }
        },
        useSnapshot: false
      })

      expect(filterArgs.map(entry => entry[1])).toEqual(['client', 'backend'])
      expect(result.clientEnvDefineList).toEqual({ picked: '"app"' })
      expect(result.backendEnvDefineList).toEqual({})
    })

    test('the banner mentions the backend prefix only for ssr/ssg', () => {
      const dotEnvContent = 'QCLI_APP=app\n'
      const envCfg = { backendPrefix: 'SRV_' }

      const spa = getAppEnv({
        ctx: createApp({ dotEnvContent }).ctx,
        envCfg,
        useSnapshot: false
      })
      expect(spa.envBanner).toContain('Client code prefix: QCLI_')
      expect(spa.envBanner).toContain('dotenv files: .env')
      expect(spa.envBanner.includes('Backend code prefix')).toBe(false)

      const ssr = getAppEnv({
        ctx: createApp({ dotEnvContent, mode: { ssr: true } }).ctx,
        envCfg,
        useSnapshot: false
      })
      expect(ssr.envBanner).toContain('Backend code prefix: SRV_')
    })

    test('generates a snapshot only when requested', () => {
      const { appDir, ctx } = createApp({ dotEnvContent: 'QCLI_APP=app\n' })

      const plain = getAppEnv({ ctx, envCfg: {}, useSnapshot: false })
      expect(plain.snapshot).toBeUndefined()
      expect(plain.watchEnvFiles.has(join(appDir, '.env'))).toBe(true)

      const withSnapshot = getAppEnv({ ctx, envCfg: {}, useSnapshot: true })
      expect(withSnapshot.snapshot.envCfg).toBeTypeOf('string')
      expect(withSnapshot.snapshot.watchEnvFiles).toBeTypeOf('string')
    })
  })
})
