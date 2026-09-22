import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest'

// realpath: process.cwd() reports the resolved path on macOS
const workDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'icongenie-app-paths-'))
)
const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

// the module resolves the project folder once, when it loads
function load(cwd) {
  process.chdir(cwd)
  vi.resetModules()
  return import('./app-paths.js')
}

beforeEach(() => {
  warnSpy.mockClear()
})

afterAll(() => {
  process.chdir(tmpdir())
  rmSync(workDir, { recursive: true, force: true })
})

describe('appDir', () => {
  test('is the closest folder up the tree holding a quasar.config file', async () => {
    const project = join(workDir, 'project')
    const nested = join(project, 'src/components')
    mkdirSync(nested, { recursive: true })
    writeFileSync(join(project, 'quasar.config.ts'), '')

    const { appDir, resolveDir } = await load(nested)

    expect(appDir).toBe(project)
    expect(resolveDir('src-pwa')).toBe(join(project, 'src-pwa'))
    expect(warnSpy).not.toHaveBeenCalled()
  })

  test('every quasar.config flavor counts, the legacy one too', async () => {
    for (const name of [
      'quasar.config.js',
      'quasar.config.mjs',
      'quasar.config.cjs',
      'quasar.conf.js'
    ]) {
      const project = join(workDir, `flavor-${name}`)
      mkdirSync(join(project, 'src'), { recursive: true })
      writeFileSync(join(project, name), '')

      const { appDir } = await load(join(project, 'src'))
      expect(appDir, name).toBe(project)
    }
  })

  test('falls back to the cwd, with a warning', async () => {
    const folder = join(workDir, 'plain')
    mkdirSync(folder)

    const { appDir } = await load(folder)

    expect(appDir).toBe(folder)
    expect(warnSpy).toHaveBeenCalledOnce()
    expect(warnSpy.mock.calls[0][0]).toContain('No Quasar project folder')
  })
})
