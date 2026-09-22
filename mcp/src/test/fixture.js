import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { onTestFinished } from 'vitest'

/**
 * A throwaway project with `quasar` and `@quasar/app-vite` installed the
 * way a published release lays them out: `dist/mcp` slices with a
 * `meta.json`, and `dist/api` descriptors for quasar. Options drop
 * pieces to model older releases.
 *
 * @param {{ appVite?: boolean, quasarDocs?: boolean, apiMarkdown?: boolean, docsFormat?: number, quasarVersion?: string, dir?: string }} [opts] `apiMarkdown: false` models a ui release whose slice predates the rendered descriptors; `docsFormat` the format number quasar's meta.json declares; `quasarVersion` the release installed; `dir` a directory to build the project in (an app of a workspace).
 * @returns {string} The project directory, removed when the test ends.
 */
export function createProject({
  appVite = true,
  quasarDocs = true,
  apiMarkdown = true,
  docsFormat = 1,
  quasarVersion = '2.33.0',
  dir = mkdtempSync(join(tmpdir(), 'quasar-mcp-'))
} = {}) {
  mkdirSync(dir, { recursive: true })
  onTestFinished(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  const write = (relativePath, content) => {
    const file = join(dir, relativePath)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(
      file,
      typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    )
  }

  write('package.json', { name: 'fixture', private: true })

  const quasarDir = 'node_modules/quasar'
  write(`${quasarDir}/package.json`, {
    name: 'quasar',
    version: quasarVersion
  })
  write(`${quasarDir}/dist/api/QBtn.json`, {
    type: 'component',
    meta: { docsUrl: 'https://v2.quasar.dev/vue-components/button' },
    props: {
      label: {
        type: ['String', 'Number'],
        desc: 'The text that will be shown on the button'
      },
      loading: { type: 'Boolean', desc: 'Put button into loading state' }
    },
    slots: {
      default: { desc: 'Default slot' },
      loading: { desc: 'Override the default QSpinner' }
    },
    events: {
      click: { desc: 'Emitted when the component is clicked', params: {} }
    }
  })
  write(`${quasarDir}/dist/api/Notify.json`, {
    type: 'plugin',
    meta: { docsUrl: 'https://v2.quasar.dev/quasar-plugins/notify' },
    methods: {
      create: {
        desc: 'Creates a notification',
        params: {},
        returns: { type: 'Function' }
      }
    },
    quasarConfOptions: {
      definition: { position: { type: 'String', desc: 'Position' } }
    }
  })

  if (quasarDocs && apiMarkdown) {
    // the shape docs/build/mcp/api/render.js gives a descriptor
    write(
      `${quasarDir}/dist/mcp/api/QBtn.md`,
      `## QBtn API

### Props

- \`label\` (string | number, optional)
  The text that will be shown on the button
- \`loading\` (boolean, optional)
  Put button into loading state

### Events

- \`@click\`
  Emitted when the component is clicked
  Params:
    - \`evt\` (Event, optional)

### Slots

- \`#default\`
  Default slot

### Scoped Slots

- \`#loading\`
  Override the default QSpinner
`
    )
    write(
      `${quasarDir}/dist/mcp/api/Notify.md`,
      `## Notify API

### Methods

- \`create(): Function\`
  Creates a notification

### quasar.config.js Options

- \`position\` (string, optional)
  Position
`
    )
  }

  if (quasarDocs) {
    write(`${quasarDir}/dist/mcp/meta.json`, {
      format: docsFormat,
      package: 'quasar',
      version: quasarVersion,
      pages: [
        {
          route: 'vue-components/button',
          title: 'Button',
          desc: 'The QBtn component.',
          keys: ['QBtn']
        },
        {
          route: 'quasar-plugins/notify',
          title: 'Notify',
          desc: 'Notifications for the user.',
          keys: ['Notify']
        },
        {
          route: 'start/ai-agents',
          title: 'AI Agents',
          desc: 'Quasar for AI agents.'
        }
      ]
    })
    write(
      `${quasarDir}/dist/mcp/vue-components/button.md`,
      [
        '---',
        'title: Button',
        'desc: The QBtn component.',
        '---',
        '',
        'Quasar has a component called QBtn which is a button with a few extra useful features.',
        '',
        '## QBtn API',
        '',
        'Not inlined here: call the `get_api` tool with `name: "QBtn"` for its definition, or add `part` (`props`, `events`, `slots`) for one of them.',
        '',
        '## Usage',
        '',
        '### Standard',
        '',
        '```vue',
        '<q-btn label="Standard" />',
        '## not a heading, a fence line',
        '```',
        '',
        '### Custom colors',
        '',
        'Use the `color` prop. See also [Notify](../quasar-plugins/notify.md).',
        '',
        '## Loading state',
        '',
        'Set the `loading` prop for a spinner.',
        ''
      ].join('\n')
    )
    write(
      `${quasarDir}/dist/mcp/quasar-plugins/notify.md`,
      '---\ntitle: Notify\ndesc: Notifications for the user.\n---\n\nNotify is a Quasar plugin that can display animated messages.\n\n## Usage\n\nCall `$q.notify()`.\n'
    )
    write(
      `${quasarDir}/dist/mcp/start/ai-agents.md`,
      '---\ntitle: AI Agents\n---\n\nShipped by quasar.\n'
    )
  }

  if (appVite) {
    const appViteDir = 'node_modules/@quasar/app-vite'
    write(`${appViteDir}/package.json`, {
      name: '@quasar/app-vite',
      version: '3.9.0'
    })
    write(`${appViteDir}/dist/mcp/meta.json`, {
      format: 1,
      package: '@quasar/app-vite',
      version: '3.9.0',
      pages: [
        {
          route: 'quasar-cli-vite/boot-files',
          title: 'Boot files',
          desc: 'Running code before the app starts.'
        },
        {
          route: 'start/ai-agents',
          title: 'AI Agents',
          desc: 'Quasar for AI agents.'
        }
      ]
    })
    write(
      `${appViteDir}/dist/mcp/quasar-cli-vite/boot-files.md`,
      '---\ntitle: Boot files\n---\n\nBoot files run before the root Vue app instance is instantiated.\n\n## Anatomy of a boot file\n\nA boot file exports a function.\n'
    )
    write(
      `${appViteDir}/dist/mcp/start/ai-agents.md`,
      '---\ntitle: AI Agents\n---\n\nShipped by app-vite.\n'
    )
  }

  return dir
}
