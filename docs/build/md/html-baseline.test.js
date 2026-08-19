import { expect, test } from 'vitest'
import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseFrontMatter } from './md-parse-utils.js'
import { renderPage } from './test-helpers.js'

const __dirname = import.meta.dirname
const fixturesDir = join(__dirname, 'fixtures')
const snapshotsDir = join(__dirname, 'snapshots')

// The fixtures are NOT site content: they exist only to exercise every md
// plugin, so a snapshot diff always means the pipeline's output changed.
// Review that diff, then update baselines with `vitest -u`. Vitest fails on
// missing snapshots in CI, so a fresh checkout can't silently bake bugs
// into the baseline.
for (const rel of globSync('*.md', { cwd: fixturesDir }).sort()) {
  test(`HTML baseline: ${rel}`, async () => {
    const raw = readFileSync(join(fixturesDir, rel), 'utf8')
    const { data, content } = parseFrontMatter(raw)
    const { html } = renderPage(content, data)

    await expect(html).toMatchFileSnapshot(join(snapshotsDir, rel + '.html'))
  })
}
