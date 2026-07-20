import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

import { searchRecords } from '../src/artifact/search.js'
import { ArtifactStore } from '../src/artifact/store.js'

const projectRoot = resolve(import.meta.dirname, '..')
const cases = JSON.parse(
  await readFile(resolve(projectRoot, 'eval/search-cases.json'), 'utf8')
)
const store = new ArtifactStore()
const failures = []
let reciprocalRank = 0

function matches(record, expected) {
  const target = expected.toLowerCase()
  return [record.id, record.title, ...(record.apiReferences ?? [])].some(
    value => String(value).toLowerCase().includes(target)
  )
}

for (const entry of cases) {
  const results = searchRecords(store.searchRecords, entry.query, { limit: 10 })
  const index = results.findIndex(({ record }) =>
    matches(record, entry.expected)
  )
  const rank = index === -1 ? Infinity : index + 1

  if (Number.isFinite(rank)) reciprocalRank += 1 / rank

  if (rank > entry.maxRank) {
    failures.push({
      query: entry.query,
      expected: entry.expected,
      maxRank: entry.maxRank,
      actualRank: Number.isFinite(rank) ? rank : null,
      topResults: results.slice(0, 5).map(({ record }) => record.title)
    })
  }
}

const summary = {
  cases: cases.length,
  passed: cases.length - failures.length,
  failed: failures.length,
  meanReciprocalRank: Number((reciprocalRank / cases.length).toFixed(3))
}

process.stdout.write(`${JSON.stringify({ summary, failures }, null, 2)}\n`)

if (failures.length !== 0) process.exitCode = 1
