import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { test } from 'node:test'

import {
  checkForUpdate,
  isNewerVersion,
  notifyUpdate,
  renderNotification
} from '../src/internal.js'

const execFileAsync = promisify(execFile)
const notifierEnvironmentKeys = [
  'CI',
  'NODE_ENV',
  'NO_UPDATE_NOTIFIER',
  'npm_lifecycle_event'
]

function enableNotifier(t) {
  const previous = Object.fromEntries(
    notifierEnvironmentKeys.map(key => [key, process.env[key]])
  )

  for (const key of notifierEnvironmentKeys) {
    delete process.env[key]
  }

  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === void 0) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
  })
}

const versionComparisons = [
  ['2.0.0', '1.0.0', true],
  ['1.1.0', '1.0.9', true],
  ['1.0.1', '1.0.0', true],
  ['1.0.0', '1.0.0', false],
  ['1.0.0', '2.0.0', false],
  ['1.0.0', '1.0.0-beta.1', true],
  ['1.0.0-beta.2', '1.0.0-beta.1', true],
  ['1.0.0-beta.10', '1.0.0-beta.2', true],
  ['1.0.0-beta', '1.0.0-1', true],
  ['1.0.0-beta.1', '1.0.0-beta', true],
  ['1.0.0+new', '1.0.0+old', false],
  ['100000000000000000000.0.0', '99999999999999999999.0.0', true],
  [void 0, '1.0.0', false],
  ['not-semver', '1.0.0', false]
]

test('exposes only the notifier as public API', async () => {
  const publicApi = await import('../src/index.js')
  assert.deepEqual(Object.keys(publicApi), ['notifyUpdate'])
})

test('compares SemVer versions', () => {
  for (const [latest, current, expected] of versionComparisons) {
    assert.equal(
      isNewerVersion(latest, current),
      expected,
      `${latest} > ${current}`
    )
  }
})

test('renders a dependency-free update message', () => {
  assert.equal(
    renderNotification({
      current: '1.0.0',
      latest: '2.0.0',
      name: '@quasar/cli'
    }),
    [
      '╭────────────────────────────────────╮',
      '│ Update available 1.0.0 → 2.0.0     │',
      '│ Run npm i -g @quasar/cli to update │',
      '╰────────────────────────────────────╯'
    ].join('\n')
  )
})

test('checks the configured registry and caches an available update', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'quasar-update-notifier-'))
  const cacheFile = join(directory, 'cache.json')
  let requestedUrl
  const server = createServer((request, response) => {
    requestedUrl = request.url
    response.setHeader('content-type', 'application/json')
    response.end('{"latest":"2.0.0"}')
  })

  t.after(async () => {
    await new Promise(resolve => {
      server.close(resolve)
    })
    await rm(directory, { recursive: true })
  })

  await new Promise(resolve => {
    server.listen(0, '127.0.0.1', resolve)
  })
  const { port } = server.address()
  const previousRegistry = process.env.npm_config_registry
  process.env.npm_config_registry = `http://127.0.0.1:${port}/registry`

  try {
    await checkForUpdate({
      cacheFile,
      name: '@quasar/cli',
      version: '1.0.0'
    })
  } finally {
    if (previousRegistry === void 0) {
      delete process.env.npm_config_registry
    } else {
      process.env.npm_config_registry = previousRegistry
    }
  }

  assert.equal(requestedUrl, '/registry/-/package/%40quasar%2Fcli/dist-tags')
  assert.equal(JSON.parse(await readFile(cacheFile, 'utf8')).latest, '2.0.0')
})

test('starts the first update check immediately', async t => {
  const cacheRoot = await mkdtemp(join(tmpdir(), 'quasar-update-notifier-'))
  const cacheFile = join(
    cacheRoot,
    'quasar',
    'update-notifier',
    '%40quasar%2Ftest.json'
  )
  const server = createServer((request, response) => {
    response.setHeader('content-type', 'application/json')
    response.end('{"latest":"2.0.0"}')
  })

  t.after(async () => {
    await new Promise(resolve => {
      server.close(resolve)
    })
    await rm(cacheRoot, { recursive: true })
  })

  await new Promise(resolve => {
    server.listen(0, '127.0.0.1', resolve)
  })

  const environment = {
    ...process.env,
    XDG_CACHE_HOME: cacheRoot,
    npm_config_registry: `http://127.0.0.1:${server.address().port}/`
  }
  delete environment.CI
  delete environment.NODE_ENV
  delete environment.NO_UPDATE_NOTIFIER
  delete environment.npm_lifecycle_event

  const notifierUrl = pathToFileURL(
    join(import.meta.dirname, '../src/index.js')
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

  assert.equal(cache?.latest, '2.0.0')
})

test('preserves a cached update when notification output is suppressed', async t => {
  enableNotifier(t)

  const cacheRoot = await mkdtemp(join(tmpdir(), 'quasar-update-notifier-'))
  const cacheDirectory = join(cacheRoot, 'quasar', 'update-notifier')
  const cacheFile = join(cacheDirectory, '%40quasar%2Ftest.json')
  const previousCacheHome = process.env.XDG_CACHE_HOME

  t.after(async () => {
    if (previousCacheHome === void 0) {
      delete process.env.XDG_CACHE_HOME
    } else {
      process.env.XDG_CACHE_HOME = previousCacheHome
    }

    await rm(cacheRoot, { recursive: true })
  })

  await mkdir(cacheDirectory, { recursive: true })
  await writeFile(
    cacheFile,
    JSON.stringify({ checkedAt: Date.now(), latest: '2.0.0' })
  )
  process.env.XDG_CACHE_HOME = cacheRoot

  notifyUpdate({ name: '@quasar/test', version: '1.0.0' })

  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  assert.equal(typeof cache.checkedAt, 'number')
  assert.equal(cache.latest, '2.0.0')
})

test('consumes a cached update when its notification is scheduled', async t => {
  enableNotifier(t)

  const cacheRoot = await mkdtemp(join(tmpdir(), 'quasar-update-notifier-'))
  const cacheDirectory = join(cacheRoot, 'quasar', 'update-notifier')
  const cacheFile = join(cacheDirectory, '%40quasar%2Ftest.json')
  const previousCacheHome = process.env.XDG_CACHE_HOME
  const previousIsTTY = process.stdout.isTTY

  t.after(async () => {
    if (previousCacheHome === void 0) {
      delete process.env.XDG_CACHE_HOME
    } else {
      process.env.XDG_CACHE_HOME = previousCacheHome
    }

    if (previousIsTTY === void 0) {
      delete process.stdout.isTTY
    } else {
      process.stdout.isTTY = previousIsTTY
    }

    await rm(cacheRoot, { recursive: true })
  })

  await mkdir(cacheDirectory, { recursive: true })
  await writeFile(
    cacheFile,
    JSON.stringify({ checkedAt: Date.now(), latest: '2.0.0' })
  )
  process.env.XDG_CACHE_HOME = cacheRoot
  process.stdout.isTTY = true
  t.mock.method(process, 'once', event => {
    assert.equal(event, 'exit')
    return process
  })

  notifyUpdate({ name: '@quasar/test', version: '1.0.0' })

  const cache = JSON.parse(await readFile(cacheFile, 'utf8'))
  assert.equal(typeof cache.checkedAt, 'number')
  assert.equal('latest' in cache, false)
})
