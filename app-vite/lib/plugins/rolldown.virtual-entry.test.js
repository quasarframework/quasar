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
})
