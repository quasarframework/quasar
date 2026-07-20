import { execFileSync } from 'node:child_process'
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, extname, join, posix, resolve } from 'node:path'
import process from 'node:process'
import { URL } from 'node:url'

import { renderApiMarkdown } from './api-markdown.js'
import {
  assertWithin,
  createMarkdownChunks,
  extractDocApis,
  extractDocExamples,
  parseCliArgs,
  parseFrontMatter,
  readUtf8,
  resolveSourceRoot,
  sha256
} from './lib.js'

const projectRoot = resolve(import.meta.dirname, '..')
const args = parseCliArgs(process.argv.slice(2))
const outputRoot = assertWithin(
  projectRoot,
  resolve(projectRoot, args.get('output-root') ?? 'generated'),
  'Output root'
)
const sourceRoot = await resolveSourceRoot(
  args.get('source-root') ?? resolve(projectRoot, '..')
)
const pagesRoot = 'docs/src/pages'
const examplesRoot = 'docs/src/examples'
const apiRoot = 'ui/dist/api'
const consumedSources = {}
const generatedFiles = {}

function sourcePath(path) {
  return assertWithin(sourceRoot, resolve(sourceRoot, path), 'Source path')
}

async function readSource(path) {
  const content = await readUtf8(sourcePath(path))
  consumedSources[path] = sha256(content)
  return content
}

async function writeOutput(path, content) {
  const absolutePath = assertWithin(
    outputRoot,
    join(outputRoot, path),
    'Output path'
  )
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, content)
  generatedFiles[path] = sha256(content)
}

async function walk(relativeDirectory, extension) {
  const files = []

  async function visit(directory) {
    const entries = await readdir(sourcePath(directory), {
      withFileTypes: true
    })

    for (const entry of entries) {
      const path = posix.join(directory, entry.name)

      if (entry.isDirectory()) {
        await visit(path)
      } else if (extension === void 0 || extname(entry.name) === extension) {
        files.push(path)
      }
    }
  }

  await visit(relativeDirectory)
  return files.sort()
}

function pageRoute(path) {
  const parts = path
    .slice(`${pagesRoot}/`.length, -3)
    .split('/')
    .filter(part => !part.startsWith('__'))
  const routeParts = parts.at(-1) === parts.at(-2) ? parts.slice(0, -1) : parts

  return `/${routeParts.join('/')}`
}

function documentationArea(route) {
  const [section, subsection] = route.slice(1).split('/')

  if (
    (section === 'quasar-cli-vite' || section === 'quasar-cli-webpack') &&
    subsection?.startsWith('developing-')
  ) {
    return `${section}/${subsection.slice('developing-'.length)}`
  }

  return section
}

function artifactLink(documentId, target) {
  const documentPath = `documents/${documentId}.md`
  return posix.relative(posix.dirname(documentPath), target)
}

function renderDocumentationTree(node, depth = 0) {
  if (node === void 0 || typeof node !== 'object') {
    return '_Documentation tree data is unavailable._'
  }

  const label = node.url ? `[${node.l}](${node.url})` : node.l
  const line = `${'  '.repeat(depth)}- ${label}${node.e ? ` — ${node.e}` : ''}`
  return [
    line,
    ...(node.c ?? []).flatMap(child =>
      renderDocumentationTree(child, depth + 1)
    )
  ].join('\n')
}

function replaceDocumentationScaffolding(body, attributes) {
  return body
    .replaceAll(/<script doc>[\s\S]*?<\/script>/g, '')
    .replaceAll(/<DocTree\s+:def="scope\.([^"]+)"\s*\/>/g, (_, name) =>
      renderDocumentationTree(attributes.scope?.[name])
    )
    .replaceAll(/<DocInstall\b([^>]*)\/>/g, (_, source) => {
      const plugins =
        /plugins="([^"]+)"/.exec(source)?.[1] ??
        /:plugins="\[([^\]]+)\]"/.exec(source)?.[1]
      const config = /config="([^"]+)"/.exec(source)?.[1]
      const instructions = []

      if (plugins) {
        instructions.push(
          `register ${plugins.replaceAll(/[']/g, '')} through \`framework.plugins\` in \`quasar.config\``
        )
      }

      if (config) {
        instructions.push(
          `configure \`framework.config.${config}\` in \`quasar.config\``
        )
      }

      return instructions.length === 0
        ? '**Configuration:** See the associated Quasar configuration guide.'
        : `**Configuration:** ${instructions.join(' and ')}.`
    })
    .replaceAll(
      /<DocsHomepage\s*\/>/g,
      'Use the documentation index in this artifact to browse Quasar guides and APIs.'
    )
    .replaceAll(
      /<DocApiExplorer\s*\/>/g,
      'Use the structured API resources in this artifact to explore Quasar components, directives, and plugins.'
    )
}

