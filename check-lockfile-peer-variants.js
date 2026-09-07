/**
 * Fails when workspace importers resolve a guarded package to different
 * pnpm peer variants (e.g. vue-router@5.3.1(...)(vite@8.2.1...) in one
 * importer and vue-router@5.3.1(...)(vite@8.2.2...) in another).
 *
 * vue-router's identity depends on its optional `vite` peer, and pnpm only
 * re-resolves an importer's peers when that importer's own package.json
 * changes, so a vite bump in app-vite strands every importer without a
 * direct vite dependency on the old variant. Two vue-router copies then
 * carry incompatible `unique symbol`-keyed Router types (TS2345 in the
 * playgrounds). The importers that need to follow declare `vite`
 * themselves; this script catches the day that stops being enough.
 *
 * Usage: node check-lockfile-peer-variants.js [path/to/pnpm-lock.yaml]
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const GUARDED_PACKAGES = ['vue-router']

const lockfilePath = resolve(
  import.meta.dirname,
  process.argv[2] ?? 'pnpm-lock.yaml'
)

const lines = readFileSync(lockfilePath, 'utf8').split('\n')

// importer name -> package name -> resolved version string (with peer suffix).
// pnpm 12 lockfiles hold several YAML documents (the packageManager one
// first), each with its own "importers:" block, so scan every occurrence.
const resolutions = new Map()
let importer = null
let pkg = null

for (let i = 0; i < lines.length; i++) {
  if (lines[i] !== 'importers:') continue

  for (i++; i < lines.length; i++) {
    const line = lines[i]
    if (/^[^\s]/.test(line)) break // next top-level section

    const importerMatch = /^ {2}([^\s].*):$/.exec(line)
    if (importerMatch !== null) {
      importer = importerMatch[1]
      if (!resolutions.has(importer)) resolutions.set(importer, new Map())
      continue
    }

    const pkgMatch = /^ {6}('?)([^\s:']+)\1:$/.exec(line)
    if (pkgMatch !== null) {
      pkg = pkgMatch[2]
      continue
    }

    const versionMatch = /^ {8}version: (.+)$/.exec(line)
    if (versionMatch !== null && GUARDED_PACKAGES.includes(pkg)) {
      resolutions.get(importer).set(pkg, versionMatch[1])
    }
  }
}

if (resolutions.size === 0) {
  console.error(`${lockfilePath}: no "importers:" section found`)
  process.exit(1)
}

let failed = false

for (const name of GUARDED_PACKAGES) {
  const byVariant = new Map()
  for (const [imp, pkgs] of resolutions) {
    if (!pkgs.has(name)) continue
    const version = pkgs.get(name)
    if (!byVariant.has(version)) byVariant.set(version, [])
    byVariant.get(version).push(imp)
  }
  if (byVariant.size <= 1) continue

  failed = true
  console.error(
    `\n${name} resolves to ${byVariant.size} different peer variants:`
  )
  for (const [version, importers] of byVariant) {
    console.error(`\n  ${version}`)
    for (const imp of importers) console.error(`    - ${imp}`)
  }
}

if (failed) {
  console.error(
    '\nEvery importer must share one variant, otherwise its types (and runtime) come from a different copy.' +
      '\nAn importer without a direct "vite" dependency keeps its old vue-router variant across vite bumps;' +
      '\ngive it one (same range as app-vite), run pnpm install, then prune the stale snapshots.\n'
  )
  process.exit(1)
}

console.log(`lockfile peer variants OK (${GUARDED_PACKAGES.join(', ')})`)
