import { join } from 'node:path'
import { describe } from 'vitest'

import { definePlaygroundSuite } from './playground-suite.js'

describe('[e2e] playground-js', () => {
  definePlaygroundSuite({
    playgroundDir: join(import.meta.dirname, '../playground-js'),
    scriptExt: 'js'
  })
})
