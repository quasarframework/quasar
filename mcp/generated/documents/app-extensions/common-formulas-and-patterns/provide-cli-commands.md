---
title: Providing CLI Command(s)
description: Tips and tricks on how to use a Quasar App Extension to provide runnable CLI commands
canonical: https://quasar.dev/app-extensions/common-formulas-and-patterns/provide-cli-commands
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

One powerful feature of Quasar CLI App Extensions is to provide commands that can be run by your users just as the Quasar CLI commands.

## Usage

Let's see how you can register a command that will become available as `quasar run <ext-id> <cmd> [...args]`. We will be editing our [Index script](/app-extensions/development-guide/index-api):

```js /ae/src/index.js (or .ts)
import { defineIndexScript } from '#q-app'

export default defineIndexScript(api => {
  /**
   * @param {string} commandName
   * @param {function} fn
   *   (processArgv: string[]) => ?Promise
   */
  api.registerCommand('start', processArgv => {
    // do something here
    // this registers the "start" command
    // and this handler is executed when running
    // quasar run <ext-id> start
  })
})
```

Example with defining and parsing arguments:

```js /ae/src/index.js (or .ts)
import { defineIndexScript } from '#q-app'
import { parseArgs } from 'node:util'

export default defineIndexScript(api => {
  /**
   * User can run in the host app:
   *   quasar run <ext-id> fun --name Gigi -d
   */
  api.registerCommand('fun', () => {
    try {
      const { values, positionals } = parseArgs({
        options: {
          name: { type: 'string', short: 'n' },
          debug: { type: 'boolean' }
        },
        strict: true,
        allowPositionals: true
      })

      console.log(values, positionals)
    } catch (err) {
      console.error(err.message)
    }
  })
})
```
