import { expect, test } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { checkApiCoverage } from './api-coverage.js'

function withFixture(run) {
  const root = mkdtempSync(join(tmpdir(), 'api-coverage-'))
  const apiDir = join(root, 'api')
  const pagesDir = join(root, 'pages')
  mkdirSync(apiDir)
  mkdirSync(pagesDir)
  try {
    run({ apiDir, pagesDir })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function writeApi(apiDir, name, json) {
  writeFileSync(join(apiDir, `${name}.json`), JSON.stringify(json))
}

test('warns for a non-empty API no page references', () => {
  withFixture(({ apiDir, pagesDir }) => {
    writeApi(apiDir, 'QLost', {
      meta: { docsUrl: 'https://v2.quasar.dev/vue-components/lost' },
      props: { color: { type: 'String' } }
    })
    writeFileSync(join(pagesDir, 'lost.md'), 'no api tag here')
    const warnings = checkApiCoverage({
      apiDir,
      srcPagesDir: pagesDir,
      includedPages: ['lost.md']
    })
    expect(warnings.length).toBe(1)
    expect(warnings[0]).toMatch(/QLost/)
    expect(warnings[0]).toMatch(/vue-components\/lost/)
  })
})

test('a sibling <DocApi> on the same docsUrl page counts as coverage', () => {
  withFixture(({ apiDir, pagesDir }) => {
    const docsUrl = 'https://v2.quasar.dev/vue-components/spinners'
    writeApi(apiDir, 'QSpinner', { meta: { docsUrl }, props: { size: {} } })
    writeApi(apiDir, 'QSpinnerBall', { meta: { docsUrl }, props: { size: {} } })
    writeFileSync(join(pagesDir, 'spinners.md'), '<DocApi file="QSpinner" />')
    const warnings = checkApiCoverage({
      apiDir,
      srcPagesDir: pagesDir,
      includedPages: ['spinners.md']
    })
    expect(warnings).toStrictEqual([])
  })
})

test('empty API files (only meta/type) never warn', () => {
  withFixture(({ apiDir, pagesDir }) => {
    writeApi(apiDir, 'QSpace', {
      meta: { docsUrl: 'https://v2.quasar.dev/vue-components/space' },
      type: 'component'
    })
    writeFileSync(join(pagesDir, 'space.md'), 'no api tag')
    const warnings = checkApiCoverage({
      apiDir,
      srcPagesDir: pagesDir,
      includedPages: ['space.md']
    })
    expect(warnings).toStrictEqual([])
  })
})
