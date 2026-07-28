import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { after, test } from 'node:test'

const cliPath = fileURLToPath(new URL('../bin/icongenie.js', import.meta.url))
const testFolder = mkdtempSync(join(tmpdir(), 'icongenie-no-color-'))

writeFileSync(join(testFolder, 'quasar.config.js'), 'export default {}')

after(() => {
  rmSync(testFolder, { recursive: true, force: true })
})

function run(command, args) {
  const result = spawnSync(
    process.execPath,
    [cliPath, command, '--no-color', ...args],
    {
      cwd: testFolder,
      encoding: 'utf8',
      env: {
        ...process.env,
        NO_UPDATE_NOTIFIER: '1'
      }
    }
  )

  assert.equal(
    result.status,
    0,
    [result.stdout, result.stderr].filter(Boolean).join('\n')
  )
  assert.equal(result.stdout.includes('\u001B['), false)
}

test('generate accepts --no-color without adding it to profile params', () => {
  run('generate', ['--mode', 'spa', '--filter', 'png'])
})

test('verify accepts --no-color without adding it to profile params', () => {
  run('verify', ['--mode', 'spa'])
})

test('profile accepts --no-color without writing it to the profile', () => {
  run('profile', ['--output', 'test', '--assets', 'spa'])

  const profile = JSON.parse(
    readFileSync(join(testFolder, 'icongenie-test.json'), 'utf8')
  )

  assert.equal('noColor' in profile.params, false)
})
