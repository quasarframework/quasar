import { expect, test } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderApi } from './render.js'

const __dirname = import.meta.dirname

test('full component renders sections in fixed order', () => {
  const json = {
    type: 'component',
    meta: { docsUrl: 'https://v2.quasar.dev/vue-components/foo' },
    props: { value: { type: 'Number', desc: 'val' } },
    events: { input: { desc: 'fired' } },
    methods: { focus: { desc: 'do' } },
    slots: { default: { desc: 'def' } }
  }
  const output = renderApi('QFoo', json)
  // Heading first
  expect(output).toMatch(/^## QFoo API\n\n/)
  // Sections render at h3 under the wrapping h2, in fixed order.
  const propsIndex = output.indexOf('### Props')
  const methodsIndex = output.indexOf('### Methods')
  const eventsIndex = output.indexOf('### Events')
  const slotsIndex = output.indexOf('### Slots')
  // indexOf returns -1 on a miss, which would satisfy any < comparison.
  for (const index of [propsIndex, methodsIndex, eventsIndex, slotsIndex]) {
    expect(index).toBeGreaterThanOrEqual(0)
  }
  expect(propsIndex < methodsIndex).toBeTruthy()
  expect(methodsIndex < eventsIndex).toBeTruthy()
  expect(eventsIndex < slotsIndex).toBeTruthy()
})

test('empty sections are skipped', () => {
  const json = { type: 'component', props: { x: { type: 'String' } } }
  const output = renderApi('QBar', json)
  expect(output).toMatch(/### Props/)
  expect(output).not.toContain('### Methods')
  expect(output).not.toContain('### Events')
  expect(output).not.toContain('### Slots')
})

test('docsUrl is NOT emitted as a self-reference note', () => {
  // The .md output IS derived from the page at meta.docsUrl, so emitting a
  // "Component reference for [QX](docsUrl)" line was redundant noise. We
  // assert the negative: regardless of meta.docsUrl presence, no such line.
  const json = {
    type: 'component',
    meta: { docsUrl: 'https://v2.quasar.dev/vue-components/x' },
    props: { a: { type: 'String' } }
  }
  const output = renderApi('QX', json)
  expect(output).not.toContain('Component reference for')
})

test('scoped slots are partitioned into Scoped Slots section', () => {
  const json = {
    type: 'component',
    slots: {
      default: { desc: 'plain' },
      item: { desc: 'scoped', scope: { x: { type: 'Number' } } }
    }
  }
  const output = renderApi('QY', json)
  expect(output).toMatch(/### Slots/)
  expect(output).toMatch(/### Scoped Slots/)
})

const qKnobApiPath = resolve(__dirname, '../../../../ui/dist/api/QKnob.json')

// a built ui package is guaranteed by the vitest globalSetup preflight
test('end-to-end: renderApi on real QKnob.json produces expected structure', () => {
  const json = JSON.parse(readFileSync(qKnobApiPath, 'utf8'))
  const output = renderApi('QKnob', json)
  expect(output).toMatch(/^## QKnob API\n/)
  expect(output).toMatch(/### Props/)
  // QKnob has min/max/step props. Verify Stripe-style formatting on one.
  expect(output).toMatch(/- `min` \(number, optional\)/)
})

test('quasarConfOptions renders type, desc, values and examples', () => {
  const output = renderApi('Dark', {
    type: 'plugin',
    quasarConfOptions: {
      propName: 'dark',
      type: ['Boolean', 'String'],
      desc: "'auto' follows the OS.",
      values: ["'auto'", 'true', 'false']
    }
  })
  expect(output).toContain(
    '### quasar.config.js Options\n\n' +
      'Configuration key: `framework.config.dark` (boolean | string)\n\n' +
      "'auto' follows the OS.\n\n" +
      "Accepts: `'auto'`, `true`, `false`\n\n"
  )
})

test('quasarConfOptions with a definition keeps the bullet list', () => {
  const output = renderApi('Screen', {
    type: 'plugin',
    quasarConfOptions: {
      propName: 'screen',
      type: 'Object',
      definition: {
        bodyClasses: { type: 'Boolean', desc: 'Body classes' }
      }
    }
  })
  expect(output).toContain(
    'Configuration key: `framework.config.screen` (object)\n\n' +
      '- `bodyClasses` (boolean, optional)\n  Body classes\n'
  )
})
