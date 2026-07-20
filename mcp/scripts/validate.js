import { join, resolve } from 'node:path'
import process from 'node:process'

import {
  assertWithin,
  parseCliArgs,
  readUtf8,
  resolveSourceRoot,
  sha256
} from './lib.js'
import { validateSchema } from './schema-validator.js'

const projectRoot = resolve(import.meta.dirname, '..')
const outputRoot = assertWithin(projectRoot, join(projectRoot, 'generated'))
const args = parseCliArgs(process.argv.slice(2))
const sourceRoot = await resolveSourceRoot(
  args.get('source-root') ?? resolve(projectRoot, '..')
)

function readOutput(path) {
  return readUtf8(assertWithin(outputRoot, join(outputRoot, path)))
}

async function readJson(path) {
  return JSON.parse(await readOutput(path))
}

const manifest = await readJson('manifest.json')
const integrity = await readJson('integrity.json')
const documentSchema = JSON.parse(
  await readUtf8(join(projectRoot, 'schemas/document.schema.json'))
)
const expectedCoverage = {
  components: 123,
  directives: 11,
  plugins: 18,
  composables: 11,
  APIs: 152
}

for (const [name, count] of Object.entries(expectedCoverage)) {
  if (manifest.coverage[name] !== count) {
    throw new Error(
      `Expected ${count} ${name}, found ${manifest.coverage[name]}`
    )
  }
}

if (manifest.documents.length !== manifest.coverage.documents) {
  throw new Error('Document manifest and coverage counts differ')
}

const apiReferences = new Set()
let chunkCount = 0
let exampleReferenceCount = 0

for (const entry of manifest.documents) {
  const document = await readJson(entry.path)
  const chunks = await readJson(entry.chunks)
  const processedMarkdown = await readOutput(entry.markdown)
  const schemaErrors = validateSchema(document, documentSchema)

  if (schemaErrors.length !== 0) {
    throw new Error(
      `${document.id} schema validation failed:\n${schemaErrors.join('\n')}`
    )
  }

  if (document.sourceCommit !== manifest.source.commit) {
    throw new Error(`${document.id} and manifest source commits differ`)
  }

  if (chunks.length === 0 || chunks.some(chunk => chunk.content.length === 0)) {
    throw new Error(`${document.id} has missing or empty retrieval chunks`)
  }

  if (
    /<DocApi(?:\s|\/|>)/.test(processedMarkdown) ||
    /<DocExample(?:\s|\/|>)/.test(processedMarkdown) ||
    processedMarkdown.includes('<DocTree') ||
    processedMarkdown.includes('<DocInstall')
  ) {
    throw new Error(
      `${document.id} contains unresolved API or example components`
    )
  }

  for (const apiName of document.apiReferences) {
    if (apiReferences.has(apiName)) {
      throw new Error(`Public API is attached to multiple pages: ${apiName}`)
    }

    apiReferences.add(apiName)
    const api = await readJson(`api/${apiName}.json`)
    const apiMarkdown = await readOutput(`api/${apiName}.md`)

    if (!['component', 'directive', 'plugin'].includes(api.type)) {
      throw new Error(`Unknown public API type for ${apiName}: ${api.type}`)
    }

    if (!apiMarkdown.startsWith(`# ${apiName} API`)) {
      throw new Error(`Rendered API Markdown is incomplete: ${apiName}`)
    }
  }

  for (const path of entry.examples) {
    await readOutput(path)
  }

  chunkCount += chunks.length
  exampleReferenceCount += entry.examples.length
}

if (apiReferences.size !== manifest.coverage.APIs) {
  throw new Error('Not every public API is attached to a documentation page')
}

if (chunkCount !== manifest.coverage.chunks) {
  throw new Error('Chunk manifest and coverage counts differ')
}

if (exampleReferenceCount < manifest.coverage.examples) {
  throw new Error('Unique example count exceeds all page references')
}

for (const composable of manifest.composables) {
  if (!composable.name.startsWith('use')) {
    throw new Error(`Unexpected public composable name: ${composable.name}`)
  }

  await readOutput(composable.source)
}

const searchIndex = await readOutput(manifest.searchIndex)
const searchRecords = searchIndex
  .trim()
  .split('\n')
  .map(line => JSON.parse(line))

if (
  searchRecords.length !== manifest.coverage.searchRecords ||
  searchRecords.some(record => !record.id || !record.type || !record.text)
) {
  throw new Error('Search index is incomplete')
}

const llmsIndex = await readOutput(manifest.llmsIndex)

if (
  !llmsIndex.includes(`${manifest.coverage.components} component APIs`) ||
  !llmsIndex.includes(`${manifest.coverage.composables} public composables`)
) {
  throw new Error('llms.txt does not describe the complete artifact coverage')
}

for (const [path, expectedHash] of Object.entries(integrity.consumedSources)) {
  const content = await readUtf8(
    assertWithin(sourceRoot, join(sourceRoot, path))
  )

  if (sha256(content) !== expectedHash) {
    throw new Error(`Consumed source changed during generation: ${path}`)
  }
}

for (const [path, expectedHash] of Object.entries(integrity.generatedFiles)) {
  const content = await readOutput(path)

  if (sha256(content) !== expectedHash) {
    throw new Error(`Generated artifact integrity check failed: ${path}`)
  }
}

process.stdout.write(
  `Validated ${manifest.coverage.documents} documents, ${manifest.coverage.APIs} APIs, ${manifest.coverage.composables} composables, ${manifest.coverage.chunks} chunks, ${manifest.coverage.examples} examples, ${manifest.coverage.searchRecords} search records, schemas, and immutable source hashes.\n`
)
