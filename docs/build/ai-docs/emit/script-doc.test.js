import { expect, test } from 'vitest'
import { stripScriptDoc } from './script-doc-stripper.js'

test('strips a single <script doc> block', () => {
  const src = 'before\n<script doc>\nimport X from "x"\n</script>\n\nafter'
  expect(stripScriptDoc(src)).toBe('before\n\n\nafter')
})

test('strips multiple <script doc> blocks', () => {
  const src = 'a\n<script doc>x</script>\nb\n<script doc>y</script>\nc'
  expect(stripScriptDoc(src)).toBe('a\n\nb\n\nc')
})

test('leaves regular <script> blocks alone', () => {
  const src = 'a\n<script>regular()</script>\nb'
  expect(stripScriptDoc(src)).toBe('a\n<script>regular()</script>\nb')
})

test('handles <script doc> with attributes other than just "doc"', () => {
  // Strictness: only the literal <script doc> opening matches
  const src = 'a\n<script doc lang="ts">x</script>\nb'
  // The current spec: only strip exact <script doc>. Treat the lang= variant
  // as a non-match (regular script). If needed later, broaden the regex.
  expect(stripScriptDoc(src)).toBe('a\n<script doc lang="ts">x</script>\nb')
})
