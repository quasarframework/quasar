import { searchRecords } from '../artifact/search.js'
import { toolError, toolResult } from '../responses.js'

const memberGroups = ['props', 'slots', 'events', 'methods', 'computedProps']

function normalize(value) {
  return value.trim().toLowerCase()
}

function findMember(group, member) {
  const exact = Object.entries(group).find(
    ([name]) => normalize(name) === normalize(member)
  )
  return exact
}

export function searchQuasarDocs(store, input) {
  const results = searchRecords(store.searchRecords, input.query, {
    kinds: input.kinds,
    limit: input.limit
  }).map(({ record, score }) => ({
    id: record.id,
    type: record.type,
    kind: record.kind,
    title: record.title,
    score,
    canonicalUrl: record.canonicalUrl,
    excerpt: record.text.slice(0, 800)
  }))

  return toolResult(
    store,
    { query: input.query, resultCount: results.length, results },
    input.maxCharacters
  )
}

export function getQuasarDoc(store, input) {
  const entry = store.findDocument(input.id)

  if (entry === void 0) {
    return toolError(`Unknown Quasar documentation page: ${input.id}`)
  }

  const document = store.readJson(entry.path)

  if (input.section) {
    const section = normalize(input.section)
    const chunks = store.readJson(entry.chunks)
    const exactChunk = chunks.find(
      item =>
        normalize(item.heading) === section ||
        normalize(item.id.slice(item.id.indexOf('#') + 1)) === section
    )
    const relatedChunks = chunks.filter(item =>
      normalize(item.heading).includes(section)
    )
    const chunk =
      exactChunk ?? (relatedChunks.length === 1 ? relatedChunks[0] : void 0)

    if (chunk === void 0) {
      return toolError(
        `Unknown section "${input.section}" for ${entry.id}. Available sections: ${chunks
          .map(item => item.heading)
          .join(', ')}`
      )
    }

    return toolResult(store, { document, chunk }, input.maxCharacters)
  }

  return toolResult(
    store,
    { document, markdown: store.read(entry.markdown) },
    input.maxCharacters
  )
}

export function getQuasarApi(store, input) {
  const entry = store.findApi(input.name)

  if (entry === void 0) {
    return toolError(`Unknown Quasar public API: ${input.name}`)
  }

  const api = store.readJson(entry.path)
  const canonicalUrl = `https://quasar.dev/${entry.document.id}`

  if (input.member) {
    const groups = input.memberType ? [input.memberType] : memberGroups

    for (const groupName of groups) {
      const match = findMember(api[groupName] ?? {}, input.member)

      if (match !== void 0) {
        return toolResult(
          store,
          {
            name: entry.name,
            type: api.type,
            canonicalUrl,
            memberType: groupName,
            member: match[0],
            definition: match[1]
          },
          input.maxCharacters
        )
      }
    }

    return toolError(
      `Unknown ${input.memberType ?? 'API'} member "${input.member}" on ${entry.name}`
    )
  }

  if (input.memberType) {
    return toolResult(
      store,
      {
        name: entry.name,
        type: api.type,
        canonicalUrl,
        memberType: input.memberType,
        members: api[input.memberType] ?? {}
      },
      input.maxCharacters
    )
  }

  return toolResult(
    store,
    {
      name: entry.name,
      type: api.type,
      canonicalUrl,
      api
    },
    input.maxCharacters
  )
}

export function getQuasarExamples(store, input) {
  const documentEntry = store.findDocument(input.name)

  if (documentEntry === void 0) {
    return toolError(
      `No Quasar documentation or examples found for: ${input.name}`
    )
  }

  const document = store.readJson(documentEntry.path)
  const metadata = new Map(
    document.examples.map(example => [example.file, example])
  )
  const candidates = documentEntry.examples.map(path => {
    const file = path.slice(path.lastIndexOf('/') + 1)
    const details = metadata.get(file)
    return {
      title: details?.title ?? file.slice(0, -4),
      file,
      resourceUri: `quasar://examples/${encodeURIComponent(path.slice('examples/'.length))}`,
      source: details?.source,
      code: store.read(path)
    }
  })
  const results = input.query
    ? searchRecords(
        candidates.map(example => ({
          ...example,
          type: 'example',
          id: example.file,
          text: `${example.title} ${example.code}`
        })),
        input.query,
        { limit: input.limit }
      ).map(result => result.record)
    : candidates.slice(0, input.limit)

  return toolResult(
    store,
    {
      name: input.name,
      canonicalUrl: `https://quasar.dev/${documentEntry.id}`,
      resultCount: results.length,
      examples: results
    },
    input.maxCharacters
  )
}

export function getQuasarComposable(store, input) {
  const composable = store.findComposable(input.name)

  if (composable === void 0) {
    return toolError(`Unknown public Quasar composable: ${input.name}`)
  }

  const documentEntry = store.documents.get(composable.documentId)
  const document = store.readJson(documentEntry.path)
  const result = {
    name: composable.name,
    canonicalUrl: `https://quasar.dev/${documentEntry.id}`,
    document,
    markdown: store.read(documentEntry.markdown)
  }

  if (input.includeSource) {
    result.implementationSource = store.read(composable.source)
  }

  return toolResult(store, result, input.maxCharacters)
}

export function getQuasarMcpInfo(store, input) {
  return toolResult(
    store,
    {
      server: { name: '@quasar/mcp', version: '0.1.0', transport: 'stdio' },
      coverage: store.manifest.coverage,
      tools: [
        'searchQuasarDocs',
        'getQuasarDoc',
        'getQuasarApi',
        'getQuasarExamples',
        'getQuasarComposable',
        'getQuasarMcpInfo'
      ],
      safety: {
        readOnly: true,
        networkAccess: false,
        projectFileAccess: false
      }
    },
    input.maxCharacters
  )
}
