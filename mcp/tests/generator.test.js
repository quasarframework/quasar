import assert from 'node:assert/strict'
import test from 'node:test'

import {
  assertWithin,
  createMarkdownChunks,
  extractDocApis,
  extractDocExamples,
  parseFrontMatter
} from '../scripts/lib.js'
import { validateSchema } from '../scripts/schema-validator.js'

test('extracts API and example references from documentation markup', () => {
  const markdown = [
    '<DocApi file="QInput" title="Input API" />',
    '<DocExample title="Native form" file="NativeForm" scrollable no-edit />'
  ].join('\n')

  assert.deepEqual(extractDocApis(markdown), ['QInput'])
  assert.deepEqual(extractDocExamples(markdown), [
    { title: 'Native form', file: 'NativeForm' }
  ])
})

test('parses simple Quasar documentation front matter', () => {
  const parsed = parseFrontMatter(
    '---\ntitle: Input\ndesc: Capture input\n---\nBody'
  )

  assert.deepEqual(parsed.attributes, {
    title: 'Input',
    desc: 'Capture input'
  })
  assert.equal(parsed.body, 'Body')
})

test('rejects writes outside the requested output root', () => {
  assert.throws(() => assertWithin('/tmp/output', '/tmp/source/file.md'))
})

test('creates retrieval chunks with canonical anchors and references', () => {
  const chunks = createMarkdownChunks(
    [
      'Overview',
      '## Validation',
      '<DocApi file="QInput" />',
      '<DocExample title="Basic" file="ValidationRequired" />'
    ].join('\n'),
    {
      id: 'vue-components/input',
      title: 'Input',
      canonicalUrl: 'https://quasar.dev/vue-components/input'
    }
  )

  assert.equal(chunks.length, 2)
  assert.equal(
    chunks[1].canonicalUrl,
    'https://quasar.dev/vue-components/input#validation'
  )
  assert.deepEqual(chunks[1].apiReferences, ['QInput'])
  assert.equal(chunks[1].exampleReferences[0].file, 'ValidationRequired.vue')
})

test('reports JSON schema contract violations', () => {
  const errors = validateSchema(
    { schemaVersion: 2, extra: true },
    {
      type: 'object',
      required: ['schemaVersion', 'title'],
      properties: { schemaVersion: { const: 1 } },
      additionalProperties: false
    }
  )

  assert.equal(errors.length, 3)
})
