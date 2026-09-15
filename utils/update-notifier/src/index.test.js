import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

import { afterEach, expect, onTestFinished, test, vi } from 'vitest'

// CI detection must be deterministic regardless of where the suite runs.
vi.mock('ci-info', () => ({ isCI: false }))

// So must the network: the notifier reads the interfaces to skip offline
// machines, and a CI runner may well have none but loopback.
const online = {
  lo0: [{ address: '127.0.0.1', internal: true }],
  en0: [{ address: '192.168.1.2', internal: false }]
}
const offline = { lo0: [{ address: '127.0.0.1', internal: true }] }
const interfaces = vi.fn(() => online)
vi.mock('node:os', async importOriginal => ({
  ...(await importOriginal()),
  networkInterfaces: () => interfaces()
}))

const {
  checkForUpdate,
  getAvailableUpdate,
  isNewerVersion,
  isOffline,
  notifyUpdate,
  renderNotification
} = await import('./internal.js')

const execFileAsync = promisify(execFile)
const defaultRegistry = 'https://registry.npmjs.org/'
const notifierEnvironmentKeys = [
  'CI',
  'NODE_ENV',
  'NO_UPDATE_NOTIFIER',
  'npm_config_registry',
  'npm_lifecycle_event'
]

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
  interfaces.mockImplementation(() => online)
})

function enableNotifier() {
  for (const key of notifierEnvironmentKeys) {
    vi.stubEnv(key, void 0)
  }
}

function setColorEnvironment(forceColor) {
  vi.stubEnv('NO_COLOR', void 0)
  vi.stubEnv('NODE_DISABLE_COLORS', void 0)
  vi.stubEnv('FORCE_COLOR', forceColor)
}

function setTTY(value) {
  const previous = process.stdout.isTTY
  process.stdout.isTTY = value

  onTestFinished(() => {
    if (previous === void 0) {
      delete process.stdout.isTTY
    } else {
      process.stdout.isTTY = previous
    }
  })
}

async function createCacheRoot() {
  const cacheRoot = await mkdtemp(join(tmpdir(), 'quasar-update-notifier-'))

  onTestFinished(async () => {
    await rm(cacheRoot, { recursive: true })
  })

  return cacheRoot
}

async function startRegistryServer(payload, onRequest) {
  const server = createServer((request, response) => {
    onRequest?.(request)
    response.setHeader('content-type', 'application/json')
    response.end(payload)
  })

  onTestFinished(async () => {
    await new Promise(resolve => {
      server.close(resolve)
    })
  })

  await new Promise(resolve => {
    server.listen(0, '127.0.0.1', resolve)
  })

  return server.address().port
}

const versionComparisons = [
  ['2.0.0', '1.0.0', true],
  ['1.1.0', '1.0.9', true],
  ['1.0.1', '1.0.0', true],
  ['1.0.0', '1.0.0', false],
  ['1.0.0', '2.0.0', false],
  ['100000000000000000000.0.0', '99999999999999999999.0.0', true],
  ['1.0.1+new', '1.0.0+old', true],
  // A stable release supersedes any of its own prereleases.
  ['1.0.0', '1.0.0-beta.1', true],
  ['2.0.0', '1.0.0-beta.1', true],
  ['1.0.0', '1.0.1-beta.1', false],
  // A prerelease is never offered as an update target.
  ['2.0.0-beta.1', '1.0.0', false],
  ['1.0.0-beta.2', '1.0.0-beta.1', false],
  [void 0, '1.0.0', false],
  ['not-semver', '1.0.0', false]
]

test('exposes the notifier and the update query as public API', async () => {
  const publicApi = await import('./index.js')
  expect(Object.keys(publicApi)).toEqual(['getAvailableUpdate', 'notifyUpdate'])
})

test('compares SemVer versions', () => {
  for (const [latest, current, expected] of versionComparisons) {
    expect(isNewerVersion(latest, current), `${latest} > ${current}`).toBe(
      expected
    )
  }
})

// The rendered box is this package's output contract, pinned exactly —
// but only ONCE: the colored variant below strips ANSI codes and
// compares against this same value instead of hand-aligning a copy.
const expectedNotificationBox = [
  '╭────────────────────────────────────╮',
  '│ Update available 1.0.0 → 2.0.0     │',
  '│ Run npm i -g @quasar/cli to update │',
  '╰────────────────────────────────────╯'
].join('\n')

