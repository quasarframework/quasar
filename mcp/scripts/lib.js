import { createHash } from 'node:crypto'
import { readFile, realpath } from 'node:fs/promises'
import { isAbsolute, relative, resolve, sep } from 'node:path'
import { parse as parseYaml } from 'yaml'

export function parseCliArgs(argv) {
  const args = new Map()

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]

    if (arg.startsWith('--')) {
      args.set(arg.slice(2), argv[index + 1])
      index++
    }
  }

  return args
}

export function assertWithin(parent, candidate, label = 'Path') {
  const path = resolve(candidate)
  const pathRelativeToParent = relative(resolve(parent), path)

  if (
    pathRelativeToParent === '..' ||
    pathRelativeToParent.startsWith(`..${sep}`) ||
    isAbsolute(pathRelativeToParent)
  ) {
    throw new Error(`${label} must remain inside ${resolve(parent)}: ${path}`)
  }

  return path
}

export function resolveSourceRoot(candidate) {
  return realpath(resolve(candidate))
}

export function readUtf8(path) {
  return readFile(path, 'utf8')
}

export function sha256(content) {
  return createHash('sha256').update(content).digest('hex')
}

export function parseFrontMatter(source) {
  if (!source.startsWith('---\n')) {
    return { attributes: {}, body: source }
  }

  const end = source.indexOf('\n---\n', 4)

  if (end === -1) {
    throw new Error('Unterminated Markdown front matter')
  }

  const attributes = parseYaml(source.slice(4, end)) ?? {}

  return {
    attributes,
    body: source.slice(end + 5)
  }
}

export function extractDocExamples(markdown) {
  return [...markdown.matchAll(/<DocExample\b([^>]*)\/>/g)]
    .map(match => parseTagAttributes(match[1]))
    .filter(attributes => attributes.title && attributes.file)
    .map(attributes => ({ title: attributes.title, file: attributes.file }))
}

export function extractDocApis(markdown) {
  return [...markdown.matchAll(/<DocApi\b([^>]*)\/>/g)]
    .map(match => parseTagAttributes(match[1]).file)
    .filter(Boolean)
}

function parseTagAttributes(source) {
  return Object.fromEntries(
    [...source.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [
      match[1],
      match[2]
    ])
  )
}

export function slugify(value) {
  return value
    .replaceAll(/<[^>]+>/g, '')
    .normalize('NFKD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '')
}

export function createMarkdownChunks(markdown, document) {
  const chunks = []
  let hierarchy = []
  let current = {
    heading: document.title,
    anchor: '',
    level: 1,
    lines: []
  }

  const flush = () => {
    const content = current.lines.join('\n').trim()

    if (content.length === 0) return

    const exampleReferences = extractDocExamples(content)
    const apiReferences = extractDocApis(content)
    const breadcrumb = [
      ...hierarchy.slice(0, current.level - 1),
      current.heading
    ]

    chunks.push({
      id: `${document.id}#${current.anchor || 'overview'}`,
      documentId: document.id,
      heading: current.heading,
      breadcrumb,
      level: current.level,
      canonicalUrl:
        document.canonicalUrl + (current.anchor ? `#${current.anchor}` : ''),
      content: content
        .replaceAll(/<DocApi\s+file="([^"]+)"\s*\/>/g, 'API reference: $1')
        .replaceAll(
          /<DocExample\s+title="([^"]+)"\s+file="([^"]+)"\s*\/>/g,
          'Example: $1 ($2.vue)'
        ),
      apiReferences,
      exampleReferences: exampleReferences.map(example => ({
        title: example.title,
        file: `${example.file}.vue`
      }))
    })
  }

  for (const line of markdown.split('\n')) {
    const match = /^(#{2,6})\s+(.+)$/.exec(line)

    if (match === null) {
      current.lines.push(line)
      continue
    }

    flush()

    const level = match[1].length
    const heading = match[2]
    hierarchy = hierarchy.slice(0, level - 1)
    hierarchy[level - 2] = heading
    current = {
      heading,
      anchor: slugify(heading),
      level,
      lines: []
    }
  }

  flush()
  return chunks
}
