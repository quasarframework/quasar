/**
 * AI-docs extractor entry point.
 *
 * Run: pnpm generate:ai-docs  (from docs/)
 * Or:  node docs/build/ai-docs/extract.js  (from repo root)
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { performance } from 'node:perf_hooks'
import { globSync } from 'tinyglobby'
import matter from 'gray-matter'

import { createAiMd } from './md-ai.js'
import { clearEmitters, createCtx, emitTokens } from './emit/walker.js'
import { registerProseEmitters } from './emit/prose.js'
import { registerContainerEmitters } from './emit/containers.js'
import { registerTabsEmitter } from './emit/tabs.js'
import {
  clearTagHandlers,
  registerHtmlDispatchers,
  registerTagHandler
} from './emit/html-dispatcher.js'
import { stripScriptDoc } from './emit/script-doc-stripper.js'
import { applyLlmContentControl } from './emit/llm-content-control.js'
import { docApiHandler } from './emit/doc-api.js'
import { docExampleHandler } from './emit/doc-example.js'
import { docTreeHandler } from './emit/doc-tree.js'
import { docInstallationHandler } from './emit/doc-installation.js'
import { docLinkHandler } from './emit/doc-link.js'

import { processFrontmatter } from './frontmatter.js'
import { sourceToMenuKey, sourceToOutputPath } from './routes.js'
import { selectPages } from './page-selector.js'
import {
  buildMenuMaps,
  buildMenuPaths,
  buildSectionIndex,
  loadFrontmatters
} from './menu.js'
import { checkApiCoverage } from './api-coverage.js'
import { writePage } from './output/per-page.js'
import { buildLlmsTxt } from './output/llms-txt.js'
import { countTokens } from './tokens.js'

const __dirname = import.meta.dirname
const REPO_ROOT = resolve(__dirname, '../../..')
const SRC_PAGES = join(REPO_ROOT, 'docs/src/pages')
const API_DIR = join(REPO_ROOT, 'ui/dist/api')
const EXAMPLES_DIR = join(REPO_ROOT, 'docs/src/examples')
const DIST_DIR = join(REPO_ROOT, 'docs/build/ai-docs/dist')

const MAX_SOURCE_WARNINGS_SHOWN = 10
const SITE_URL = 'https://quasar.dev'

const GLOB = '**/*.md'
const IGNORES = [
  '**/api-explorer/**',
  '**/docs/**',
  '**/integrations/**',
  '**/landing/**',
  '**/layout/gallery/**',
  '**/layout/grid/flex-playground/**',
  '**/sponsors-and-backers/**',
  '**/video-tutorials/**',
  '**/__elements.md',
  '**/why-donate.md'
]

/**
 * Wire the walker and dispatcher with every emitter the pipeline needs.
 * Clears prior registrations first so repeated calls (e.g. across tests)
 * never leave stale handlers. registerTabsEmitter() must come after
 * registerProseEmitters() because it overrides the fence emitter.
 *
 * @param {{ apiDir: string, examplesDir: string }} opts
 * @returns {void}
 */
function registerAllEmitters({ apiDir, examplesDir }) {
  clearEmitters()
  clearTagHandlers()
  registerProseEmitters()
  registerContainerEmitters()
  registerTabsEmitter()
  registerHtmlDispatchers()

  registerTagHandler('DocApi', docApiHandler({ apiDir }))
  registerTagHandler('DocExample', docExampleHandler({ examplesDir }))
  registerTagHandler('DocTree', docTreeHandler())
  registerTagHandler('DocInstall', docInstallationHandler())
  registerTagHandler('DocLink', docLinkHandler())
}

/**
 * Process one source page end-to-end: pre-walker passes, frontmatter parse,
 * markdown-it tokenize, token walk, frontmatter resolution.
 *
 * @param {{ relativePath: string, md: import('markdown-it'), menuByKey: Map<string, { title: string | null }>, menuPaths: Set<string> }} opts
 * @returns {{ outputFrontmatter: Record<string, unknown>, body: string, warnings: string[] }}
 */
function extractOne({ relativePath, md, menuByKey, menuPaths }) {
  const source = readFileSync(join(SRC_PAGES, relativePath), 'utf8')
  const cleaned = applyLlmContentControl(stripScriptDoc(source))
  const { data, content } = matter(cleaned)
  const tokens = md.parse(content, {})
  const ctx = createCtx({
    sourcePath: relativePath,
    frontMatter: data,
    menuPaths
  })
  const body = emitTokens(tokens, ctx)
  const outputFrontmatter = processFrontmatter(
    data,
    menuByKey,
    relativePath,
    ctx.warnings
  )
  if (!outputFrontmatter.title) {
    outputFrontmatter.title = basename(relativePath, '.md')
  }
  return { outputFrontmatter, body, warnings: ctx.warnings }
}

/**
 * Top-level section of a menu key, e.g. `vue-components` from
 * `vue-components/knob`. Used only for summary aggregation.
 *
 * @param {string} key
 * @returns {string}
 */
function sectionFromKey(key) {
  return key.split('/')[0] || ''
}

