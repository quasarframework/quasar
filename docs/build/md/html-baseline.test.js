import { expect, test } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseFrontMatter } from './md-parse-utils.js'
import md from './md.js'

const __dirname = import.meta.dirname
const snapshotsDir = join(__dirname, 'snapshots')
const pagesRoot = join(__dirname, '../../src/pages')

// Update baselines with `vitest -u`. Vitest fails on missing snapshots in CI,
// so a fresh checkout can't silently bake bugs into the baseline.
const SAMPLES = [
  'vue-components/knob.md',
  'quasar-cli-vite/page-routing-with-vue-router.md',
  'quasar-plugins/notify.md',
  'quasar-cli-vite/handling-vite.md',
  'start/quick-start.md'
]

for (const rel of SAMPLES) {
  test(`HTML baseline: ${rel}`, async () => {
    const sourcePath = join(pagesRoot, rel)
    if (!existsSync(sourcePath)) {
      throw new Error(`Sample page missing: ${sourcePath}`)
    }

    const raw = readFileSync(sourcePath, 'utf8')
    const { data: frontMatter, content } = parseFrontMatter(raw)
    md.$frontMatter = { ...frontMatter, toc: [], pageScripts: new Set() }
    const html = md.render(content)
    md.$frontMatter = null

    const snapshotPath = join(snapshotsDir, rel.replaceAll('/', '__') + '.html')
    await expect(html).toMatchFileSnapshot(snapshotPath)
  })
}
