import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'

function resource(store, uri, path, mimeType) {
  return { contents: [{ uri: uri.href, mimeType, text: store.read(path) }] }
}

function decode(value) {
  return decodeURIComponent(Array.isArray(value) ? value[0] : value)
}

export function registerResources(server, store) {
  server.registerResource(
    'quasar-manifest',
    'quasar://manifest',
    {
      title: 'Quasar documentation artifact manifest',
      description: 'Version, provenance, coverage, and artifact inventory.',
      mimeType: 'application/json'
    },
    uri => resource(store, uri, 'manifest.json', 'application/json')
  )

  server.registerResource(
    'quasar-documentation',
    new ResourceTemplate('quasar://docs/{id}', {
      list: () => ({
        resources: store.manifest.documents.map(entry => ({
          uri: `quasar://docs/${encodeURIComponent(entry.id)}`,
          name: entry.title,
          description: `Official Quasar ${entry.kinds.join('/')} documentation (${entry.area})`,
          mimeType: 'text/markdown'
        }))
      })
    }),
    {
      description: 'Official processed Quasar documentation',
      mimeType: 'text/markdown'
    },
    (uri, variables) => {
      const id = decode(variables.id)
      const entry = store.documents.get(id)
      if (entry === void 0) throw new Error(`Unknown Quasar document: ${id}`)
      return resource(store, uri, entry.markdown, 'text/markdown')
    }
  )

  server.registerResource(
    'quasar-api',
    new ResourceTemplate('quasar://api/{name}', {
      list: () => ({
        resources: [...store.apis.values()].map(entry => ({
          uri: `quasar://api/${encodeURIComponent(entry.name)}`,
          name: `${entry.name} API`,
          mimeType: 'application/json'
        }))
      })
    }),
    {
      description: 'Resolved public Quasar API contracts',
      mimeType: 'application/json'
    },
    (uri, variables) => {
      const name = decode(variables.name)
      const entry = store.findApi(name)
      if (entry === void 0) throw new Error(`Unknown Quasar API: ${name}`)
      return resource(store, uri, entry.path, 'application/json')
    }
  )

  server.registerResource(
    'quasar-composable',
    new ResourceTemplate('quasar://composables/{name}', {
      list: () => ({
        resources: store.manifest.composables.map(entry => ({
          uri: `quasar://composables/${encodeURIComponent(entry.name)}`,
          name: `${entry.name} composable`,
          mimeType: 'text/markdown'
        }))
      })
    }),
    {
      description: 'Official public Quasar composable guides',
      mimeType: 'text/markdown'
    },
    (uri, variables) => {
      const name = decode(variables.name)
      const composable = store.findComposable(name)
      if (composable === void 0) throw new Error(`Unknown composable: ${name}`)
      const document = store.documents.get(composable.documentId)
      return resource(store, uri, document.markdown, 'text/markdown')
    }
  )

  server.registerResource(
    'quasar-example',
    new ResourceTemplate('quasar://examples/{path}', {
      list: () => ({
        resources: store.manifest.documents.flatMap(entry =>
          entry.examples.map(path => ({
            uri: `quasar://examples/${encodeURIComponent(path.slice('examples/'.length))}`,
            name: path.slice(path.lastIndexOf('/') + 1),
            description: `Official example for ${entry.title}`,
            mimeType: 'text/x-vue'
          }))
        )
      })
    }),
    { description: 'Official Quasar Vue examples', mimeType: 'text/x-vue' },
    (uri, variables) =>
      resource(store, uri, `examples/${decode(variables.path)}`, 'text/x-vue')
  )
}
