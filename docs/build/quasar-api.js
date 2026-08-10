async function getQuasarApiLoader() {
  try {
    const { default: files } = await import(
      'quasar/dist/transforms/api-list.json',
      {
        with: { type: 'json' }
      }
    )

    return files
      .map(
        entry =>
          `export const ${entry} = () => import('quasar/dist/api/${entry}.json')`
      )
      .join('\n')
  } catch {
    console.error(
      '\n ⚠️  Quasar API list not found. Please build Quasar UI first.\n'
    )
    process.exit(1)
  }
}

const content = await getQuasarApiLoader()

export function quasarApiVitePlugin() {
  return {
    name: 'docs:quasar:api',

    resolveId: {
      // rust-side filter: other import specifiers never cross into JS
      filter: { id: /^quasar:api$/ },

      handler(id) {
        if (id === 'quasar:api') return '\0quasar:api'
      }
    },

    load: {
      // oxlint-disable-next-line no-control-regex
      filter: { id: /^\0quasar:api$/ },

      handler(id) {
        if (id === '\0quasar:api') return content
      }
    }
  }
}
