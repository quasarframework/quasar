import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import { quasarRolldownVirtualEntry } from '../lib/plugins/rolldown.virtual-entry.js'

describe('quasarRolldownVirtualEntry', () => {
  test('statically imports the target by default', () => {
    const inputFile = '/project/.quasar/entry.js'
    const plugin = quasarRolldownVirtualEntry({
      inputFile,
      targetFile: '/project/src/main.js'
    })

    assert.equal(plugin.resolveId(inputFile), inputFile)
    assert.equal(plugin.resolveId('/project/src/main.js'), null)
    assert.equal(plugin.load(inputFile), "import './../src/main.js'")
    assert.equal(plugin.load('/project/src/main.js'), null)
  })

  test('runs bootstrap code before importing the target', () => {
    const inputFile = '/project/.quasar/entry.js'
    const beforeImportCode = [
      "import { app } from 'electron'",
      '',
      "app.dock.setIcon('/project/icon.icns')"
    ].join('\n')
    const plugin = quasarRolldownVirtualEntry({
      inputFile,
      targetFile: '/project/src/main.js',
      beforeImportCode
    })

    assert.equal(
      plugin.load(inputFile),
      `${beforeImportCode}\n\nawait import('./../src/main.js')`
    )
  })
})