const ESC = String.fromCodePoint(27)
const ansiRE = new RegExp(`${ESC}\\[[0-9;]*m`, 'g')

test('renders a plain update message when colors are disabled', () => {
  setColorEnvironment('0')

  expect(
    renderNotification({
      current: '1.0.0',
      latest: '2.0.0',
      name: '@quasar/cli'
    })
  ).toBe(expectedNotificationBox)
})

test('colors the update message when FORCE_COLOR requests it', () => {
  setColorEnvironment('1')

  const output = renderNotification({
    current: '1.0.0',
    latest: '2.0.0',
    name: '@quasar/cli'
  })

  // same box as the uncolored render, plus color escapes on the
  // highlighted parts
  expect(output.replace(ansiRE, '')).toBe(expectedNotificationBox)
  expect(output).toContain('\u001B[32m2.0.0\u001B[39m')
  expect(output).toContain('\u001B[36mnpm i -g @quasar/cli\u001B[39m')
})

// the package's own cache-filename encoding contract
const cachedUpdateFile = '%40quasar%2Ftest.json'

test('checks the configured registry and caches an available update', async () => {
  const directory = await createCacheRoot()
  const cacheFile = join(directory, 'cache.json')
  let requestedUrl
  const port = await startRegistryServer(
    '{"latest":"1.0.5","next":"2.0.0"}',
    request => {
      requestedUrl = request.url
    }
  )

  vi.stubEnv('npm_config_registry', `http://127.0.0.1:${port}/registry`)

  await checkForUpdate({
    cacheFile,
    name: '@quasar/cli',
    version: '1.0.0'
  })

  expect(requestedUrl).toBe('/registry/-/package/%40quasar%2Fcli/dist-tags')

  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  expect(cache.latest).toBe('1.0.5')
  expect(cache.registry).toBe(`http://127.0.0.1:${port}/registry/`)
})

test('strips registry credentials from the request and the cache', async () => {
  const directory = await createCacheRoot()
  const cacheFile = join(directory, 'cache.json')
  const port = await startRegistryServer('{"latest":"2.0.0"}')

  vi.stubEnv(
    'npm_config_registry',
    `http://user:secret@127.0.0.1:${port}/registry`
  )

  await checkForUpdate({
    cacheFile,
    name: '@quasar/cli',
    version: '1.0.0'
  })

  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  expect(cache.latest).toBe('2.0.0')
  expect(cache.registry).toBe(`http://127.0.0.1:${port}/registry/`)
})

test('does not offer a prerelease dist-tag as an update', async () => {
  const directory = await createCacheRoot()
  const cacheFile = join(directory, 'cache.json')
  const port = await startRegistryServer('{"latest":"1.0.0-beta.1"}')

  vi.stubEnv('npm_config_registry', `http://127.0.0.1:${port}/`)

  await checkForUpdate({
    cacheFile,
    name: '@quasar/cli',
    version: '1.0.0'
  })

  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  expect(typeof cache.checkedAt).toBe('number')
  expect(cache).not.toHaveProperty('latest')
})

test(
  'starts the first update check immediately',
  { timeout: 10_000 },
  async () => {
    const cacheRoot = await createCacheRoot()
    const cacheFile = join(
      cacheRoot,
      'quasar',
      'update-notifier',
      cachedUpdateFile
    )
    const port = await startRegistryServer('{"latest":"2.0.0"}')

    const environment = {
      ...process.env,
      XDG_CACHE_HOME: cacheRoot,
      npm_config_registry: `http://127.0.0.1:${port}/`,
      // The subprocess loads the real ci-info, which treats CI='false' as an
      // explicit bypass; merely deleting CI would still detect vendor
      // variables such as GITHUB_ACTIONS.
      CI: 'false'
    }
    delete environment.NODE_ENV
    delete environment.NO_UPDATE_NOTIFIER
    delete environment.npm_lifecycle_event

    const notifierUrl = pathToFileURL(
      join(import.meta.dirname, './index.js')
    ).href
    await execFileAsync(
      process.execPath,
      [
        '--input-type=module',
        '--eval',
        `import { notifyUpdate } from '${notifierUrl}'; notifyUpdate({ name: '@quasar/test', version: '1.0.0' })`
      ],
      { env: environment }
    )

    let cache
    const timeout = Date.now() + 5000

    while (Date.now() < timeout) {
      try {
        cache = JSON.parse(await readFile(cacheFile, 'utf8'))
        if (cache.latest === '2.0.0') break
      } catch {
        // The detached check may not have written its result yet.
      }

      await new Promise(resolve => {
        setTimeout(resolve, 25)
      })
    }

    expect(cache?.latest).toBe('2.0.0')
  }
)