function replaceDocumentationComponents(body, documentId, examples) {
  let processed = body.replaceAll(/<DocApi\b([^>]*)\/>/g, tag => {
    const api = extractDocApis(tag)[0]
    return api === void 0
      ? tag
      : `**API reference:** [${api}](${artifactLink(documentId, `api/${api}.md`)})`
  })

  const examplesByKey = new Map(
    examples.map(example => [`${example.title}\0${example.file}`, example])
  )

  processed = processed.replaceAll(/<DocExample\b[^>]*\/>/g, tag => {
    const reference = extractDocExamples(tag)[0]
    const example =
      reference === void 0
        ? void 0
        : examplesByKey.get(`${reference.title}\0${reference.file}`)

    if (example === void 0) return tag

    const link = artifactLink(
      documentId,
      `examples/${example.folder}/${example.file}.vue`
    )

    return [
      `**Example: ${example.title}**`,
      '',
      `Source: [${example.file}.vue](${link})`,
      '',
      '````vue',
      example.content.trimEnd(),
      '````'
    ].join('\n')
  })

  return processed
}

function buildProcessedMarkdown(document, body, examples) {
  const apiLinks = document.apiReferences.map(
    api => `- [${api}](${artifactLink(document.id, `api/${api}.md`)})`
  )
  const processed = replaceDocumentationComponents(body, document.id, examples)

  return [
    '---',
    `title: ${document.title}`,
    `description: ${document.description}`,
    `canonical: ${document.canonicalUrl}`,
    `kinds: ${document.kinds.join(', ')}`,
    'generated: true',
    '---',
    '',
    '> This file is generated from the official Quasar documentation, resolved API data, and source examples.',
    ...(apiLinks.length === 0
      ? []
      : ['', '## Structured API references', '', ...apiLinks]),
    '',
    processed.trim(),
    ''
  ].join('\n')
}

await rm(outputRoot, { recursive: true, force: true })
await mkdir(outputRoot, { recursive: true })
await writeOutput(
  '.oxlintrc.json',
  `${JSON.stringify({ ignorePatterns: ['**/*'] }, null, 2)}\n`
)

const allPageFiles = await walk(pagesRoot, '.md')
const pageFiles = allPageFiles.filter(
  path => !posix.basename(path).startsWith('__')
)
const pagesByRoute = new Map(pageFiles.map(path => [pageRoute(path), path]))
const pagePathsByApi = new Map()

for (const pagePath of pageFiles) {
  const pageSource = await readUtf8(sourcePath(pagePath))

  for (const apiName of extractDocApis(pageSource)) {
    pagePathsByApi.set(apiName, pagePath)
  }
}

const apiFiles = await walk(apiRoot, '.json')
const apiEntries = []
const apiNamesByRoute = new Map()

for (const apiPath of apiFiles) {
  const name = posix.basename(apiPath, '.json')
  const api = JSON.parse(await readSource(apiPath))
  const declaredCanonicalUrl = api.meta?.docsUrl?.replace(
    'https://v2.quasar.dev',
    'https://quasar.dev'
  )

  if (declaredCanonicalUrl === void 0) {
    throw new Error(`Public API has no canonical documentation URL: ${name}`)
  }

  const declaredRoute =
    new URL(declaredCanonicalUrl).pathname.replace(/\/$/, '') || '/'
  const pagePath = pagePathsByApi.get(name) ?? pagesByRoute.get(declaredRoute)

  if (pagePath === void 0) {
    throw new Error(`No documentation source page found for public API ${name}`)
  }

  const route = pageRoute(pagePath)
  const canonicalUrl = `https://quasar.dev${route}`
  const routeApis = apiNamesByRoute.get(route) ?? []
  routeApis.push(name)
  apiNamesByRoute.set(route, routeApis)
  apiEntries.push({ name, api, route, canonicalUrl })

  await writeOutput(`api/${name}.json`, `${JSON.stringify(api, null, 2)}\n`)
  await writeOutput(
    `api/${name}.md`,
    renderApiMarkdown(name, api, canonicalUrl)
  )
}

