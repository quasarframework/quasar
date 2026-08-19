import { describe, expect, test } from 'vitest'

import {
  hasResidualQuasarImports,
  loadQuasarImportMap,
  mapQuasarImports,
  residualQuasarImportRegex
} from '../../../src/js-transform.js'

loadQuasarImportMap()

describe('js transform', () => {
  test('maps a single-line import', () => {
    expect(mapQuasarImports("import { QBtn } from 'quasar'")).toBe(
      "import QBtn from 'quasar/src/components/btn/QBtn.js';"
    )
  })

  test('maps a multi-line import', () => {
    const code = "import {\n  QBtn,\n  useQuasar\n} from 'quasar'"
    const result = mapQuasarImports(code)

    expect(result).toContain(
      "import QBtn from 'quasar/src/components/btn/QBtn.js';"
    )
    expect(result).toContain('import useQuasar from ')
    expect(residualQuasarImportRegex.test(result)).toBe(false)
  })

  test('maps an import containing comments', () => {
    const code =
      "import {\n  QBtn, // the button\n  /* popup */ QDialog\n} from 'quasar'"
    const result = mapQuasarImports(code)

    expect(result).toContain(
      "import QBtn from 'quasar/src/components/btn/QBtn.js';"
    )
    expect(result).toContain('import QDialog from ')
    expect(residualQuasarImportRegex.test(result)).toBe(false)
  })

  test('mapping a multi-line import preserves the file line count', () => {
    const code =
      "before()\nimport {\n  QBtn,\n  useQuasar\n} from 'quasar'\nafter()"
    const result = mapQuasarImports(code)

    const lines = result.split('\n')
    expect(lines.length).toBe(code.split('\n').length)
    // content below the import statement stays on its original line
    expect(lines[5]).toBe('after()')
  })

  test('keeps aliased imports working', () => {
    expect(mapQuasarImports("import { QBtn as MyBtn } from 'quasar'")).toBe(
      "import MyBtn from 'quasar/src/components/btn/QBtn.js';"
    )
  })

  test('maps multiple import statements in one file', () => {
    const code =
      "import { QBtn } from 'quasar'\n" +
      'const x = 1\n' +
      "import { date } from 'quasar'\n"
    const result = mapQuasarImports(code)

    expect(result).toContain(
      "import QBtn from 'quasar/src/components/btn/QBtn.js';"
    )
    expect(result).toContain(
      "import date from 'quasar/src/utils/date/date.js';"
    )
    expect(residualQuasarImportRegex.test(result)).toBe(false)
  })

  test('keeps code following an import on the same line in place', () => {
    const code = "import { QBtn } from 'quasar';const x = 1"
    const result = mapQuasarImports(code)

    expect(result).toBe(
      "import QBtn from 'quasar/src/components/btn/QBtn.js';const x = 1"
    )
  })

  test('is idempotent', () => {
    const once = mapQuasarImports("import { QBtn } from 'quasar'")
    expect(mapQuasarImports(once)).toBe(once)
  })

  test('residual detection confirms real untransformed imports', () => {
    expect(hasResidualQuasarImports("export * from 'quasar'")).toBe(true)
    expect(hasResidualQuasarImports("export { QBtn } from 'quasar'")).toBe(true)
    expect(hasResidualQuasarImports("import * as Q from 'quasar'")).toBe(true)
    expect(
      hasResidualQuasarImports("async function f() { await import('quasar') }")
    ).toBe(true)
  })

  test('residual detection ignores import statements inside strings', () => {
    // the DocInstall.vue documentation snippet shape
    const docSnippet = `const code = \`// main.js

import {
  \${imports.join(',')}
} from 'quasar'

app.use(Quasar)\`
`
    expect(hasResidualQuasarImports(docSnippet)).toBe(false)

    expect(
      hasResidualQuasarImports('const s = "import { QBtn } from \'quasar\'"')
    ).toBe(false)
    expect(
      hasResidualQuasarImports('const s = "await import(\'quasar\')"')
    ).toBe(false)

    // per-file paths are not residuals
    expect(
      hasResidualQuasarImports(
        "import QBtn from 'quasar/src/components/btn/QBtn.js'"
      )
    ).toBe(false)
  })

  test('residual detection parses the dialect indicated by the module id', () => {
    const tsString = 'const s: string = "import { QBtn } from \'quasar\'"'

    // TS syntax parses exactly, so the string content is not a residual
    expect(hasResidualQuasarImports(tsString, '/src/file.ts')).toBe(false)
    expect(
      hasResidualQuasarImports(tsString, '/src/App.vue?vue&type=script&lang.ts')
    ).toBe(false)
    expect(hasResidualQuasarImports(tsString, '/src/file.mts')).toBe(false)

    // without a TS id the code is unparsable; the textual match is trusted
    expect(hasResidualQuasarImports(tsString)).toBe(true)

    expect(
      hasResidualQuasarImports(
        "enum E { A }\nimport { QBtn } from 'quasar'",
        '/src/file.ts'
      )
    ).toBe(true)
  })

  test('residual detection ignores type-only imports and exports', () => {
    const id = '/src/file.ts'

    expect(
      hasResidualQuasarImports("import type { QBtn } from 'quasar'", id)
    ).toBe(false)
    expect(
      hasResidualQuasarImports("import { type QBtn } from 'quasar'", id)
    ).toBe(false)
    expect(
      hasResidualQuasarImports("export type { QBtn } from 'quasar'", id)
    ).toBe(false)
    expect(hasResidualQuasarImports("export type * from 'quasar'", id)).toBe(
      false
    )

    // a value specifier next to type ones still pulls the bundle in
    expect(
      hasResidualQuasarImports("import { type QBtn, QChip } from 'quasar'", id)
    ).toBe(true)
  })

  test('residual regex flags untransformed imports', () => {
    expect(
      residualQuasarImportRegex.test("export { QBtn } from 'quasar'")
    ).toBe(true)
    expect(residualQuasarImportRegex.test("export * from 'quasar'")).toBe(true)
    expect(
      residualQuasarImportRegex.test("const q = await import('quasar')")
    ).toBe(true)
    expect(
      residualQuasarImportRegex.test(
        "import QBtn from 'quasar/src/components/btn/QBtn.js'"
      )
    ).toBe(false)
    expect(
      residualQuasarImportRegex.test("import('quasar/src/utils/date/date.js')")
    ).toBe(false)
  })
})