/**
 * Warning severity. 'fatal' means a page failed to process entirely.
 * 'config' means a broken build input or handler setup, like a corrupt
 * API JSON or a handler missing its context function. 'source' means an
 * authoring issue in the docs content. Categories drive the exit code.
 *
 * @param {string} message
 * @returns {'fatal'|'config'|'source'}
 */
function classifyWarning(message) {
  if (message.startsWith('FATAL processing ')) {
    return 'fatal'
  }
  if (/failed to parse|has no .* handler/i.test(message)) {
    return 'config'
  }
  return 'source'
}

/**
 * Verify external build artifacts the extractor depends on.
 * `ui/dist/api/*.json` comes from the Quasar UI build. Without it every
 * component page would warn, so fail fast with a clear message instead.
 *
 * @throws {Error} if the API dir is absent or has no JSON files.
 * @returns {void}
 */
function checkPrerequisites() {
  if (!existsSync(API_DIR)) {
    throw new Error(
      `ui/dist/api/ not found at ${API_DIR}\n` +
        `Run \`pnpm --filter quasar build:api\` (or the equivalent build step) first to generate API JSON files.`
    )
  }
  const jsonFiles = readdirSync(API_DIR).filter(fileName =>
    fileName.endsWith('.json')
  )
  if (jsonFiles.length === 0) {
    throw new Error(
      `ui/dist/api/ exists but contains no .json files; build artifact is incomplete.`
    )
  }
}

/**
 * Quasar version + git commit the artifact was generated from. Commit is
 * null outside a git checkout (e.g. a source tarball).
 *
 * @returns {{ quasarVersion: string, sourceCommit: string | null }}
 */
function buildProvenance() {
  const uiPackage = JSON.parse(
    readFileSync(join(REPO_ROOT, 'ui/package.json'), 'utf8')
  )
  let sourceCommit = null
  try {
    sourceCommit = execSync('git rev-parse HEAD', { cwd: REPO_ROOT })
      .toString()
      .trim()
  } catch {
    // not a git checkout, leave null
  }
  return { quasarVersion: uiPackage.version, sourceCommit }
}

/**
 * Write llms.txt (per llmstxt.org) indexing every generated page.
 *
 * @param {string[]} writtenPaths Relative source paths of pages actually written.
 * @param {Map<string, { title: string | null, desc: string | null }>} menuByKey
 * @param {string} quasarVersion
 * @returns {void}
 */
function writeLlmsTxt(writtenPaths, menuByKey, quasarVersion) {
  const pages = writtenPaths.map(relativePath => {
    const key = sourceToMenuKey(relativePath)
    const entry = menuByKey.get(key)
    return { key, title: entry?.title ?? key, desc: entry?.desc ?? null }
  })
  writeFileSync(
    join(DIST_DIR, 'llms.txt'),
    buildLlmsTxt({
      pages,
      sectionIndex: buildSectionIndex(),
      quasarVersion,
      baseUrl: SITE_URL
    })
  )
}

/**
 * Write the provenance sidecar and the generated dist README.
 *
 * @param {number} pages
 * @returns {string} quasarVersion for reuse
 */
function writeMeta(pages) {
  const { quasarVersion, sourceCommit } = buildProvenance()
  writeFileSync(
    join(DIST_DIR, '_meta.json'),
    JSON.stringify({ quasarVersion, sourceCommit, pages }, null, 2)
  )
  writeFileSync(
    join(DIST_DIR, 'README.md'),
    `# Quasar Documentation for LLMs\n\n` +
      `Machine-generated markdown of the Quasar v${quasarVersion} documentation ` +
      `(${pages} pages), extracted from the official docs source at commit ${sourceCommit ?? 'unknown'}.\n\n` +
      `Generated by \`docs/build/ai-docs\` in the quasarframework/quasar repo. ` +
      `Do not edit, every build overwrites this directory.\n`
  )
  return quasarVersion
}

/**
 * Orchestrator. Wires the pipeline, drives the per-page loop, writes outputs
 * plus the `_warnings.json` and `_meta.json` sidecars, and prints a stdout
 * summary. Exits non-zero on `fatal` or `config` warnings so CI fails loudly
 * when the build itself is broken. `source` warnings are authoring nits and
 * don't fail.
 *
 * @returns {void}
 */