const targetRoutes = new Set(pageFiles.map(pageRoute))
const composableSourceFiles = await walk('ui/src/composables', '.js')
const composableSourcesByName = new Map(
  composableSourceFiles
    .filter(path => !posix.basename(path).startsWith('private.'))
    .map(path => [posix.basename(path, '.js'), path])
)
const documents = []
const allChunks = []
const allExamples = new Map()

for (const route of [...targetRoutes].sort()) {
  const pagePath = pagesByRoute.get(route)

  if (pagePath === void 0) {
    throw new Error(`No documentation source page found for ${route}`)
  }

  const pageSource = await readSource(pagePath)
  const { attributes, body } = parseFrontMatter(pageSource)
  const retrievalBody = replaceDocumentationScaffolding(body, attributes)
  const id = route.slice(1)
  const apiReferences = (apiNamesByRoute.get(route) ?? []).sort()
  const apiKinds = [
    ...new Set(
      apiReferences.map(
        name => apiEntries.find(entry => entry.name === name).api.type
      )
    )
  ]
  const isComposable = route.startsWith('/vue-composables/')
  const kinds = isComposable
    ? ['composable']
    : apiKinds.length === 0
      ? ['guide']
      : apiKinds.sort()
  const exampleFolder = attributes.examples
  const exampleReferences = extractDocExamples(body)
  const examples = []

  if (exampleReferences.length !== 0 && !exampleFolder) {
    throw new Error(
      `Page references examples without an examples folder: ${pagePath}`
    )
  }

  for (const reference of exampleReferences) {
    const examplePath = `${examplesRoot}/${exampleFolder}/${reference.file}.vue`
    const content = await readSource(examplePath)
    const example = {
      ...reference,
      folder: exampleFolder,
      source: examplePath,
      content
    }
    examples.push(example)
    allExamples.set(`${exampleFolder}/${reference.file}.vue`, example)
  }

  const document = {
    schemaVersion: 1,
    id,
    title: attributes.title,
    description:
      attributes.desc ??
      attributes.dese ??
      `Official Quasar documentation for ${attributes.title}.`,
    canonicalUrl: `https://quasar.dev${route}`,
    source: pagePath,
    sourceCommit: '',
    products: {},
    area: documentationArea(route),
    kinds,
    apiReferences,
    examples: examples.map(({ title, file, source }) => ({
      title,
      file: `${file}.vue`,
      source
    }))
  }

  const chunks = createMarkdownChunks(retrievalBody, document)
  documents.push({
    document,
    body: retrievalBody,
    examples,
    chunks,
    exampleFolder
  })
  allChunks.push(...chunks)
}

for (const [path, example] of allExamples) {
  await writeOutput(`examples/${path}`, example.content)
}

const uiPackage = JSON.parse(await readSource('ui/package.json'))
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: sourceRoot,
  encoding: 'utf8'
}).trim()
const sourceCommittedAt = execFileSync(
  'git',
  ['show', '-s', '--format=%cI', sourceCommit],
  { cwd: sourceRoot, encoding: 'utf8' }
).trim()
const composables = []

for (const composableDocument of documents.filter(candidate =>
  candidate.document.kinds.includes('composable')
)) {
  const composablePageSource = await readUtf8(
    sourcePath(composableDocument.document.source)
  )
  const key = parseFrontMatter(composablePageSource).attributes.keys
  const sourceName = key.replaceAll(
    /[A-Z]/g,
    letter => `-${letter.toLowerCase()}`
  )
  const sourcePathMatch = composableSourcesByName.get(sourceName)

  if (sourcePathMatch === void 0) {
    throw new Error(
      `No public implementation source found for composable ${key}`
    )
  }

  const content = await readSource(sourcePathMatch)
  const outputPath = `sources/composables/${posix.basename(sourcePathMatch)}`
  await writeOutput(outputPath, content)
  composables.push({
    name: key,
    documentId: composableDocument.document.id,
    source: outputPath
  })
}

for (const entry of documents) {
  entry.document.sourceCommit = sourceCommit
  entry.document.products = { quasar: uiPackage.version }

  await writeOutput(
    `documents/${entry.document.id}.json`,
    `${JSON.stringify(entry.document, null, 2)}\n`
  )
  await writeOutput(
    `documents/${entry.document.id}.md`,
    buildProcessedMarkdown(entry.document, entry.body, entry.examples)
  )
  await writeOutput(
    `chunks/${entry.document.id}.json`,
    `${JSON.stringify(entry.chunks, null, 2)}\n`
  )
}

