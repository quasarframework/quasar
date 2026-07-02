import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'

import { green, red } from 'kolorist'
import { globSync } from 'tinyglobby'

import { resolveToRoot, rootFolder } from './build.utils.js'

const sassImportRE = /^@import\s+['"]([^'"]+)['"]/gm
const cssVarDefinitionRE = /(?<![\w-])(--q-[\w-]+)\s*:/g
const cssVarUsageRE = /var\(\s*(--q-[\w-]+)\s*(?:,|\))/g
const registryExportPathRE = /export\s+\{[^}]+\}\s+from\s+['"]([^'"]+)['"]/g

const errors = []

function label(file) {
  return relative(rootFolder, file)
}

function addError(message) {
  errors.push(message)
}

function readText(file) {
  return readFile(file, 'utf8')
}

function getFiles(pattern) {
  return globSync(pattern, {
    cwd: rootFolder,
    absolute: true
  }).sort()
}

function toSassPath(importPath, parentFile) {
  const target = resolve(dirname(parentFile), importPath)
  return target.endsWith('.sass') ? target : `${target}.sass`
}

async function getRegistrySourceDirs(file) {
  const content = await readText(file)
  const dirs = new Set()
  let match

  registryExportPathRE.lastIndex = 0

  while ((match = registryExportPathRE.exec(content)) !== null) {
    dirs.add(dirname(resolve(dirname(file), match[1])))
  }

  return dirs
}

async function auditSassImports() {
  const indexFile = resolveToRoot('src/css/index.sass')
  const content = await readText(indexFile)
  const importedFiles = new Set()
  let match

  sassImportRE.lastIndex = 0

  while ((match = sassImportRE.exec(content)) !== null) {
    const target = toSassPath(match[1], indexFile)

    if (existsSync(target) === false) {
      addError(`${label(indexFile)}: imports missing ${match[1]}`)
    } else {
      importedFiles.add(target)
    }
  }

  await auditPublicSassCoverage(importedFiles)
}

async function auditPublicSassCoverage(importedFiles) {
  const publicDirs = new Set([
    ...(await getRegistrySourceDirs(resolveToRoot('src/components.js'))),
    ...(await getRegistrySourceDirs(resolveToRoot('src/directives.js')))
  ])

  const sassFiles = [
    ...getFiles('src/components/*/*.sass'),
    ...getFiles('src/directives/*/*.sass')
  ]

  sassFiles.forEach(file => {
    if (publicDirs.has(dirname(file)) === false) return

    if (importedFiles.has(file) === false) {
      addError(
        `${label(file)}: public Sass file is not imported by src/css/index.sass`
      )
    }
  })
}

async function auditCssCustomProperties() {
  const files = [
    ...getFiles('src/**/*.sass'),
    ...getFiles('src/**/*.js')
  ].filter(file => file.endsWith('.test.js') === false)

  const defined = new Set()
  const usages = []

  for (const file of files) {
    const content = await readText(file)
    let match

    cssVarDefinitionRE.lastIndex = 0
    while ((match = cssVarDefinitionRE.exec(content)) !== null) {
      defined.add(match[1])
    }

    cssVarUsageRE.lastIndex = 0
    while ((match = cssVarUsageRE.exec(content)) !== null) {
      const endChar = match[0].trimEnd().at(-1)
      usages.push({
        file,
        name: match[1],
        hasFallback: endChar === ','
      })
    }
  }

  usages.forEach(({ file, name, hasFallback }) => {
    if (defined.has(name) === false && hasFallback === false) {
      addError(`${label(file)}: uses ${name} without a definition or fallback`)
    }
  })
}

await auditSassImports()
await auditCssCustomProperties()

if (errors.length !== 0) {
  console.log(red(`\nCSS surface audit errors (${errors.length}):`))
  errors.forEach(error => {
    console.log(red(`- ${error}`))
  })
  process.exit(1)
}

console.log(green('CSS surface audit passed.'))
