import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { join } from 'node:path'

// The freshness contract for ui/dist: the full build writes a stamp of
// its input hashes (script.build.js) and every consumer verifies it
// before running — the vite-plugin/app-vite/docs global setups, the
// pretest hooks and the create-quasar/cli e2e local registry all
// rebuild a stale dist — so a forgotten rebuild after ui changes can
// never silently test old code.

const uiDir = join(import.meta.dirname, '..')
const repoDir = join(uiDir, '..')

// lives inside dist/ so the CI ui-dist cache and ui-build artifacts
// carry it along; NOT a dotfile (upload-artifact excludes hidden files
// by default) and excluded from the published package via "files"
export const stampFile = join(uiDir, 'dist/build-stamp.json')

// MUST mirror the ui-dist cache key of the CI workflows (the
// hashFiles(...) input list in .github/workflows) — enforced by
// assertWorkflowsMirrorInputs() on every staleness check and build
const inputGroups = {
  'ui/src': join(uiDir, 'src'),
  'ui/lang': join(uiDir, 'lang'),
  'ui/icon-set': join(uiDir, 'icon-set'),
  'ui/build': join(uiDir, 'build'),
  'ui/package.json': join(uiDir, 'package.json'),
  'pnpm-lock.yaml': join(repoDir, 'pnpm-lock.yaml')
}

// None of the input groups tracks a dotfile, so what turns up under one is
// an OS or editor dropping (.DS_Store, .eslintcache, .vscode/) that git
// ignores and a CI checkout never has. Hashing those would let a Finder
// visit read as a source change — a needless multi-minute rebuild — and
// would put this digest permanently out of step with the workflows' key.
const isDroppingPath = entry =>
  entry.split('/').some(part => part.startsWith('.'))

function hashTarget(target) {
  const hash = createHash('sha256')

  if (statSync(target).isDirectory()) {
    // forward-slash + sorted relative paths keep the digest identical
    // across operating systems
    const entries = readdirSync(target, { recursive: true })
      .map(entry => String(entry).replaceAll('\\', '/'))
      .sort()

    for (const entry of entries) {
      if (isDroppingPath(entry)) continue
      const file = join(target, entry)
      if (!statSync(file).isFile()) continue
      hash.update(entry)
      hash.update('\0')
      hash.update(readFileSync(file))
    }
  } else {
    hash.update(readFileSync(target))
  }

  return hash.digest('hex')
}

function computeInputHashes() {
  const result = {}
  for (const [name, target] of Object.entries(inputGroups)) {
    result[name] = hashTarget(target)
  }
  return result
}

// The workflows' ui-dist cache keys and this stamp assert the same
// freshness contract from the same input list; a one-sided edit means
// either silent staleness or permanent cache misses, so the mirror is
// enforced instead of trusted. Throws on drift — and when NO key is
// found at all, so a key-format change cannot silently retire the
// check itself.
function assertWorkflowsMirrorInputs() {
  const workflowsDir = join(repoDir, '.github/workflows')
  if (!existsSync(workflowsDir)) return // outside the monorepo checkout

  const expected = Object.keys(inputGroups).sort().join(', ')
  const keyRE = /key: ui-dist-.*?hashFiles\(([^)]+)\)/g
  let found = 0

  for (const entry of readdirSync(workflowsDir)) {
    if (!entry.endsWith('.yml')) continue

    const content = readFileSync(join(workflowsDir, entry), 'utf8')
    for (const match of content.matchAll(keyRE)) {
      found++
      const list = match[1]
        .split(',')
        .map(item =>
          item
            .trim()
            .replaceAll("'", '')
            .replace(/\/\*\*$/, '')
        )
        .sort()
        .join(', ')

      if (list !== expected) {
        throw new Error(
          `.github/workflows/${entry} hashes a different ui-dist input ` +
            `list (${list}) than ui/build/build-stamp.js (${expected}) — ` +
            'the freshness contract must stay mirrored on both sides'
        )
      }
    }
  }

  if (found === 0) {
    throw new Error(
      'no ui-dist cache key found in .github/workflows — if the key ' +
        'format changed, update assertWorkflowsMirrorInputs() in ' +
        'ui/build/build-stamp.js to keep the mirror check alive'
    )
  }

  // third copy of the contract: the cache-seed workflow's push paths
  // ("exactly the inputs of the shared cache key"). Drift here is
  // fail-safe (the seed just stops running -> PRs rebuild), but it
  // silently degrades the cache, so it is enforced too.
  const seedFile = join(workflowsDir, 'ui-build-cache.yml')
  if (existsSync(seedFile)) {
    const seedMatch = readFileSync(seedFile, 'utf8').match(
      /paths:\n((?:\s+- '[^']+'\n)+)/
    )
    if (seedMatch === null) {
      throw new Error(
        'no push paths block found in ui-build-cache.yml — update ' +
          'assertWorkflowsMirrorInputs() in ui/build/build-stamp.js to ' +
          'keep the seed-trigger mirror check alive'
      )
    }

    const seedList = [...seedMatch[1].matchAll(/- '([^']+)'/g)]
      .map(match => match[1].replace(/\/\*\*$/, ''))
      .sort()
      .join(', ')

    if (seedList !== expected) {
      throw new Error(
        `.github/workflows/ui-build-cache.yml triggers on a different ` +
          `input list (${seedList}) than ui/build/build-stamp.js ` +
          `(${expected}) — the cache seed must fire on exactly the ` +
          'inputs the key hashes'
      )
    }
  }
}

export function writeBuildStamp() {
  assertWorkflowsMirrorInputs()
  writeFileSync(stampFile, JSON.stringify(computeInputHashes(), null, 2) + '\n')
}

// Builds the ui package when dist is missing or stale (per the stamp);
// a no-op when it is fresh. Returns whether a build ran. Shared by the
// dev scripts' CLI wrapper (ensure-fresh-build.js), the test global
// setups of the consuming packages and the e2e local registry — every
// ui/dist consumer self-heals instead of failing or silently testing
// stale code.
export function ensureFreshBuild() {
  const staleness = getBuildStaleness()
  if (staleness === null) return false

  console.log(`Building the ui package (${staleness})...`)
  const { status } = spawnSync('pnpm', ['build'], {
    cwd: uiDir,
    stdio: 'inherit'
  })
  if (status !== 0) {
    throw new Error(`The ui build failed (exit code ${status})`)
  }
  return true
}

// Returns null when dist matches the inputs it was built from,
// otherwise a human-readable reason
export function getBuildStaleness() {
  assertWorkflowsMirrorInputs()

  if (!existsSync(stampFile)) {
    return 'ui/dist carries no build stamp (partial or pre-stamp build)'
  }

  const stamped = JSON.parse(readFileSync(stampFile, 'utf8'))
  const current = computeInputHashes()
  const changed = Object.keys(current).filter(
    name => stamped[name] !== current[name]
  )

  return changed.length === 0
    ? null
    : `changed since ui/dist was built: ${changed.join(', ')}`
}
