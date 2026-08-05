import { dirname } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, test } from 'vitest'

import {
  quasarRolldownInjectReplacementsDefine,
  quasarRolldownInjectReplacementsPlugin
} from './rolldown.inject-replacements.js'

describe('[rolldown.inject-replacements.js]', () => {
  const plugin = quasarRolldownInjectReplacementsPlugin()
  const { filter, handler } = plugin.transform
  const id = '/app/src/some-file.js'

  // mirrors what rolldown's `define` option does with the
  // transform hook's output
  function applyDefine(code) {
    for (const [token, replacement] of Object.entries(
      quasarRolldownInjectReplacementsDefine
    )) {
      code = code.replaceAll(token, replacement)
    }
    return code
  }

  test('declares native filters for scripts containing the tokens', () => {
    for (const file of ['a.js', 'a.cjs', 'a.mjs', 'a.ts', 'a.cts', 'a.mts']) {
      expect(filter.id.test(file)).toBe(true)
    }
    for (const file of ['a.vue', 'a.json', 'a.jsx', 'a.css']) {
      expect(filter.id.test(file)).toBe(false)
    }

    for (const snippet of [
      '__dirname',
      '__filename',
      'import.meta.url',
      'import.meta.dirname',
      'import.meta.filename'
    ]) {
      expect(filter.code.test(`console.log(${snippet})`)).toBe(true)
    }
    expect(filter.code.test('console.log("hi")')).toBe(false)
  })

  test('leaves token-free code untouched', () => {
    expect(handler('console.log("hi")', id)).toBeNull()
  })

  test('prepends only the required replacement values', () => {
    const result = handler('console.log(__dirname)', id)

    expect(result.code).toContain(
      `const __quasar_inject_dirname__ = ${JSON.stringify(dirname(id))};`
    )
    expect(result.code).not.toContain('__quasar_inject_filename__ =')

    // the define step then rewires the token to the injected value
    expect(applyDefine(result.code)).toContain(
      'console.log(__quasar_inject_dirname__)'
    )
  })

  test('the define + transform combination resolves all tokens', () => {
    const source = `
      module.exports = {
        dir: __dirname,
        file: __filename,
        url: import.meta.url,
        metaDir: import.meta.dirname,
        metaFile: import.meta.filename
      }
    `

    // transform first (sees the original tokens),
    // then the define replacement kicks in
    const code = applyDefine(handler(source, id).code)

    // no token may be left undeclared
    const moduleShim = { exports: {} }
    // oxlint-disable-next-line no-new-func
    new Function('module', code)(moduleShim)

    expect(moduleShim.exports).toEqual({
      dir: dirname(id),
      file: id,
      url: pathToFileURL(id).href,
      metaDir: dirname(id),
      metaFile: id
    })
  })
})
