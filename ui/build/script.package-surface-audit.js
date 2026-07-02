import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { green, red } from 'kolorist'
import { globSync } from 'tinyglobby'

import { resolveToRoot, rootFolder } from './build.utils.js'

const registryExportRE =
  /export\s+\{\s*(?:default\s+as\s+)?([A-Za-z$_][\w$]*)[^}]*\}\s+from\s+['"]([^'"]+)['"]/g
const typeUnionRE = /export\s+type\s+QuasarIconSets\s*=\s*([\s\S]*?);/
const typeLiteralRE = /"([^"]+)"/g

const errors = []

function label(file) {
  return relative(rootFolder, file)
}

function addError(message) {
  errors.push(message)
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

function readText(file) {
  return readFile(file, 'utf8')
}

function getJsFiles(pattern) {
  return globSync(pattern, {
    cwd: rootFolder,
    absolute: true
  })
    .filter(file => file.endsWith('.test.js') === false)
    .sort()
}

function getRegistryExports(content) {
  const entries = []
  const names = new Set()
  let match

  registryExportRE.lastIndex = 0

  while ((match = registryExportRE.exec(content)) !== null) {
    const [, name, path] = match

    if (names.has(name) === true) {
      addError(`duplicate registry export "${name}"`)
    }

    names.add(name)
    entries.push({ name, path })
  }

  return entries
}

async function auditRegistryFile(file, expectedFiles = []) {
  const content = await readText(file)
  const entries = getRegistryExports(content)
  const exportedFiles = new Set()

  for (const entry of entries) {
    const target = resolve(dirname(file), entry.path)
    const targetFile = target.endsWith('.js') ? target : `${target}.js`

    if (existsSync(targetFile) === false) {
      addError(
        `${label(file)}: export "${entry.name}" points to missing ${entry.path}`
      )
      continue
    }

    exportedFiles.add(targetFile)
  }

  expectedFiles.forEach(expectedFile => {
    if (exportedFiles.has(expectedFile) === false) {
      addError(
        `${label(file)}: missing export for public source file ${label(expectedFile)}`
      )
    }
  })
}

function getExpectedPublicComponentFiles() {
  return getJsFiles('src/components/*/Q*.js')
}

function getExpectedPublicDirectiveFiles() {
  return getJsFiles('src/directives/*/*.js')
}

function getExpectedPublicPluginFiles() {
  return getJsFiles('src/plugins/*/*.js').filter(
    file => file.includes('/private.') === false
  )
}

function getExpectedPublicComposableFiles() {
  return getJsFiles('src/composables/use-*/*.js').filter(
    file => file.includes('/private.') === false
  )
}

async function auditPackageManifest() {
  const packageFile = resolveToRoot('package.json')
  const pkg = await readJson(packageFile)

  for (const entry of pkg.files || []) {
    const target = resolveToRoot(entry)

    if (entry === 'dist' && existsSync(target) === false) {
      continue
    }

    if (existsSync(target) === false) {
      addError(`${label(packageFile)}: files entry "${entry}" does not exist`)
    }
  }

  for (const field of ['module', 'typings', 'unpkg', 'jsdelivr']) {
    const value = pkg[field]
    if (typeof value !== 'string') continue

    const target = resolveToRoot(value)

    if (
      value.startsWith('dist/') &&
      existsSync(resolveToRoot('dist')) === false
    ) {
      continue
    }

    if (existsSync(target) === false) {
      addError(`${label(packageFile)}: ${field} points to missing ${value}`)
    }
  }

  for (const [name, entry] of Object.entries(pkg.exports || {})) {
    if (typeof entry === 'string') {
      if (
        entry.includes('*') === false &&
        existsSync(resolveToRoot(entry)) === false
      ) {
        addError(
          `${label(packageFile)}: export "${name}" points to missing ${entry}`
        )
      }
      continue
    }

    for (const [condition, targetPath] of Object.entries(entry)) {
      if (
        targetPath.startsWith('./dist/') &&
        existsSync(resolveToRoot('dist')) === false
      ) {
        continue
      }

      if (existsSync(resolveToRoot(targetPath)) === false) {
        addError(
          `${label(packageFile)}: export "${name}" condition "${condition}" points to missing ${targetPath}`
        )
      }
    }
  }
}

async function auditLangIndex() {
  const langFiles = getJsFiles('lang/*.js')
  const indexFile = resolveToRoot('lang/index.json')
  const index = await readJson(indexFile)
  const indexByIsoName = new Map(index.map(entry => [entry.isoName, entry]))
  const seen = new Set()

  for (const file of langFiles) {
    const lang = await import(pathToFileURL(file).href).then(
      module => module.default
    )
    const entry = indexByIsoName.get(lang.isoName)

    if (entry === void 0) {
      addError(`${label(indexFile)}: missing index entry for ${label(file)}`)
      continue
    }

    seen.add(lang.isoName)

    if (entry.nativeName !== lang.nativeName) {
      addError(
        `${label(indexFile)}: nativeName for ${lang.isoName} is "${entry.nativeName}" but source is "${lang.nativeName}"`
      )
    }
  }

  for (const entry of index) {
    if (seen.has(entry.isoName) === false) {
      addError(`${label(indexFile)}: stale index entry "${entry.isoName}"`)
    }
  }
}

async function auditIconSetTypeUnion() {
  const iconFiles = getJsFiles('icon-set/*.js').map(file =>
    label(file)
      .replace(/^icon-set\//, '')
      .replace(/\.js$/, '')
  )

  const content = await readText(resolveToRoot('types/icon-set.d.ts'))
  const union = content.match(typeUnionRE)

  if (union === null) {
    addError('types/icon-set.d.ts: missing QuasarIconSets union')
    return
  }

  const typeNames = new Set()
  let match

  typeLiteralRE.lastIndex = 0

  while ((match = typeLiteralRE.exec(union[1])) !== null) {
    typeNames.add(match[1])
  }

  iconFiles.forEach(name => {
    if (typeNames.has(name) === false) {
      addError(`types/icon-set.d.ts: missing QuasarIconSets member "${name}"`)
    }
  })

  typeNames.forEach(name => {
    if (iconFiles.includes(name) === false) {
      addError(`types/icon-set.d.ts: stale QuasarIconSets member "${name}"`)
    }
  })
}

await auditPackageManifest()
await auditRegistryFile(
  resolveToRoot('src/components.js'),
  getExpectedPublicComponentFiles()
)
await auditRegistryFile(
  resolveToRoot('src/directives.js'),
  getExpectedPublicDirectiveFiles()
)
await auditRegistryFile(
  resolveToRoot('src/plugins.js'),
  getExpectedPublicPluginFiles()
)
await auditRegistryFile(
  resolveToRoot('src/composables.js'),
  getExpectedPublicComposableFiles()
)
await auditRegistryFile(resolveToRoot('src/utils.js'))
await auditLangIndex()
await auditIconSetTypeUnion()

if (errors.length !== 0) {
  console.log(red(`\nPackage surface audit errors (${errors.length}):`))
  errors.forEach(error => {
    console.log(red(`- ${error}`))
  })
  process.exit(1)
}

console.log(green('Package surface audit passed.'))
