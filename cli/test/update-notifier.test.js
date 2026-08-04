import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import {
  checkForUpdate,
  isNewerVersion,
  notifyUpdate,
  renderNotification
} from '../lib/update-notifier.js'

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

test('consumes a cached update after one invocation', async t => {
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
  assert.equal('latest' in cache, false)
})

test('keeps the independently published copies in sync', async () => {
  const files = await Promise.all(
    [
      new URL('../lib/update-notifier.js', import.meta.url),
      new URL('../../create-quasar/lib/update-notifier.js', import.meta.url),
      new URL('../../icongenie/lib/utils/update-notifier.js', import.meta.url)
    ].map(url => readFile(url, 'utf8'))
  )

  assert.equal(files[0], files[1])
  assert.equal(files[0], files[2])
})