test('preserves a cached update when notification output is suppressed', async () => {
  enableNotifier()

  const cacheRoot = await createCacheRoot()
  const cacheDirectory = join(cacheRoot, 'quasar', 'update-notifier')
  const cacheFile = join(cacheDirectory, cachedUpdateFile)

  await mkdir(cacheDirectory, { recursive: true })
  await writeFile(
    cacheFile,
    JSON.stringify({
      checkedAt: Date.now(),
      latest: '2.0.0',
      registry: defaultRegistry
    })
  )
  vi.stubEnv('XDG_CACHE_HOME', cacheRoot)
  setTTY(void 0)

  notifyUpdate({ name: '@quasar/test', version: '1.0.0' })

  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  expect(typeof cache.checkedAt).toBe('number')
  expect(cache.latest).toBe('2.0.0')
})

test('consumes a cached update when its notification is scheduled', async () => {
  enableNotifier()

  const cacheRoot = await createCacheRoot()
  const cacheDirectory = join(cacheRoot, 'quasar', 'update-notifier')
  const cacheFile = join(cacheDirectory, cachedUpdateFile)

  await mkdir(cacheDirectory, { recursive: true })
  await writeFile(
    cacheFile,
    JSON.stringify({
      checkedAt: Date.now(),
      latest: '2.0.0',
      registry: defaultRegistry
    })
  )
  vi.stubEnv('XDG_CACHE_HOME', cacheRoot)
  setTTY(true)
  const once = vi.spyOn(process, 'once').mockImplementation(event => {
    expect(event).toBe('exit')
    return process
  })

  notifyUpdate({ name: '@quasar/test', version: '1.0.0' })

  expect(once).toHaveBeenCalledTimes(1)

  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  expect(typeof cache.checkedAt).toBe('number')
  expect(cache).not.toHaveProperty('latest')
})

test('reports a cached update without consuming it', async () => {
  enableNotifier()

  const cacheRoot = await createCacheRoot()
  const cacheDirectory = join(cacheRoot, 'quasar', 'update-notifier')
  const cacheFile = join(cacheDirectory, cachedUpdateFile)

  await mkdir(cacheDirectory, { recursive: true })
  await writeFile(
    cacheFile,
    JSON.stringify({
      checkedAt: Date.now(),
      latest: '2.0.0',
      registry: defaultRegistry
    })
  )
  vi.stubEnv('XDG_CACHE_HOME', cacheRoot)

  await expect(
    getAvailableUpdate({ name: '@quasar/test', version: '1.0.0' })
  ).resolves.toBe('2.0.0')
  await expect(
    getAvailableUpdate({ name: '@quasar/test', version: '2.0.0' })
  ).resolves.toBeUndefined()

  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  expect(cache.latest).toBe('2.0.0')
})

test('queries the registry first when asked to refresh', async () => {
  enableNotifier()

  const cacheRoot = await createCacheRoot()
  const port = await startRegistryServer('{"latest":"3.0.0"}')
  vi.stubEnv('XDG_CACHE_HOME', cacheRoot)
  vi.stubEnv('npm_config_registry', `http://127.0.0.1:${port}/`)

  await expect(
    getAvailableUpdate({
      name: '@quasar/test',
      version: '1.0.0',
      refresh: true
    })
  ).resolves.toBe('3.0.0')

  const cache = JSON.parse(
    await readFile(
      join(cacheRoot, 'quasar', 'update-notifier', cachedUpdateFile),
      'utf8'
    )
  )
  expect(cache.latest).toBe('3.0.0')
  expect(cache.registry).toBe(`http://127.0.0.1:${port}/`)
})

