import { expect, test } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { writePage } from '../output/per-page.js'

function withTempDir(run) {
  const dir = mkdtempSync(join(tmpdir(), 'aidocs-'))
  try {
    run(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

test('writes file with frontmatter wrapper (no h1 wrap, source heading levels preserved)', () => {
  withTempDir(dir => {
    writePage({
      distDir: dir,
      outputPath: 'vue-components/knob.md',
      frontMatter: { title: 'Knob', desc: 'The QKnob...' },
      body: 'body content here\n'
    })
    const written = readFileSync(join(dir, 'vue-components/knob.md'), 'utf8')
    expect(written).toMatch(/^---\n/)
    expect(written).toMatch(/title: Knob/)
    expect(written).not.toContain('# Knob\n')
    expect(written).toMatch(/body content here/)
  })
})

test('creates nested dirs as needed', () => {
  withTempDir(dir => {
    writePage({
      distDir: dir,
      outputPath: 'a/b/c/d.md',
      frontMatter: { title: 'X', desc: 'y' },
      body: 'z'
    })
    expect(existsSync(join(dir, 'a/b/c/d.md'))).toBeTruthy()
  })
})
