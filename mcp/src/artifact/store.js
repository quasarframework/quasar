import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function normalize(value) {
  return value.trim().toLowerCase()
}

export class ArtifactStore {
  constructor(root = resolve(import.meta.dirname, '../../generated')) {
    this.root = root
    this.manifest = readJson(join(root, 'manifest.json'))
    this.documents = new Map(
      this.manifest.documents.map(entry => [entry.id, entry])
    )
    this.documentsByName = new Map()
    this.apis = new Map()
    this.composables = new Map(
      this.manifest.composables.map(entry => [normalize(entry.name), entry])
    )
    this.cache = new Map()

    for (const entry of this.manifest.documents) {
      this.documentsByName.set(normalize(entry.id), entry)
      this.documentsByName.set(normalize(entry.title), entry)

      for (const path of entry.api) {
        if (path.endsWith('.json')) {
          const name = path.slice(path.lastIndexOf('/') + 1, -5)
          this.apis.set(normalize(name), { name, path, document: entry })
          this.documentsByName.set(normalize(name), entry)
        }
      }
    }

    this.searchRecords = readFileSync(
      join(root, this.manifest.searchIndex),
      'utf8'
    )
      .trim()
      .split('\n')
      .map(line => this.#enrichSearchRecord(JSON.parse(line)))
  }

  #enrichSearchRecord(record) {
    if (record.type === 'documentation') {
      const document = this.documents.get(record.id.split('#')[0])
      return { ...record, kind: document?.kinds[0], area: document?.area }
    }

    if (record.type === 'api') {
      const api = this.findApi(record.id.split('.')[0])
      return {
        ...record,
        kind: api?.document.kinds[0],
        area: api?.document.area
      }
    }

    if (record.type === 'example') {
      const document = this.findDocument(record.id.split('.example.')[0])
      return { ...record, kind: document?.kinds[0], area: document?.area }
    }

    return record
  }

  read(path) {
    if (this.cache.has(path)) return this.cache.get(path)

    const absolutePath = resolve(this.root, path)

    if (
      absolutePath !== this.root &&
      !absolutePath.startsWith(`${this.root}/`)
    ) {
      throw new Error(`Artifact path escapes its root: ${path}`)
    }

    const content = readFileSync(absolutePath, 'utf8')
    this.cache.set(path, content)
    return content
  }

  readJson(path) {
    return JSON.parse(this.read(path))
  }

  findDocument(name) {
    return this.documentsByName.get(normalize(name))
  }

  findApi(name) {
    return this.apis.get(normalize(name))
  }

  findComposable(name) {
    return this.composables.get(normalize(name))
  }

  get provenance() {
    return {
      quasarVersion: this.manifest.products.quasar,
      sourceCommit: this.manifest.source.commit,
      sourceCommittedAt: this.manifest.source.committedAt
    }
  }
}
