import { expect, test } from 'vitest'
import { applyCollapseMarkers } from '../emit/collapse-markers.js'

test('strips a #region block, replacing with a placeholder', () => {
  const src = [
    'const rows = [',
    '  { a: 1 },',
    '  { b: 2 },',
    '  // #region',
    '  { c: 3 },',
    '  { d: 4 },',
    '  // #endregion',
    ']'
  ].join('\n')
  const output = applyCollapseMarkers(src)
  expect(output).toContain('{ a: 1 }')
  expect(output).toContain('{ b: 2 }')
  expect(output).not.toContain('{ c: 3 }')
  expect(output).not.toContain('{ d: 4 }')
  expect(output).not.toContain('#region')
  expect(output).not.toContain('#endregion')
  expect(output).toContain('  // ...')
})

test('passes through code with no region markers', () => {
  const src = 'const x = [1, 2, 3]'
  expect(applyCollapseMarkers(src)).toBe(src)
})

test('region with a label still gets stripped', () => {
  const src = ['// #region remaining rows', 'omitted', '// #endregion'].join(
    '\n'
  )
  const output = applyCollapseMarkers(src)
  expect(output).toBe('// ...')
})

test('nested regions: inner pair folds into outer placeholder', () => {
  const src = [
    '// #region outer',
    'a',
    '// #region inner',
    'b',
    '// #endregion',
    'c',
    '// #endregion'
  ].join('\n')
  const output = applyCollapseMarkers(src)
  expect(output).toBe('// ...')
})

test('missing #endregion leaves the open marker in place', () => {
  const src = ['// #region', 'a', 'b'].join('\n')
  const output = applyCollapseMarkers(src)
  // Should preserve original lines (no silent loss)
  expect(output).toContain('// #region')
  expect(output).toContain('a')
  expect(output).toContain('b')
})

test('preserves indentation of the opening marker', () => {
  const src = [
    'function f() {',
    '  // #region',
    '  internal',
    '  // #endregion',
    '}'
  ].join('\n')
  const output = applyCollapseMarkers(src)
  expect(output).toContain('  // ...')
})

test('HTML comment markers are recognized', () => {
  const src = [
    '<template>',
    '  <ul>',
    '    <li>kept</li>',
    '    <!-- #region -->',
    '    <li>dropped</li>',
    '    <li>dropped</li>',
    '    <!-- #endregion -->',
    '  </ul>',
    '</template>'
  ].join('\n')
  const output = applyCollapseMarkers(src)
  expect(output).toContain('<li>kept</li>')
  expect(output).not.toContain('<li>dropped</li>')
  expect(output).not.toContain('#region')
  expect(output).not.toContain('#endregion')
  // HTML-comment region gets an HTML-comment placeholder, indented.
  expect(output).toContain('    <!-- ... -->')
})

test('HTML comment markers with a label are recognized', () => {
  const src = [
    '<template>',
    '  <!-- #region remaining items -->',
    '  <li>dropped</li>',
    '  <!-- #endregion -->',
    '</template>'
  ].join('\n')
  const output = applyCollapseMarkers(src)
  expect(output).not.toContain('<li>dropped</li>')
  expect(output).not.toContain('#region')
  expect(output).not.toContain('#endregion')
  expect(output).toContain('  <!-- ... -->')
})

test('JS and HTML markers can coexist in the same source', () => {
  const src = [
    '<template>',
    '  <!-- #region -->',
    '  <li>x</li>',
    '  <!-- #endregion -->',
    '</template>',
    '<script setup>',
    'const rows = [',
    '  // #region',
    '  { a: 1 },',
    '  // #endregion',
    ']',
    '</script>'
  ].join('\n')
  const output = applyCollapseMarkers(src)
  // Two placeholders, each matching its opening marker style
  expect(output).toContain('  <!-- ... -->')
  expect(output).toContain('  // ...')
})
