import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir, networkInterfaces } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { isCI } from 'ci-info'

const backgroundCheckFlag = '--quasar-update-notifier-check'
const checkInterval = 24 * 60 * 60 * 1000
const moduleUrl = import.meta.url

function getCacheFile(packageName) {
  const cacheDir =
    process.env.XDG_CACHE_HOME ||
    process.env.LOCALAPPDATA ||
    join(homedir(), '.cache')

  return join(
    cacheDir,
    'quasar',
    'update-notifier',
    `${encodeURIComponent(packageName)}.json`
  )
}

function getRegistryUrl() {
  try {
    const registry = new URL(
      process.env.npm_config_registry || 'https://registry.npmjs.org'
    )
    if (!registry.pathname.endsWith('/')) registry.pathname += '/'
    // Embedded credentials would otherwise end up in the cache file, and
    // fetch() rejects URLs that carry them.
    registry.username = ''
    registry.password = ''
    return registry
  } catch {
    return void 0
  }
}

function readCache(cacheFile) {
  try {
    return JSON.parse(readFileSync(cacheFile, 'utf8'))
  } catch {
    return void 0
  }
}

function writeCache(cacheFile, value) {
  try {
    mkdirSync(dirname(cacheFile), { recursive: true })
    writeFileSync(cacheFile, JSON.stringify(value))
  } catch {
    // An update check must never interfere with the command being run.
  }
}

function parseVersion(version) {
  if (typeof version !== 'string') return void 0

  const match = version.match(
    /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?(?:\+[\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*)?$/
  )

  if (!match) return void 0

  return {
    core: match.slice(1, 4),
    prerelease: match[4] !== void 0
  }
}

function compareNumeric(left, right) {
  if (left.length !== right.length) return left.length > right.length
  return left > right
}

export function isNewerVersion(latest, current) {
  const next = parseVersion(latest)
  const installed = parseVersion(current)

  if (!next || !installed) return false

  // A prerelease is never offered as an update target.
  if (next.prerelease) return false

  for (let index = 0; index < 3; index++) {
    if (next.core[index] !== installed.core[index]) {
      return compareNumeric(next.core[index], installed.core[index])
    }
  }

  // A stable release supersedes any of its own prereleases.
  return installed.prerelease
}

// Mirrors the color detection of kolorist, which the consuming CLIs use,
// with the CI vendor check delegated to ci-info.
function areColorsEnabled() {
  const { FORCE_COLOR, NO_COLOR, NODE_DISABLE_COLORS, TERM } = process.env

  if (NODE_DISABLE_COLORS || NO_COLOR || FORCE_COLOR === '0') return false
  if (FORCE_COLOR === '1' || FORCE_COLOR === '2' || FORCE_COLOR === '3') {
    return true
  }
  if (TERM === 'dumb') return false
  return isCI || process.stdout.isTTY === true
}

export function renderNotification({ current, latest, name }) {
  const color = areColorsEnabled()
    ? (open, close) => value => `\u001B[${open}m${value}\u001B[${close}m`
    : () => value => value
  const green = color(32, 39)
  const cyan = color(36, 39)

  const command = `npm i -g ${name}`
  const firstLine = `Update available ${current} → ${latest}`
  const secondLine = `Run ${command} to update`
  const contentWidth = Math.max(firstLine.length, secondLine.length)
  const border = '─'.repeat(contentWidth + 2)
  const line = (value, colored) =>
    `│ ${colored}${' '.repeat(contentWidth - value.length)} │`

  return [
    `╭${border}╮`,
    line(firstLine, `Update available ${current} → ${green(latest)}`),
    line(secondLine, `Run ${cyan(command)} to update`),
    `╰${border}╯`
  ].join('\n')
}

function isDisabled() {
  return (
    'NO_UPDATE_NOTIFIER' in process.env ||
    process.env.NODE_ENV === 'test' ||
    isCI
  )
}

// No network interface beyond loopback means no registry to ask: the
// machine is offline, so no check is started at all.
export function isOffline() {
  for (const addresses of Object.values(networkInterfaces())) {
    if (addresses.some(address => !address.internal)) return false
  }
  return true
}

export async function checkForUpdate({
  cacheFile,
  name,
  version,
  timeout = 30_000
}) {
  const registry = getRegistryUrl()
  const packagePath = encodeURIComponent(name)
  const url = new URL(`-/package/${packagePath}/dist-tags`, registry)
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(timeout)
  })

  if (!response.ok) {
    throw new Error(`Registry responded with ${response.status}`)
  }

  const { latest } = (await response.json()) ?? {}

  writeCache(cacheFile, {
    checkedAt: Date.now(),
    latest: isNewerVersion(latest, version) ? latest : void 0,
    registry: registry.href
  })
}

