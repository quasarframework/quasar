const defaultLimit = 12_000

export function withProvenance(store, data) {
  return { artifact: store.provenance, ...data }
}

export function toolResult(store, data, maxCharacters = defaultLimit) {
  const payload = withProvenance(store, data)
  const serialized = JSON.stringify(payload, null, 2)

  if (serialized.length <= maxCharacters) {
    return { content: [{ type: 'text', text: serialized }] }
  }

  const envelope = withProvenance(store, {
    truncated: true,
    totalCharacters: serialized.length,
    returnedCharacters: maxCharacters,
    hint: 'Request a narrower document section, API member, example query, or a larger maxCharacters value.',
    excerpt: serialized.slice(0, Math.max(0, maxCharacters - 600))
  })

  return {
    content: [{ type: 'text', text: JSON.stringify(envelope, null, 2) }]
  }
}

export function toolError(message) {
  return {
    content: [{ type: 'text', text: message }],
    isError: true
  }
}
