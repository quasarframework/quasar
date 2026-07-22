import { expect, test } from 'vitest'
import { buildLlmsTxt } from '../output/llms-txt.js'

const PAGES = [
  { key: 'components', title: 'Quasar Components', desc: 'The list' },
  { key: 'vue-components/button', title: 'Button', desc: 'Buttons!' },
  { key: 'vue-components/knob', title: 'Knob', desc: null }
]

// Nav order intentionally lists vue-components before components, so the
// section-ordering test can tell nav order from page-encounter order.
const SECTION_INDEX = new Map([
  ['vue-components', 'Vue Components'],
  ['components', 'Components Index'],
  ['style', 'Style & Identity']
])

function build() {
  return buildLlmsTxt({
    pages: PAGES,
    sectionIndex: SECTION_INDEX,
    quasarVersion: '2.21.4',
    baseUrl: 'https://quasar.dev'
  })
}

test('starts with H1 and a blockquote summary', () => {
  const output = build()
  expect(output).toMatch(/^# Quasar Framework\n\n> Quasar is/)
  expect(output).toContain('v2.21.4')
})

test('groups pages into H2 sections using nav titles and nav order', () => {
  const output = build()
  expect(output).toContain('\n## Components Index\n')
  expect(output).toContain('\n## Vue Components\n')
  expect(output.indexOf('## Vue Components')).toBeLessThan(
    output.indexOf('## Components Index')
  )
})

test('nav sections with no generated pages are omitted', () => {
  const output = build()
  expect(output).not.toContain('## Style & Identity')
})

test('entries link to absolute .md URLs with desc suffix', () => {
  const output = build()
  expect(output).toContain(
    '- [Button](https://quasar.dev/vue-components/button.md): Buttons!'
  )
})

test('missing desc omits the colon suffix', () => {
  const output = build()
  expect(output).toContain(
    '- [Knob](https://quasar.dev/vue-components/knob.md)\n'
  )
})
