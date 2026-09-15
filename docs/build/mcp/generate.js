/**
 * Docs generator. Converts `docs/src/pages/**\/*.md` into standalone,
 * LLM-friendly markdown.
 *
 * Site form (no target): every menu page written next to the SSG
 * output of quasar.dev (`dist/quasar.dev`, a `.md` sibling per page)
 * plus `llms.txt` and the `mcp.json` provenance; the docs build runs it
 * from its afterBuild hook (quasar.config.js).
 *
 * Package slice (`ui` or `app-vite`): only that package's pages (see
 * targets.js) into `<package>/dist/mcp`, plus `meta.json`, published
 * with the package for the @quasar/mcp server to serve offline. Each
 * package's `generate:mcp` script runs this as the last step of its
 * `prepublishOnly`.
 *
 * index.js is the CLI over this module (`pnpm generate:mcp [--target]`).
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { fileURLToPath } from 'node:url'
import { basename, join, resolve } from 'node:path'
import { execSync } from 'node:child_process'
import { performance } from 'node:perf_hooks'
import { globSync } from 'tinyglobby'
import matter from 'gray-matter'

import { createAiMd } from './markdown/md.js'
import { clearEmitters, createCtx, emitTokens } from './markdown/walker.js'
import { registerProseEmitters } from './markdown/prose.js'
import { registerContainerEmitters } from './markdown/containers.js'
import { registerTabsEmitter } from './markdown/tabs.js'
import {
  clearTagHandlers,
  registerHtmlDispatchers,
  registerTagHandler
} from './markdown/html-dispatcher.js'
import { stripScriptDoc } from './markdown/script-doc-stripper.js'
import { applyLlmContentControl } from './markdown/llm-content-control.js'
import { docApiHandler } from './markdown/tags/doc-api.js'
import { docExampleHandler } from './markdown/tags/doc-example.js'
import { docTreeHandler } from './markdown/tags/doc-tree.js'
import { docInstallationHandler } from './markdown/tags/doc-installation.js'
import { docLinkHandler } from './markdown/tags/doc-link.js'

import { processFrontmatter } from './pages/frontmatter.js'
import { sourceToMenuKey, sourceToOutputPath } from './pages/routes.js'
import { selectPages } from './pages/select.js'
import {
  buildMenuMaps,
  buildMenuPaths,
  buildSectionIndex,
  loadFrontmatters
} from './pages/menu.js'
import { checkApiCoverage } from './api/coverage.js'
import { writePage } from './output/page.js'
import { buildLlmsTxt } from './output/llms-txt.js'
import { buildMeta } from './output/meta.js'
import { countTokens } from './output/tokens.js'
import { TARGETS, targetIncludes } from './targets.js'

const REPO_ROOT = resolve(import.meta.dirname, '../../..')
const SRC_PAGES = join(REPO_ROOT, 'docs/src/pages')
const API_DIR = fileURLToPath(import.meta.resolve('quasar/dist/api'))
const EXAMPLES_DIR = join(REPO_ROOT, 'docs/src/examples')
const SITE_DIST_DIR = join(REPO_ROOT, 'docs/dist/quasar.dev')
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
 * @typedef {object} Run
 * @property {string} label Log prefix, `mcp` or `mcp:<target>`.
 * @property {string} distDir Output root.
 * @property {(typeof TARGETS)[keyof typeof TARGETS] | null} target Null for the site form.
 */

/**
 * @param {{ target?: string | null, distDir?: string }} opts
 * @returns {Run}
 */
function resolveRun({ target: targetName = null, distDir } = {}) {
  if (targetName === null) {
    return { label: 'mcp', distDir: distDir ?? SITE_DIST_DIR, target: null }
  }
  const target = TARGETS[targetName]
  if (target === void 0) {
    throw new Error(
      `Unknown target "${targetName}"; expected one of: ${Object.keys(TARGETS).join(', ')}`
    )
  }
  return {
    label: `mcp:${targetName}`,
    distDir: distDir ?? join(REPO_ROOT, target.packageDir, 'dist/mcp'),
    target
  }
}

