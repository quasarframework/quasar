import { afterEach, describe, expect, test, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

async function getRunningPackageManager(userAgent) {
  vi.stubEnv('npm_config_user_agent', userAgent)
  const { runningPackageManager } = await import('../../lib/running-pm.js')
  return runningPackageManager
}

describe('[running-pm.js]', () => {
  test('is undefined when not invoked through a package manager', async () => {
    expect(await getRunningPackageManager(void 0)).toBeUndefined()
  })

  test.each([
    ['pnpm/9.12.0 npm/? node/v22.0.0 darwin arm64', 'pnpm'],
    ['yarn/1.22.22 npm/? node/v22.0.0 darwin arm64', 'yarn'],
    ['npm/10.8.2 node/v22.0.0 darwin arm64 workspaces/false', 'npm'],
    ['bun/1.1.30 npm/? node/v22.6.0 darwin arm64', 'bun']
  ])('extracts the package manager name from "%s"', async (ua, expected) => {
    expect(await getRunningPackageManager(ua)).toBe(expected)
  })
})
