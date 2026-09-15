import { expect, test } from 'vitest'
import { join } from 'node:path'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { writeApiPages } from './api-pages.js'
import { renderApi } from '../api/render.js'

test('renders every descriptor into api/<Name>.md, as the site inlines it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'api-pages-'))
  try {
    const apiDir = join(dir, 'api')
    const distDir = join(dir, 'mcp')
    mkdirSync(apiDir)
    const qBtn = {
      type: 'component',
      props: { label: { type: 'String', desc: 'The label' } }
    }
    const ripple = { type: 'directive', value: { type: 'Boolean', desc: 'On' } }
    writeFileSync(join(apiDir, 'QBtn.json'), JSON.stringify(qBtn))
    writeFileSync(join(apiDir, 'Ripple.json'), JSON.stringify(ripple))
    writeFileSync(join(apiDir, 'notes.txt'), 'ignored')

    expect(writeApiPages({ distDir, apiDir })).toEqual(['QBtn', 'Ripple'])
    expect(readFileSync(join(distDir, 'api/QBtn.md'), 'utf8')).toBe(
      renderApi('QBtn', qBtn)
    )
    expect(readFileSync(join(distDir, 'api/Ripple.md'), 'utf8')).toMatch(
      /^## Ripple API\n\n### Directive Value\n/
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
