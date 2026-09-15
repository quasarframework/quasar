import { expect, test } from 'vitest'
import { join } from 'node:path'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { siteComponentHandlers } from './site-components.js'
import { transitionNames } from '../../../../src/pages/options/transitions/transition-names.js'
import { paletteColors } from '../../../../src/pages/style/color-palette/colors.js'
import { weights } from '../../../../src/pages/style/typography/typography-classes.js'

function render(tag, { sourcePath = 'x.md', sassVariablesPath = '' } = {}) {
  const handlers = siteComponentHandlers({
    quasarVersion: '9.9.9',
    sassVariablesPath
  })
  return handlers[tag].block({ content: `<${tag} />` }, { sourcePath })
}

test('interactive components point at their live page', () => {
  expect(
    render('ThemePicker', {
      sourcePath: 'style/theme-builder/theme-builder.md'
    })
  ).toBe(
    '> Visit the [live documentation](https://quasar.dev/style/theme-builder) for the interactive theme picker.\n\n'
  )
})

test('the transition names are listed', () => {
  const output = render('TransitionList')
  for (const name of transitionNames) {
    expect(output).toContain(`- \`${name}\``)
  }
  expect(output).toContain('q-transition--<name>')
})

test('the palette is listed with its shade range', () => {
  const output = render('ColorList')
  for (const color of paletteColors) {
    expect(output).toContain(`- \`${color}\``)
  }
  expect(output).toMatch(/<color>-1.*<color>-14/)
  expect(render('BrandColors')).toContain('- `primary`')
})

test('typography classes come as a table and a list', () => {
  const headings = render('TypographyHeadings')
  expect(headings).toMatch(/^\| Class \| HTML equivalent \| Sample \|\n/)
  expect(headings).toContain('| `text-h1` | `h1` | Headline 1 |')
  expect(headings).toContain('| `text-body1` |  | Body 1 |')
  expect(headings).not.toContain('Lorem')
  const weightList = render('TypographyWeights')
  for (const weight of weights) {
    expect(weightList).toContain(`- \`text-weight-${weight}\``)
  }
})

test('the Sass variables file is fenced verbatim, read once', () => {
  const dir = mkdtempSync(join(tmpdir(), 'site-components-'))
  try {
    const file = join(dir, 'variables.sass')
    writeFileSync(file, '$primary: #1976D2\n')
    const handlers = siteComponentHandlers({
      quasarVersion: '9.9.9',
      sassVariablesPath: file
    })
    const first = handlers.SassVariables.block({}, { sourcePath: 'x.md' })
    expect(first).toBe('```sass\n$primary: #1976D2\n```\n\n')
    rmSync(file)
    expect(handlers.SassVariables.block({}, { sourcePath: 'x.md' })).toBe(first)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('the UMD page is written for the default pick at the ui version', () => {
  const output = render('UmdTags', { sourcePath: 'start/umd/umd.md' })
  expect(output).toMatch(
    /^With the default pick .*\(https:\/\/quasar\.dev\/start\/umd\):\n\n```html\n<!doctype html>/
  )
  expect(output).toContain(
    'cdn.jsdelivr.net/npm/quasar@9.9.9/dist/quasar.umd.prod.js'
  )
  expect(output).toContain(
    'fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons'
  )
  expect(output).toMatch(/\n```\n\n$/)
})

test('the Vite plugin page is written for the default pick', () => {
  const output = render('VitePluginUsage', {
    sourcePath: 'start/vite-plugin/vite-plugin.md'
  })
  expect(output).toContain('```js\n// main.js\n')
  expect(output).toContain('```js\n// vite.config.js\n')
  expect(output).toContain('```sass\n// Create: src/quasar-variables.sass\n')
  expect(output).toContain(
    "sassVariables: join(import.meta.dirname, 'src/quasar-variables.sass')"
  )
})

test('the view prop grid is a table, the playground and team cards nothing', () => {
  expect(render('ViewProp')).toContain('| header | l/h | h/H | r/h |')
  expect(render('ViewPlay')).toBe('')
  expect(render('TeamMember')).toBe('')
})

test('every handler serves both token contexts', () => {
  const handlers = siteComponentHandlers({
    quasarVersion: '9.9.9',
    sassVariablesPath: ''
  })
  for (const handler of Object.values(handlers)) {
    expect(typeof handler.block).toBe('function')
    expect(typeof handler.inline).toBe('function')
  }
})
