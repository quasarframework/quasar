import assert from 'node:assert/strict'
import test from 'node:test'

import { ArtifactStore } from '../src/artifact/store.js'
import {
  getQuasarApi,
  getQuasarComposable,
  getQuasarDoc,
  getQuasarExamples,
  searchQuasarDocs
} from '../src/tools/retrieval.js'

const store = new ArtifactStore()

function payload(result) {
  assert.equal(result.isError, void 0)
  return JSON.parse(result.content[0].text)
}

test('search ranks exact and fuzzy Quasar API terms', () => {
  const exact = payload(
    searchQuasarDocs(store, {
      query: 'QInput rules',
      kinds: ['component'],
      limit: 5,
      maxCharacters: 12_000
    })
  )
  const fuzzy = payload(
    searchQuasarDocs(store, {
      query: 'QInpt validation',
      limit: 5,
      maxCharacters: 12_000
    })
  )

  assert.ok(exact.results.some(result => result.id.includes('QInput')))
  assert.ok(fuzzy.results.some(result => result.title.includes('Input')))
})

test('retrieves exact API members without returning the complete API', () => {
  const result = payload(
    getQuasarApi(store, {
      name: 'qinput',
      member: 'rules',
      maxCharacters: 12_000
    })
  )

  assert.equal(result.name, 'QInput')
  assert.equal(result.memberType, 'props')
  assert.equal(result.member, 'rules')
  assert.equal(result.definition.type, 'Array')
})

test('retrieves a documentation section by a useful partial heading', () => {
  const result = payload(
    getQuasarDoc(store, {
      id: 'QInput',
      section: 'async rules',
      maxCharacters: 12_000
    })
  )

  assert.equal(result.chunk.heading, 'Async rules')
  assert.match(result.chunk.canonicalUrl, /#async-rules$/)
})

test('retrieves and limits official examples', () => {
  const result = payload(
    getQuasarExamples(store, {
      name: 'QInput',
      query: 'native form',
      limit: 1,
      maxCharacters: 12_000
    })
  )

  assert.equal(result.resultCount, 1)
  assert.equal(result.examples[0].file, 'NativeForm.vue')
})

test('retrieves public composable docs and optional source', () => {
  const result = payload(
    getQuasarComposable(store, {
      name: 'useHydration',
      includeSource: true,
      maxCharacters: 30_000
    })
  )

  assert.equal(result.name, 'useHydration')
  assert.match(result.implementationSource, /export default/)
})

test('enforces response limits using a valid truncation envelope', () => {
  const result = payload(
    getQuasarApi(store, { name: 'QTable', maxCharacters: 1000 })
  )

  assert.equal(result.truncated, true)
  assert.ok(result.totalCharacters > result.returnedCharacters)
})
