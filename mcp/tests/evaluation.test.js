import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import process from 'node:process'
import test from 'node:test'

test('passes the checked-in natural-language retrieval benchmark', () => {
  const output = execFileSync(
    process.execPath,
    [resolve(import.meta.dirname, '../scripts/evaluate.js')],
    { encoding: 'utf8' }
  )
  const report = JSON.parse(output)

  assert.equal(report.summary.failed, 0)
  assert.equal(report.summary.passed, report.summary.cases)
  assert.ok(report.summary.meanReciprocalRank >= 0.7)
})
