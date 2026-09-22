import { expect, test, vi } from 'vitest'

const getAvailableUpdate = vi.fn(() => Promise.resolve(void 0))
vi.mock('@quasar/update-notifier', () => ({ getAvailableUpdate }))

const { checkUpdates } = await import('./updates.js')
const { version } = await import('./version.js')

const pkg = (name, installed) => ({ name, version: installed })

test('every distinct version the apps of a workspace install is checked once', async () => {
  const state = await checkUpdates({
    startDir: '/w',
    apps: [
      {
        dir: '/w/a',
        name: 'a',
        packages: [pkg('quasar', '2.33.0'), pkg('@quasar/app-vite', '3.9.0')]
      },
      { dir: '/w/b', name: 'b', packages: [pkg('quasar', '2.34.0')] },
      { dir: '/w/c', name: 'c', packages: [pkg('quasar', '2.33.0')] }
    ]
  })
  expect(state).toEqual([
    { name: '@quasar/mcp', version, latest: void 0 },
    { name: 'quasar', version: '2.33.0', latest: void 0 },
    { name: '@quasar/app-vite', version: '3.9.0', latest: void 0 },
    { name: 'quasar', version: '2.34.0', latest: void 0 }
  ])
  expect(getAvailableUpdate).toHaveBeenCalledTimes(4)
  expect(getAvailableUpdate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      name: 'quasar',
      version: '2.34.0',
      refresh: false
    })
  )
})
