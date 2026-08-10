import { expect, test } from 'vitest'
import { transformMagicComments } from './code-magic-comments.js'

test('[!code ++] becomes + prefixed line without marker', () => {
  const output = transformMagicComments(
    "import { routes } from 'vue-router/auto-routes' // [!code ++]"
  )
  expect(output).toBe("+ import { routes } from 'vue-router/auto-routes'")
})

test('[!code --] becomes - prefixed line without marker', () => {
  const output = transformMagicComments(
    "import routes from './routes' // [!code --]"
  )
  expect(output).toBe("- import routes from './routes'")
})

test('[!code highlight] strips marker, keeps line unchanged', () => {
  const output = transformMagicComments('doSomething() // [!code highlight]')
  expect(output).toBe('doSomething()')
})

test('[!code focus] and [!code error] strip marker', () => {
  expect(transformMagicComments('a() // [!code focus]')).toBe('a()')
  expect(transformMagicComments('b() // [!code error]')).toBe('b()')
})

test('mixed block translates line by line, untouched lines preserved', () => {
  const src = [
    'const a = 1',
    'const old = 2 // [!code --]',
    'const fresh = 2 // [!code ++]',
    'const b = 3'
  ].join('\n')
  const output = transformMagicComments(src)
  expect(output).toBe(
    ['const a = 1', '- const old = 2', '+ const fresh = 2', 'const b = 3'].join(
      '\n'
    )
  )
})

test('content without markers is returned as-is (fast path)', () => {
  const src = 'const x = 1\nconst y = 2'
  expect(transformMagicComments(src)).toBe(src)
})

test('html-comment style marker in template code', () => {
  const output = transformMagicComments('<div class="row"> <!-- [!code ++] -->')
  expect(output).toBe('+ <div class="row">')
})

test('hash-comment style marker (bash/yaml)', () => {
  const output = transformMagicComments('port: 8080 # [!code ++]')
  expect(output).toBe('+ port: 8080')
})

test('indented marked line keeps its indentation after the diff prefix', () => {
  const output = transformMagicComments(
    '  handleHotUpdate(Router) // [!code ++]'
  )
  expect(output).toBe('+   handleHotUpdate(Router)')
})