const searchRecords = [
  ...allChunks.map(chunk => ({
    type: 'documentation',
    id: chunk.id,
    title: `${chunk.breadcrumb[0]}: ${chunk.heading}`,
    canonicalUrl: chunk.canonicalUrl,
    text: chunk.content,
    apiReferences: chunk.apiReferences,
    exampleReferences: chunk.exampleReferences
  })),
  ...apiEntries.flatMap(({ name, api, canonicalUrl }) =>
    ['props', 'slots', 'events', 'methods', 'computedProps'].flatMap(group =>
      Object.entries(api[group] ?? {}).map(([entryName, item]) => ({
        type: 'api',
        id: `${name}.${group}.${entryName}`,
        title: `${name} ${group}: ${entryName}`,
        canonicalUrl,
        text: [item.desc, item.type, ...(item.examples ?? [])]
          .flat()
          .filter(value => value !== void 0)
          .join(' ')
      }))
    )
  ),
  ...[...allExamples.values()].map(example => ({
    type: 'example',
    id: `${example.folder}.example.${example.file}`,
    title: `${example.folder} example: ${example.title}`,
    source: example.source,
    text: example.content
  }))
]

await writeOutput(
  'search-index.jsonl',
  `${searchRecords.map(record => JSON.stringify(record)).join('\n')}\n`
)

const apiCounts = Object.groupBy(apiEntries, entry => entry.api.type)
const manifestDocuments = documents.map(({ document, exampleFolder }) => ({
  id: document.id,
  title: document.title,
  kinds: document.kinds,
  area: document.area,
  path: `documents/${document.id}.json`,
  markdown: `documents/${document.id}.md`,
  chunks: `chunks/${document.id}.json`,
  api: document.apiReferences.flatMap(name => [
    `api/${name}.json`,
    `api/${name}.md`
  ]),
  examples: document.examples.map(
    example => `examples/${exampleFolder}/${example.file}`
  )
}))
const manifest = {
  schemaVersion: 1,
  artifact: '@quasar/mcp',
  source: {
    repository: 'https://github.com/quasarframework/quasar',
    commit: sourceCommit,
    committedAt: sourceCommittedAt
  },
  products: { quasar: uiPackage.version },
  coverage: {
    documents: documents.length,
    components: apiCounts.component?.length ?? 0,
    directives: apiCounts.directive?.length ?? 0,
    plugins: apiCounts.plugin?.length ?? 0,
    composables: composables.length,
    guides: documents.filter(entry => entry.document.kinds.includes('guide'))
      .length,
    areas: Object.fromEntries(
      Object.entries(
        Object.groupBy(documents, entry => entry.document.area)
      ).map(([area, entries]) => [area, entries.length])
    ),
    APIs: apiEntries.length,
    examples: allExamples.size,
    chunks: allChunks.length,
    searchRecords: searchRecords.length
  },
  documents: manifestDocuments,
  composables,
  searchIndex: 'search-index.jsonl',
  llmsIndex: 'llms.txt'
}

await writeOutput('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`)
await writeOutput(
  'llms.txt',
  [
    '# Quasar documentation artifact',
    '',
    `Source commit: ${sourceCommit}`,
    `Quasar version: ${uiPackage.version}`,
    '',
    '## Coverage',
    '',
    `- ${manifest.coverage.components} component APIs`,
    `- ${manifest.coverage.directives} directive APIs`,
    `- ${manifest.coverage.plugins} plugin APIs`,
    `- ${manifest.coverage.composables} public composables`,
    `- ${manifest.coverage.guides} additional public guides`,
    `- ${manifest.coverage.documents} documentation pages`,
    '',
    '## Documentation',
    '',
    ...manifestDocuments.map(
      document => `- [${document.title}](${document.markdown})`
    ),
    ''
  ].join('\n')
)

const integrity = { algorithm: 'sha256', consumedSources, generatedFiles }
await writeFile(
  assertWithin(outputRoot, join(outputRoot, 'integrity.json'), 'Output path'),
  `${JSON.stringify(integrity, null, 2)}\n`
)

process.stdout.write(
  `Generated ${documents.length} documents, ${apiEntries.length} APIs, ${composables.length} composables, ${allChunks.length} chunks, ${allExamples.size} examples, and ${searchRecords.length} search records from ${Object.keys(consumedSources).length} immutable source files.\n`
)
