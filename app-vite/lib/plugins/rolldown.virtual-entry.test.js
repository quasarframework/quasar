import { describe, expect, test } from 'vitest'

import { quasarRolldownVirtualEntry } from './rolldown.virtual-entry.js'

describe('[rolldown.virtual-entry.js]', () => {
  const inputFile = '/app/.quasar/entry-point.js'
  const targetFile = '/app/.quasar/electron/electron-main.js'

  test('emits a static import by default', () => {
    const plugin = quasarRolldownVirtualEntry({ inputFile, targetFile })

    expect(plugin.load.handler(inputFile)).toBe(
      "import './electron/electron-main.js'"
    )
  })

  test('defers the import when bootstrap code must run first', () => {
    const plugin = quasarRolldownVirtualEntry({
      inputFile,
      targetFile,
      beforeImportCode: 'globalThis.__bootstrap = true'
    })

    expect(plugin.load.handler(inputFile)).toBe(
      "globalThis.__bootstrap = true\n\nawait import('./electron/electron-main.js')"
    )
  })

  test('resolves only the virtual entry itself', () => {
    const plugin = quasarRolldownVirtualEntry({ inputFile, targetFile })

    expect(plugin.resolveId.handler(inputFile)).toBe(inputFile)
    expect(plugin.resolveId.handler('/app/other.js')).toBeNull()
    expect(plugin.load.handler('/app/other.js')).toBeNull()
  })

  test('the native filter matches the entry exactly, even with regex chars', () => {
    const trickyInput = '/app/.quasar/entry (v2).js'
    const plugin = quasarRolldownVirtualEntry({
      inputFile: trickyInput,
      targetFile
    })

    expect(plugin.load.filter.id.test(trickyInput)).toBe(true)
    expect(plugin.load.filter.id.test('/app/Xquasar/entry (v2)Xjs')).toBe(false)
    expect(plugin.load.filter.id.test(trickyInput + '.map')).toBe(false)
  })

  test('the native filter and handlers accept Windows paths in both separator forms', () => {
    // rolldown normalizes ids to forward slashes before evaluating native
    // filters (rolldown repo: crates/rolldown_utils/src/filter_expression.rs)
    // while the JS handlers receive the raw OS-native id (#18504)
    const winInput = String.raw`D:\app\.quasar\dev-electron\electron\q.entry.main.js`
    const winTarget = String.raw`D:\app\src-electron\electron-main.js`
    const normalizedId = winInput.replaceAll('\\', '/')

    const plugin = quasarRolldownVirtualEntry({
      inputFile: winInput,
      targetFile: winTarget
    })

    expect(plugin.resolveId.filter.id.test(normalizedId)).toBe(true)
    expect(plugin.load.filter.id.test(normalizedId)).toBe(true)
    expect(plugin.resolveId.filter.id.test(winInput)).toBe(true)
    expect(plugin.load.filter.id.test(winInput)).toBe(true)
    expect(plugin.load.filter.id.test('D:/app/other.js')).toBe(false)

    expect(plugin.resolveId.handler(winInput)).toBe(winInput)
    expect(plugin.resolveId.handler(normalizedId)).toBe(winInput)

    const loadedCode = plugin.load.handler(winInput)
    expect(loadedCode).not.toBeNull()
    expect(plugin.load.handler(normalizedId)).toBe(loadedCode)
  })
})
