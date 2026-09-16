import { expect, test } from 'vitest'
import { pruneTabs, renderTabs } from './tabs.js'

test('Composition/Options pair keeps Composition only', () => {
  const tabs = [
    { label: 'Composition API', lang: 'js', code: 'const x = 1' },
    { label: 'Options API', lang: 'js', code: 'data() { return { x: 1 } }' }
  ]
  const output = pruneTabs(tabs)
  expect(output.length).toBe(1)
  expect(output[0].label).toBe('Composition API')
})

test('TS/JS pair keeps TS only', () => {
  const tabs = [
    { label: 'Setup TS', lang: 'ts', code: 'const x: number = 1' },
    { label: 'Setup JS', lang: 'js', code: 'const x = 1' }
  ]
  const output = pruneTabs(tabs)
  expect(output.length).toBe(1)
  expect(output[0].label).toBe('Setup TS')
})

test('package manager trio keeps pnpm only', () => {
  const tabs = [
    { label: 'pnpm', lang: 'bash', code: 'pnpm add quasar' },
    { label: 'yarn', lang: 'bash', code: 'yarn add quasar' },
    { label: 'npm', lang: 'bash', code: 'npm i quasar' }
  ]
  const output = pruneTabs(tabs)
  expect(output.length).toBe(1)
  expect(output[0].label).toBe('pnpm')
})

test('mismatched pair: TS only with no JS counterpart -> kept', () => {
  const tabs = [{ label: 'Setup TS', lang: 'ts', code: 'x' }]
  const output = pruneTabs(tabs)
  expect(output.length).toBe(1)
})

test('unknown labels kept (Server vs Client)', () => {
  const tabs = [
    { label: 'Server', lang: 'js', code: 'serverOnly()' },
    { label: 'Client', lang: 'js', code: 'clientOnly()' }
  ]
  const output = pruneTabs(tabs)
  expect(output.length).toBe(2)
})

test('renderTabs captions a single survivor with the block title alone', () => {
  const tabs = [{ label: 'Composition API', lang: 'js', code: 'const x = 1' }]
  expect(renderTabs(tabs)).toBe('```js\nconst x = 1\n```\n\n')
  expect(renderTabs(tabs, '/src/boot/bus.js')).toBe(
    'Example "/src/boot/bus.js":\n\n```js\nconst x = 1\n```\n\n'
  )
})

test('renderTabs captions each surviving tab with its label, the block title in front', () => {
  const tabs = [
    { label: 'Server', lang: 'js', code: 'a' },
    { label: 'Client', lang: 'js', code: 'b' }
  ]
  expect(renderTabs(tabs)).toBe(
    'Example "Server":\n\n```js\na\n```\n\nExample "Client":\n\n```js\nb\n```\n\n'
  )
  expect(renderTabs(tabs, 'In your code')).toBe(
    'Example "In your code (Server)":\n\n```js\na\n```\n\nExample "In your code (Client)":\n\n```js\nb\n```\n\n'
  )
})

test('unrelated tabs survive pruning of a known trio', () => {
  const tabs = [
    { label: 'pnpm', lang: 'bash', code: 'pnpm add x' },
    { label: 'Yarn', lang: 'bash', code: 'yarn add x' },
    { label: 'NPM', lang: 'bash', code: 'npm i x' },
    { label: 'Bun', lang: 'bash', code: 'bun add x' }
  ]
  const pruned = pruneTabs(tabs)
  expect(pruned.map(({ label }) => label)).toStrictEqual(['pnpm', 'Bun'])
})