function main() {
  checkPrerequisites()
  const startTime = performance.now()
  const md = createAiMd()
  registerAllEmitters({ apiDir: API_DIR, examplesDir: EXAMPLES_DIR })

  const globbed = globSync(GLOB, { cwd: SRC_PAGES, ignore: IGNORES })
  const menuByKey = buildMenuMaps(SRC_PAGES)
  if (menuByKey.size === 0) {
    throw new Error(
      'flat-menu.js returned no entries; something is wrong with the menu import'
    )
  }
  const { included, orphans, missing } = selectPages(globbed, menuByKey)
  // Menu entries whose source exists but sits in IGNORES are deliberately
  // skipped (interactive/marketing pages), not missing. Only report menu
  // entries with no source file at all.
  const allSourceKeys = new Set(
    globSync(GLOB, { cwd: SRC_PAGES }).map(sourceToMenuKey)
  )
  const trulyMissing = missing.filter(key => !allSourceKeys.has(key))
  loadFrontmatters(included, menuByKey, SRC_PAGES)
  const menuPaths = buildMenuPaths(menuByKey)

  rmSync(DIST_DIR, { recursive: true, force: true })
  mkdirSync(DIST_DIR, { recursive: true })

  const warningsByKind = { fatal: [], config: [], source: [] }
  const writtenPaths = []
  let totalBytes = 0
  const sectionCounts = {}

  for (const relativePath of included) {
    try {
      const { outputFrontmatter, body, warnings } = extractOne({
        relativePath,
        md,
        menuByKey,
        menuPaths
      })
      for (const warning of warnings) {
        warningsByKind[classifyWarning(warning)].push(warning)
      }
      const outputPath = sourceToOutputPath(relativePath)
      writePage({
        distDir: DIST_DIR,
        outputPath,
        frontMatter: outputFrontmatter,
        body
      })
      writtenPaths.push(relativePath)
      totalBytes += body.length
      const section = sectionFromKey(sourceToMenuKey(relativePath))
      sectionCounts[section] = (sectionCounts[section] || 0) + 1
    } catch (err) {
      // One bad page should not stop the run. Collect the failure so the
      // summary surfaces them all at once.
      warningsByKind.fatal.push(
        `FATAL processing ${relativePath}: ${err.message}`
      )
    }
  }

  if (writtenPaths.length === 0) {
    throw new Error(
      'Extracted 0 pages. Likely menu/glob mismatch or all pages failed.'
    )
  }

  const coverageWarnings = checkApiCoverage({
    apiDir: API_DIR,
    srcPagesDir: SRC_PAGES,
    includedPages: included
  })
  warningsByKind.source.push(...coverageWarnings)

  const quasarVersion = writeMeta(writtenPaths.length)
  writeLlmsTxt(writtenPaths, menuByKey, quasarVersion)

  const warningCount =
    warningsByKind.fatal.length +
    warningsByKind.config.length +
    warningsByKind.source.length
  const warningsLogPath = join(DIST_DIR, '_warnings.json')
  if (warningCount !== 0) {
    // The stdout summary truncates. The sidecar keeps the full list.
    writeFileSync(warningsLogPath, JSON.stringify(warningsByKind, null, 2))
  }

  const seconds = ((performance.now() - startTime) / 1000).toFixed(1)

  console.log(
    `\n[ai-docs] Generated ${writtenPaths.length} pages in ${seconds}s`
  )
  console.log(`  Source pages found:        ${globbed.length}`)
  console.log(
    `  Filtered by menu:          ${writtenPaths.length} included, ${orphans.length} orphans`
  )
  if (orphans.length !== 0) {
    console.log(`  Orphans (in pages, not in menu):`)
    for (const orphan of orphans) {
      console.log(`    - ${orphan}`)
    }
  }
  if (trulyMissing.length !== 0) {
    console.log(`  Missing (in menu, no source file):`)
    for (const missingKey of trulyMissing) {
      console.log(`    - ${missingKey}`)
    }
  }
  let totalTokens = 0
  for (const relativePath of writtenPaths) {
    const outputFilePath = join(DIST_DIR, sourceToOutputPath(relativePath))
    if (existsSync(outputFilePath)) {
      totalTokens += countTokens(readFileSync(outputFilePath, 'utf8'))
    }
  }
  console.log(
    `  Output total:              ${(totalBytes / 1024).toFixed(1)} KB body, ~${totalTokens.toLocaleString()} tokens (tokenx cl100k_base)`
  )
  console.log(`  Sections:`)
  for (const [section, count] of Object.entries(sectionCounts).sort()) {
    console.log(`    ${section.padEnd(28)} ${count}`)
  }
  if (warningCount === 0) {
    console.log('  Warnings: none')
  } else {
    console.log(
      `  Warnings: fatal=${warningsByKind.fatal.length} config=${warningsByKind.config.length} source=${warningsByKind.source.length} (full list: ${warningsLogPath})`
    )
    for (const category of ['fatal', 'config']) {
      for (const warning of warningsByKind[category]) {
        console.log(`    [${category}] ${warning}`)
      }
    }
    for (const warning of warningsByKind.source.slice(
      0,
      MAX_SOURCE_WARNINGS_SHOWN
    )) {
      console.log(`    [source] ${warning}`)
    }
    if (warningsByKind.source.length > MAX_SOURCE_WARNINGS_SHOWN) {
      console.log(
        `    [source] (… and ${warningsByKind.source.length - MAX_SOURCE_WARNINGS_SHOWN} more; see _warnings.json)`
      )
    }
  }

  // Fail loud on config and fatal. These signal a broken build, not source authoring.
  if (warningsByKind.fatal.length !== 0 || warningsByKind.config.length !== 0) {
    process.exit(1)
  }
}

try {
  main()
} catch (err) {
  console.error('[ai-docs] FATAL', err)
  process.exit(1)
}
