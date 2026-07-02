import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { globSync } from 'tinyglobby'

const docsDir = resolve(import.meta.dirname, '..')
const pagesDir = resolve(docsDir, 'src/pages')
const examplesDir = resolve(docsDir, 'src/examples')

const pageFiles = globSync('**/*.md', {
  cwd: pagesDir,
  absolute: true
})

const exampleFiles = globSync('**/*.vue', {
  cwd: examplesDir,
  absolute: true
})

const exampleDirs = new Set(
  globSync('*', {
    cwd: examplesDir,
    onlyDirectories: true
  }).map(dir => dir.replace(/\/$/, ''))
)

const errors = []
const warnings = []

const frontMatterRE = /^---\n([\s\S]*?)\n---/
const docExampleRE = /<DocExample\b[^>]*\/?>/g
const fileAttrRE = /\bfile=(["'])([^"']+)\1/
const dynamicFileAttrRE = /\b:file=|\bv-bind:file=/
const examplesFieldRE = /^examples:\s*([^\s#]+)\s*$/m
const staticImportRE =
  /\bimport\s+(?:[\s\S]*?\s+from\s+)?(['"])([^'"]+)\1|import\s*\(\s*(['"])([^'"]+)\3\s*\)/g
const extensionList = [
  '',
  '.js',
  '.mjs',
  '.ts',
  '.vue',
  '.json',
  '.sass',
  '.scss',
  '.css'
]

function toDisplayPath(path) {
  return path.slice(docsDir.length + 1)
}

function addError(file, message) {
  errors.push(`${toDisplayPath(file)}: ${message}`)
}

function addWarning(file, message) {
  warnings.push(`${toDisplayPath(file)}: ${message}`)
}

function getFrontMatter(content) {
  return frontMatterRE.exec(content)?.[1] ?? ''
}

function getExamplesBucket(content) {
  return examplesFieldRE.exec(getFrontMatter(content))?.[1] ?? null
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length
}

function resolveImport(importer, rawPath) {
  const importPath = rawPath.split('?')[0]
  const basePath = resolve(dirname(importer), importPath)

  for (const extension of extensionList) {
    const candidate = basePath + extension
    if (existsSync(candidate)) return candidate
  }

  for (const extension of extensionList.slice(1)) {
    const candidate = resolve(basePath, 'index' + extension)
    if (existsSync(candidate)) return candidate
  }

  return null
}

for (const pageFile of pageFiles) {
  const content = await readFile(pageFile, 'utf8')
  const examplesBucket = getExamplesBucket(content)
  const matches = [...content.matchAll(docExampleRE)]

  if (examplesBucket !== null && !exampleDirs.has(examplesBucket)) {
    addError(
      pageFile,
      `frontmatter examples bucket "${examplesBucket}" does not exist`
    )
  }

  if (matches.length === 0) {
    continue
  }

  if (examplesBucket === null) {
    addError(
      pageFile,
      'uses <DocExample> without an examples frontmatter field'
    )
    continue
  }

  for (const match of matches) {
    const tag = match[0]
    const line = getLineNumber(content, match.index)

    if (dynamicFileAttrRE.test(tag)) {
      addWarning(
        pageFile,
        `line ${line}: dynamic DocExample file binding was not checked`
      )
      continue
    }

    const fileName = fileAttrRE.exec(tag)?.[2]

    if (typeof fileName !== 'string') {
      addError(
        pageFile,
        `line ${line}: <DocExample> is missing a static file attribute`
      )
      continue
    }

    const exampleFile = resolve(examplesDir, examplesBucket, `${fileName}.vue`)

    if (!existsSync(exampleFile)) {
      addError(
        pageFile,
        `line ${line}: DocExample file "${fileName}" does not exist in src/examples/${examplesBucket}`
      )
    }
  }
}

for (const exampleFile of exampleFiles) {
  const content = await readFile(exampleFile, 'utf8')

  for (const match of content.matchAll(staticImportRE)) {
    const rawPath = match[2] ?? match[4]

    // Package and alias imports are resolved by Vite; this audit only checks
    // relative links that can quietly rot when examples move around.
    if (!rawPath.startsWith('.')) continue

    if (resolveImport(exampleFile, rawPath) === null) {
      addError(
        exampleFile,
        `line ${getLineNumber(content, match.index)}: relative import "${rawPath}" does not resolve`
      )
    }
  }
}

if (warnings.length !== 0) {
  console.warn(`Docs examples audit warnings (${warnings.length}):`)
  for (const warning of warnings) {
    console.warn(`  - ${warning}`)
  }
}

if (errors.length !== 0) {
  console.error(`Docs examples audit failed (${errors.length}):`)
  for (const error of errors) {
    console.error(`  - ${error}`)
  }
  process.exit(1)
}

console.log(
  `Docs examples audit passed (${pageFiles.length} pages, ${exampleDirs.size} example groups).`
)