function startBackgroundCheck(cacheFile, name, version) {
  const child = spawn(
    process.execPath,
    [fileURLToPath(moduleUrl), backgroundCheckFlag, cacheFile, name, version],
    { detached: true, stdio: 'ignore', windowsHide: true }
  )

  // A spawn failure must never crash the command being run.
  child.on('error', () => {})
  child.unref()
}

/**
 * The cached registry answer for this registry, scheduling a background
 * refresh when there is none yet or it is older than the check interval.
 * Undefined until the first check has landed.
 */
function readCurrentCache({ cacheFile, name, version, registry }) {
  const cache = readCache(cacheFile)
  const now = Date.now()

  // A cache produced by another registry must not be trusted for this one.
  if (!cache || cache.registry !== registry.href) {
    writeCache(cacheFile, { checkedAt: now, registry: registry.href })
    startBackgroundCheck(cacheFile, name, version)
    return
  }

  if (now - cache.checkedAt >= checkInterval) {
    startBackgroundCheck(cacheFile, name, version)
  }

  return cache
}

export function notifyUpdate({ name, version }) {
  if (!name || !version || isDisabled() || isOffline()) return

  const registry = getRegistryUrl()
  if (registry === void 0) return

  const cacheFile = getCacheFile(name)
  const cache = readCurrentCache({ cacheFile, name, version, registry })
  if (cache === void 0) return

  const latest = cache.latest
  if (
    process.stdout.isTTY &&
    process.env.npm_lifecycle_event === void 0 &&
    isNewerVersion(latest, version)
  ) {
    const message = renderNotification({
      current: version,
      latest,
      name
    })
    process.once('exit', () => console.error(`\n${message}\n`))
    writeCache(cacheFile, {
      checkedAt: cache.checkedAt,
      registry: cache.registry
    })
  }
}

/**
 * The newer version available for a package, for a long-lived process
 * that reports it its own way (an MCP server has no terminal to print
 * the box to). Reads the same cache on the same refresh schedule as
 * notifyUpdate() without consuming it; `refresh: true` queries the
 * registry first and waits for it (`timeout` ms), falling back to the
 * cache when the registry is unreachable. Resolves to undefined when
 * there is no update to offer, the check is disabled, or the machine
 * is offline.
 */
export async function getAvailableUpdate({
  name,
  version,
  refresh = false,
  timeout
}) {
  if (!name || !version || isDisabled() || isOffline()) return

  const registry = getRegistryUrl()
  if (registry === void 0) return

  const cacheFile = getCacheFile(name)

  if (refresh) {
    try {
      await checkForUpdate({ cacheFile, name, version, timeout })
    } catch {
      // Offline or a registry error: the cached answer is the next best.
    }
  }

  const cache = readCurrentCache({ cacheFile, name, version, registry })
  if (cache === void 0) return

  return isNewerVersion(cache.latest, version) ? cache.latest : void 0
}

if (process.argv[2] === backgroundCheckFlag) {
  const cacheFile = process.argv[3]
  const name = process.argv[4]
  const version = process.argv[5]

  try {
    await checkForUpdate({ cacheFile, name, version })
  } catch {
    // A background update check failing does not need to be reported.
  }

  process.exit()
}
