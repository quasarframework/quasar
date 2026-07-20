function normalize(value) {
  return String(value)
    .normalize('NFKD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, ' ')
    .trim()
}

const ignoredTerms = new Set([
  'a',
  'an',
  'and',
  'for',
  'in',
  'of',
  'on',
  'the',
  'to',
  'use',
  'using',
  'with'
])

const termAliases = {
  autocomplete: ['select'],
  dropdown: ['select'],
  fullscreen: ['appfullscreen'],
  modal: ['dialog'],
  notification: ['notify'],
  sidebar: ['drawer'],
  storage: ['webstorage'],
  timer: ['interval', 'timeout'],
  toast: ['notify'],
  upload: ['uploader'],
  uploader: ['upload'],
  viewport: ['screen']
}

function queryTerms(query) {
  const original = query.split(' ').filter(term => !ignoredTerms.has(term))
  const aliases = original.flatMap(term => termAliases[term] ?? [])
  return [...new Set([...original, ...aliases])]
}

function distance(left, right) {
  if (left === right) return 0
  if (left.length === 0) return right.length
  if (right.length === 0) return left.length

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)

  for (let leftIndex = 0; leftIndex < left.length; leftIndex++) {
    const current = [leftIndex + 1]

    for (let rightIndex = 0; rightIndex < right.length; rightIndex++) {
      current.push(
        Math.min(
          current[rightIndex] + 1,
          previous[rightIndex + 1] + 1,
          previous[rightIndex] + (left[leftIndex] === right[rightIndex] ? 0 : 1)
        )
      )
    }

    previous = current
  }

  return previous.at(-1)
}

function scoreRecord(record, query, terms) {
  const title = normalize(record.title)
  const id = normalize(record.id)
  const text = normalize(record.text)
  let score = 0

  if (id === query || title === query) score += 1000
  if (id.includes(query)) score += 350
  if (title.includes(query)) score += 300
  if (text.includes(query)) score += 100

  const titleWords = title.split(' ')

  for (const term of terms) {
    if (id.split(' ').includes(term)) score += 90
    if (titleWords.includes(term)) score += 80
    if (titleWords.some(word => word.startsWith(term))) score += 40
    if (text.includes(term)) score += 10

    if (
      term.length >= 4 &&
      titleWords.some(
        word =>
          Math.abs(word.length - term.length) <= 2 && distance(word, term) <= 2
      )
    ) {
      score += 180
    }
  }

  return score
}

export function searchRecords(records, query, options = {}) {
  const normalizedQuery = normalize(query)
  const terms = queryTerms(normalizedQuery)
  const kinds = new Set(options.kinds)

  if (terms.length === 0) return []

  return records
    .filter(record => kinds.size === 0 || kinds.has(record.kind))
    .map(record => ({
      record,
      score: scoreRecord(record, normalizedQuery, terms)
    }))
    .filter(result => result.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.record.title.localeCompare(right.record.title)
    )
    .slice(0, options.limit ?? 10)
}
