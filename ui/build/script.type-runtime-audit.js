import { readFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'

import { green, red } from 'kolorist'

import { resolveToRoot, rootFolder } from './build.utils.js'

const registryExportRE =
  /export\s+\{\s*(?:default\s+as\s+)?([A-Za-z$_][\w$]*)(?:\s*,\s*default\s+as\s+([A-Za-z$_][\w$]*))?[^}]*\}\s+from\s+['"]([^'"]+)['"]/g
const exportStarRE = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g
const topLevelTypeExportRE =
  /export\s+(?:declare\s+)?(?:function|const|class|interface|type|namespace)\s+([A-Za-z$_][\w$]*)/g
const namespaceRE =
  /export\s+namespace\s+([A-Za-z$_][\w$]*)\s+\{([\s\S]*?)\n\}/g
const interfaceRE =
  /(?:export\s+)?interface\s+([A-Za-z$_][\w$]*)\s*\{([\s\S]*?)\n\}/g
const interfaceConstRE =
  /export\s+declare\s+const\s+([A-Za-z$_][\w$]*)\s*:\s*([A-Za-z$_][\w$]*)/g
const functionMemberRE =
  /(?:function\s+)?([A-Za-z$_][\w$]*)(?:\s*<[^\n;]+>)?\s*\(/g
const propertyMemberRE = /([A-Za-z$_][\w$]*)\s*:/g

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

function toFilePath(importPath, parentFile) {
  const target = resolve(dirname(parentFile), importPath)
  return target.endsWith('.d.ts') ? target : `${target}.d.ts`
}

function getRegistryExports(content) {
  const entries = []
  let match

  registryExportRE.lastIndex = 0

  while ((match = registryExportRE.exec(content)) !== null) {
    entries.push({
      name: match[2] || match[1],
      path: match[3]
    })
  }

  return entries
}

function getExportedTypeNames(content) {
  const names = new Set()
  let match

  topLevelTypeExportRE.lastIndex = 0

  while ((match = topLevelTypeExportRE.exec(content)) !== null) {
    names.add(match[1])
  }

  return names
}

async function collectTypeExports(file, seen = new Set()) {
  if (seen.has(file) === true) return new Set()
  seen.add(file)

  const content = await readText(file)
  const names = getExportedTypeNames(content)
  const exportStarPaths = getExportStarPaths(content)

  for (const path of exportStarPaths) {
    const childNames = await collectTypeExports(toFilePath(path, file), seen)
    childNames.forEach(name => {
      names.add(name)
    })
  }

  return names
}

function getExportStarPaths(content) {
  const paths = []
  let match

  exportStarRE.lastIndex = 0

  while ((match = exportStarRE.exec(content)) !== null) {
    paths.push(match[1])
  }

  return paths
}

function extractBalancedObject(content, startIndex) {
  let depth = 0
  let quote = null
  let escaped = false

  for (let index = startIndex; index < content.length; index++) {
    const char = content[index]

    if (quote !== null) {
      if (escaped === true) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '{') depth++
    if (char === '}') {
      depth--
      if (depth === 0) return content.slice(startIndex + 1, index)
    }
  }

  return ''
}

function getDefaultObjectKeys(content) {
  const start = content.indexOf('export default {')
  if (start === -1) return []

  const bodyStart = content.indexOf('{', start)
  const body = extractBalancedObject(content, bodyStart)
  const keys = []
  let depth = 0
  let token = ''

  for (const char of body) {
    if (char === '{' || char === '(' || char === '[') depth++
    if (char === '}' || char === ')' || char === ']') depth--

    if (depth === 0 && char === ',') {
      const key = token.trim().split(':')[0].trim()
      if (/^[A-Za-z$_][\w$]*$/.test(key) === true) keys.push(key)
      token = ''
    } else {
      token += char
    }
  }

  const key = token.trim().split(':')[0].trim()
  if (/^[A-Za-z$_][\w$]*$/.test(key) === true) keys.push(key)

  return keys
}

function getTypedMembers(content, exportName) {
  const members = new Set()
  let match

  namespaceRE.lastIndex = 0
  while ((match = namespaceRE.exec(content)) !== null) {
    if (match[1] === exportName) {
      getFunctionMembers(match[2]).forEach(name => members.add(name))
      getPropertyMembers(match[2]).forEach(name => members.add(name))
    }
  }

  const constInterfaceMap = new Map()
  interfaceConstRE.lastIndex = 0
  while ((match = interfaceConstRE.exec(content)) !== null) {
    constInterfaceMap.set(match[1], match[2])
  }

  const targetInterface = constInterfaceMap.get(exportName) || exportName

  interfaceRE.lastIndex = 0
  while ((match = interfaceRE.exec(content)) !== null) {
    if (match[1] === targetInterface) {
      getFunctionMembers(match[2]).forEach(name => members.add(name))
      getPropertyMembers(match[2]).forEach(name => members.add(name))
    }
  }

  return members
}

function getFunctionMembers(content) {
  const names = new Set()
  let match

  functionMemberRE.lastIndex = 0

  while ((match = functionMemberRE.exec(content)) !== null) {
    names.add(match[1])
  }

  return names
}

function getPropertyMembers(content) {
  const names = new Set()
  let match

  propertyMemberRE.lastIndex = 0

  while ((match = propertyMemberRE.exec(content)) !== null) {
    names.add(match[1])
  }

  return names
}

async function auditRegistryTypes({
  runtimeRegistryFile,
  typeEntryFile,
  compareDefaultObjectMembers = false
}) {
  const runtimeContent = await readText(runtimeRegistryFile)
  const typeNames = await collectTypeExports(typeEntryFile)
  const typeEntryContent = await readText(typeEntryFile)

  for (const entry of getRegistryExports(runtimeContent)) {
    if (typeNames.has(entry.name) === false) {
      addError(
        `${label(typeEntryFile)}: missing type export for runtime export "${entry.name}"`
      )
      continue
    }

    if (compareDefaultObjectMembers === true) {
      const runtimeFile = resolve(dirname(runtimeRegistryFile), entry.path)
      const runtimeModuleContent = await readText(runtimeFile)
      const runtimeMembers = getDefaultObjectKeys(runtimeModuleContent)

      if (runtimeMembers.length === 0) continue

      const typeFile = await findTypeFileForExport(typeEntryFile, entry.name)
      const typeContent =
        typeFile === null ? typeEntryContent : await readText(typeFile)
      const typedMembers = getTypedMembers(typeContent, entry.name)

      runtimeMembers.forEach(member => {
        if (typedMembers.has(member) === false) {
          addError(
            `${label(typeFile || typeEntryFile)}: "${entry.name}.${member}" exists at runtime but is missing from types`
          )
        }
      })
    }
  }
}

async function findTypeFileForExport(typeEntryFile, exportName) {
  const content = await readText(typeEntryFile)
  const localNames = getExportedTypeNames(content)

  if (localNames.has(exportName) === true) {
    return typeEntryFile
  }

  for (const path of getExportStarPaths(content)) {
    const childFile = toFilePath(path, typeEntryFile)
    const childNames = await collectTypeExports(childFile)

    if (childNames.has(exportName) === true) {
      return childFile
    }
  }

  return null
}

await auditRegistryTypes({
  runtimeRegistryFile: resolveToRoot('src/composables.js'),
  typeEntryFile: resolveToRoot('types/composables.d.ts')
})

await auditRegistryTypes({
  runtimeRegistryFile: resolveToRoot('src/utils.js'),
  typeEntryFile: resolveToRoot('types/utils.d.ts'),
  compareDefaultObjectMembers: true
})

if (errors.length !== 0) {
  console.log(red(`\nType/runtime audit errors (${errors.length}):`))
  errors.forEach(error => {
    console.log(red(`- ${error}`))
  })
  process.exit(1)
}

console.log(green('Type/runtime audit passed.'))
