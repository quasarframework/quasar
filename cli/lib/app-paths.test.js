import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, describe, expect, test, vi } from 'vitest'

const originalCwd = process.cwd()
// realpath, so assertions match what process.cwd() reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(
  mkdtempSync(join(tmpdir(), 'quasar-cli-app-paths-'))
)

afterEach(() => {
  process.chdir(originalCwd)
  vi.resetModules()
})

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

function makeDir(...segments) {
  const dir = join(rootDir, ...segments)
  mkdirSync(dir, { recursive: true })
  return dir
}

// appDir detection runs at import time based on process.cwd()
async function getAppPaths(cwd) {
  process.chdir(cwd)
  const { default: appPaths } = await import('./app-paths.js')
  return appPaths
}

describe('[app-paths.js]', () => {
  test('appDir is undefined outside of a Quasar project', async () => {
    const appPaths = await getAppPaths(makeDir('plain'))

    expect(appPaths.appDir).toBeUndefined()
    expect(appPaths.quasarConfigFilename).toBeUndefined()
  })

  test.each([
    'quasar.config.js',
    'quasar.config.mjs',
    'quasar.config.ts',
    'quasar.config.cjs',
    'quasar.conf.js'
  ])('detects a project through %s', async filename => {
    const dir = makeDir(`direct-${filename}`)
    writeFileSync(join(dir, filename), 'export default {}')

    const appPaths = await getAppPaths(dir)
    expect(appPaths.appDir).toBe(dir)
    expect(appPaths.quasarConfigFilename).toBe(join(dir, filename))
  })

  test('detects a project from a nested directory', async () => {
    const projectDir = makeDir('nested')
    writeFileSync(join(projectDir, 'quasar.config.js'), 'export default {}')

    const appPaths = await getAppPaths(makeDir('nested', 'src', 'components'))
    expect(appPaths.appDir).toBe(projectDir)
  })

  test('exposes the cli dir and path resolvers', async () => {
    const projectDir = makeDir('resolvers')
    writeFileSync(join(projectDir, 'quasar.config.js'), 'export default {}')

    const appPaths = await getAppPaths(projectDir)
    expect(appPaths.resolve.app('dist')).toBe(join(projectDir, 'dist'))
    expect(appPaths.resolve.cli('assets')).toBe(join(appPaths.cliDir, 'assets'))
  })
})