/**
 * Wire the walker and dispatcher with every emitter the pipeline needs.
 * Clears prior registrations first so repeated calls (e.g. across tests)
 * never leave stale handlers. registerTabsEmitter() must come after
 * registerProseEmitters() because it overrides the fence emitter.
 *
 * @param {{ apiDir: string, examplesDir: string, referenceApi: boolean }} opts
 * @returns {void}
 */
function registerAllEmitters({ apiDir, examplesDir, referenceApi }) {
  clearEmitters()
  clearTagHandlers()
  registerProseEmitters()
  registerContainerEmitters()
  registerTabsEmitter()
  registerHtmlDispatchers()

  registerTagHandler(
    'DocApi',
    docApiHandler({ apiDir, referenceOnly: referenceApi })
  )
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
  const { frontmatter: outputFrontmatter, warnings: frontmatterWarnings } =
    processFrontmatter(data, menuByKey, relativePath)
  ctx.warnings.push(...frontmatterWarnings)
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
 * Version of a workspace package.
 *
 * @param {string} packageDir Path relative to the repo root, e.g. `ui`.
 * @returns {string}
 */
function packageVersion(packageDir) {
  return JSON.parse(
    readFileSync(join(REPO_ROOT, packageDir, 'package.json'), 'utf8')
  ).version
}

/**
 * Git commit the artifact was generated from. Null outside a git
 * checkout (e.g. a source tarball).
 *
 * @returns {string | null}
 */
function sourceCommit() {
  try {
    return execSync('git rev-parse HEAD', { cwd: REPO_ROOT }).toString().trim()
  } catch {
    return null
  }
}

/**
 * Write llms.txt (per llmstxt.org) indexing every generated page.
 *
 * @param {string} distDir
 * @param {string[]} writtenPaths Relative source paths of pages actually written.
 * @param {Map<string, { title: string | null, desc: string | null }>} menuByKey
 * @param {string} quasarVersion
 * @returns {void}
 */
function writeLlmsTxt(distDir, writtenPaths, menuByKey, quasarVersion) {
  const pages = writtenPaths.map(relativePath => {
    const key = sourceToMenuKey(relativePath)
    const entry = menuByKey.get(key)
    return { key, title: entry?.title ?? key, desc: entry?.desc ?? null }
  })
  writeFileSync(
    join(distDir, 'llms.txt'),
    buildLlmsTxt({
      pages,
      sectionIndex: buildSectionIndex(),
      quasarVersion,
      baseUrl: SITE_URL
    })
  )
}

/**
 * Site sidecar: the provenance JSON (`mcp.json`, no page route starts
 * with the name).
 *
 * @param {string} distDir
 * @param {number} pages
 * @param {string} quasarVersion
 * @returns {void}
 */
function writeSiteMeta(distDir, pages, quasarVersion) {
  writeFileSync(
    join(distDir, 'mcp.json'),
    JSON.stringify(
      { quasarVersion, sourceCommit: sourceCommit(), pages },
      null,
      2
    )
  )
}

/**
 * Slice sidecar: `meta.json`, the page index the MCP server reads.
 *
 * @param {Run} run
 * @param {string[]} writtenPaths Relative source paths of pages actually written.
 * @param {Map<string, { title: string | null, desc: string | null }>} menuByKey
 * @returns {void}
 */
function writeSliceMeta(run, writtenPaths, menuByKey) {
  const pages = writtenPaths.map(relativePath => {
    const route = sourceToMenuKey(relativePath)
    const entry = menuByKey.get(route)
    return { route, title: entry?.title ?? route, desc: entry?.desc ?? null }
  })
  writeFileSync(
    join(run.distDir, 'meta.json'),
    buildMeta({
      packageName: run.target.packageName,
      version: packageVersion(run.target.packageDir),
      pages
    })
  )
}

/**
 * Run the pipeline once. Prints a summary and throws on any warning,
 * a failed page, a broken build input or a docs authoring issue alike,
 * so the caller fails loudly and the output never carries a known
 * defect: this runs from the docs build and from the ui and app-vite
 * prepublishOnly.
 *
 * @param {{ target?: string | null, distDir?: string }} [opts] `target` is `ui` or `app-vite`, null for the site form; `distDir` overrides the output root.
 * @returns {{ distDir: string, pages: number }}
 */
export function generate(opts) {
  const run = resolveRun(opts)
  checkPrerequisites()
  const startTime = performance.now()
  const md = createAiMd()
  registerAllEmitters({
    apiDir: API_DIR,
    examplesDir: EXAMPLES_DIR,
    referenceApi: run.target !== null
  })

  const globbed = globSync(GLOB, { cwd: SRC_PAGES, ignore: IGNORES })
  const menuByKey = buildMenuMaps(SRC_PAGES)
  if (menuByKey.size === 0) {
    throw new Error(
      'flat-menu.js returned no entries; something is wrong with the menu import'
    )
  }
  const {
    included: menuPages,
    orphans,
    missing
  } = selectPages(globbed, menuByKey)
  // Menu entries whose source exists but sits in IGNORES are deliberately
  // skipped (interactive/marketing pages), not missing. Only report menu
  // entries with no source file at all.
  const allSourceKeys = new Set(
    globSync(GLOB, { cwd: SRC_PAGES }).map(sourceToMenuKey)
  )
  const trulyMissing = missing.filter(key => !allSourceKeys.has(key))
  // Titles are loaded for every menu page, not just the slice, so
  // `related` entries and links pointing outside the slice keep their
  // real titles.
  loadFrontmatters(menuPages, menuByKey, SRC_PAGES)
  const menuPaths = buildMenuPaths(menuByKey)

  const included =
    run.target === null
      ? menuPages
      : menuPages.filter(relativePath =>
          targetIncludes(run.target, sourceToMenuKey(relativePath))
        )

  // A slice owns its folder; the site output is shared with the SSG
  // build, whose pages the .md siblings are written next to.
  if (run.target !== null) {
    rmSync(run.distDir, { recursive: true, force: true })
  }
  mkdirSync(run.distDir, { recursive: true })

  const warnings = []
  const writtenPaths = []
  let totalBytes = 0
  const sectionCounts = {}

  for (const relativePath of included) {
    try {
      const {
        outputFrontmatter,
        body,
        warnings: pageWarnings
      } = extractOne({
        relativePath,
        md,
        menuByKey,
        menuPaths
      })
      warnings.push(...pageWarnings)
      const outputPath = sourceToOutputPath(relativePath)
      writePage({
        distDir: run.distDir,
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
      warnings.push(`FATAL processing ${relativePath}: ${err.message}`)
    }
  }

  if (writtenPaths.length === 0) {
    throw new Error(
      'Extracted 0 pages. Likely menu/glob mismatch or all pages failed.'
    )
  }

  if (run.target === null) {
    // API coverage is a whole-site property: a slice legitimately leaves
    // out the pages documenting the other package's APIs.
    warnings.push(
      ...checkApiCoverage({
        apiDir: API_DIR,
        srcPagesDir: SRC_PAGES,
        includedPages: included
      })
    )
    const quasarVersion = packageVersion('ui')
    writeSiteMeta(run.distDir, writtenPaths.length, quasarVersion)
    writeLlmsTxt(run.distDir, writtenPaths, menuByKey, quasarVersion)
  } else {
    writeSliceMeta(run, writtenPaths, menuByKey)
  }

  const seconds = ((performance.now() - startTime) / 1000).toFixed(1)

  console.log(
    `\n[${run.label}] Generated ${writtenPaths.length} pages in ${seconds}s into ${run.distDir}`
  )
  console.log(`  Source pages found:        ${globbed.length}`)
  console.log(
    `  Filtered by menu:          ${menuPages.length} included, ${orphans.length} orphans`
  )
  if (run.target !== null) {
    console.log(
      `  Filtered by target:        ${included.length} included, ${menuPages.length - included.length} left to the site`
    )
  }
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
    const outputFilePath = join(run.distDir, sourceToOutputPath(relativePath))
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
  if (warnings.length === 0) {
    console.log('  Warnings: none')
  } else {
    console.log(`  Warnings: ${warnings.length}`)
    for (const warning of warnings) {
      console.log(`    - ${warning}`)
    }
  }
  console.log()

  if (warnings.length !== 0) {
    throw new Error(
      `[${run.label}] ${warnings.length} warning(s), listed above; the output must be free of them`
    )
  }

  return { distDir: run.distDir, pages: writtenPaths.length }
}