test('falls back to the cache when a refresh cannot reach the registry', async () => {
  enableNotifier()

  const cacheRoot = await createCacheRoot()
  const cacheDirectory = join(cacheRoot, 'quasar', 'update-notifier')
  const cacheFile = join(cacheDirectory, cachedUpdateFile)
  const registry = 'http://127.0.0.1:1/'

  await mkdir(cacheDirectory, { recursive: true })
  await writeFile(
    cacheFile,
    JSON.stringify({ checkedAt: Date.now(), latest: '2.0.0', registry })
  )
  vi.stubEnv('XDG_CACHE_HOME', cacheRoot)
  vi.stubEnv('npm_config_registry', registry)

  await expect(
    getAvailableUpdate({
      name: '@quasar/test',
      version: '1.0.0',
      refresh: true
    })
  ).resolves.toBe('2.0.0')
})

test('discards a cached update produced by another registry', async () => {
  enableNotifier()

  const cacheRoot = await createCacheRoot()
  const cacheDirectory = join(cacheRoot, 'quasar', 'update-notifier')
  const cacheFile = join(cacheDirectory, cachedUpdateFile)

  await mkdir(cacheDirectory, { recursive: true })
  await writeFile(
    cacheFile,
    JSON.stringify({
      checkedAt: Date.now(),
      latest: '2.0.0',
      registry: 'https://registry.example.com/'
    })
  )
  vi.stubEnv('XDG_CACHE_HOME', cacheRoot)
  // An unroutable registry keeps the spawned background check offline.
  vi.stubEnv('npm_config_registry', 'http://127.0.0.1:1/')
  setTTY(true)
  const once = vi.spyOn(process, 'once').mockImplementation(() => process)

  notifyUpdate({ name: '@quasar/test', version: '1.0.0' })

  expect(once).not.toHaveBeenCalled()

  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  expect(typeof cache.checkedAt).toBe('number')
  expect(cache).not.toHaveProperty('latest')
  expect(cache.registry).toBe('http://127.0.0.1:1/')
})

test('reads the machine as offline with no interface beyond loopback', () => {
  expect(isOffline()).toBe(false)
  interfaces.mockImplementation(() => offline)
  expect(isOffline()).toBe(true)
})

test('starts no check and reports no update while offline', async () => {
  enableNotifier()
  interfaces.mockImplementation(() => offline)

  const cacheRoot = await createCacheRoot()
  const cacheDirectory = join(cacheRoot, 'quasar', 'update-notifier')
  const cacheFile = join(cacheDirectory, cachedUpdateFile)
  await mkdir(cacheDirectory, { recursive: true })
  await writeFile(
    cacheFile,
    JSON.stringify({ checkedAt: 0, latest: '2.0.0', registry: defaultRegistry })
  )
  vi.stubEnv('XDG_CACHE_HOME', cacheRoot)
  setTTY(true)
  const once = vi.spyOn(process, 'once')

  notifyUpdate({ name: '@quasar/test', version: '1.0.0' })
  await expect(
    getAvailableUpdate({
      name: '@quasar/test',
      version: '1.0.0',
      refresh: true
    })
  ).resolves.toBeUndefined()

  expect(once).not.toHaveBeenCalled()
  // a stale cache would have started a background check: untouched
  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  expect(cache.checkedAt).toBe(0)
})

test('does nothing when running in CI', async () => {
  vi.resetModules()
  vi.doMock('ci-info', () => ({ isCI: true }))

  onTestFinished(() => {
    vi.doUnmock('ci-info')
    vi.resetModules()
  })

  const ciNotifier = await import('./internal.js')

  enableNotifier()

  const cacheRoot = await createCacheRoot()
  vi.stubEnv('XDG_CACHE_HOME', cacheRoot)
  setTTY(true)

  ciNotifier.notifyUpdate({ name: '@quasar/test', version: '1.0.0' })

  await expect(
    readFile(
      join(cacheRoot, 'quasar', 'update-notifier', cachedUpdateFile),
      'utf8'
    )
  ).rejects.toThrow()
})
