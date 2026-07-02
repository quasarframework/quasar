import { readFile } from 'node:fs/promises'
import { basename, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

import { green, red, yellow } from 'kolorist'
import { globSync } from 'tinyglobby'
import { merge } from 'webpack-merge'

import {
  camelCase,
  capitalize,
  kebabCase,
  resolveToRoot,
  rootFolder
} from './build.utils.js'

const componentJsonGlob = 'src/components/*/Q*.json'
const componentJsGlob = 'src/components/*/Q*.js'

const slotRE = /slots\[\s*['"](\S+)['"]\s*\]|slots\.([A-Za-z]+)/g
const emitRE = /emit\(\s*['"](\S+)['"]/g

const apiIgnoreValueRE = /^# /
const arrayRE = /(\[.*\])/
const objectRE = /(\{.*\})/
const functionRE = /^(\s*\(\s*\)\s*=>\s*).+/
const typeofRE = /typeof\s+[a-zA-Z0-9$_]+\s+===\s+'([a-zA-Z]+)'/

const runtimePropTypeToAny = new Set(['File', 'FileList', 'Element'])
const runtimePropTypeExceptions = new Set(['null', 'undefined'])
const showSourceWarnings = process.argv.includes('--source-warnings')

const errors = []
const warnings = []
const extendApi = await readJson(resolveToRoot('src/api.extends.json'))

global.__QUASAR_SSR__ = true
global.__QUASAR_SSR_SERVER__ = true
global.__QUASAR_SSR_CLIENT__ = false
global.__QUASAR_SSR_PWA__ = false
global.__QUASAR_VERSION__ = '0.0.0-api-audit'

function componentLabel(file) {
  return relative(rootFolder, file)
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

async function readApiWithMixins(file) {
  let api = await readJson(file)

  if (Array.isArray(api.mixins) === true) {
    for (const mixin of api.mixins) {
      const mixinApi = await readApiWithMixins(
        resolveToRoot('src', `${mixin}.json`)
      )
      api = merge({}, mixinApi, api)
    }
  }

  const { mixins, ...finalApi } = api
  return resolveExtends(finalApi)
}

function resolveEntryExtends(section, entry) {
  if (Object(entry) !== entry) return entry

  let resolved = { ...entry }

  if (typeof resolved.extends === 'string') {
    const source = extendApi[section]?.[resolved.extends]

    if (source === void 0) {
      addError(
        section,
        `API entry extends unknown "${resolved.extends}" from section "${section}"`
      )
    } else {
      resolved = merge({}, source, resolved)
    }

    delete resolved.extends
  }

  if (Array.isArray(resolved.__delete) === true) {
    resolved.__delete.forEach(key => {
      delete resolved[key]
    })
    delete resolved.__delete
  }

  return resolved
}

function resolveExtends(api) {
  for (const section of [
    'props',
    'events',
    'slots',
    'methods',
    'computedProps'
  ]) {
    if (Object(api[section]) !== api[section]) continue

    for (const key in api[section]) {
      api[section][key] = resolveEntryExtends(section, api[section][key])
    }
  }

  return api
}

function parseRuntimeType(runtimeConstructor) {
  if (runtimeConstructor === null) return 'null'
  if (runtimeConstructor === void 0) return 'undefined'

  const match = runtimeConstructor.toString().match(/function (\w+)\(/)
  return match?.[1] ?? 'Any'
}

function extractRuntimePropAttrs(runtimeProp) {
  if (Array.isArray(runtimeProp) === true) {
    return {
      runtimeTypes: runtimeProp.map(parseRuntimeType).sort(),
      isRuntimeRequired: false,
      hasRuntimeDefault: false
    }
  }

  const directType = parseRuntimeType(runtimeProp)
  if (directType !== 'Any') {
    return {
      runtimeTypes: [directType],
      isRuntimeRequired: false,
      hasRuntimeDefault: false
    }
  }

  if (Object(runtimeProp) !== runtimeProp) {
    return {
      runtimeTypes: ['Any'],
      isRuntimeRequired: false,
      hasRuntimeDefault: false
    }
  }

  let runtimeTypes

  if (Array.isArray(runtimeProp.type) === true) {
    runtimeTypes = runtimeProp.type.map(parseRuntimeType)
  } else if (runtimeProp.type !== void 0) {
    runtimeTypes = [parseRuntimeType(runtimeProp.type)]
  } else if (runtimeProp.validator !== void 0) {
    // Validators are not always machine-readable, but Quasar commonly uses
    // typeof/Object/Array checks. Extract those hints when present.
    runtimeTypes = []

    const fn = runtimeProp.validator.toString()
    const match = fn.match(typeofRE)

    if (match !== null) {
      runtimeTypes.push(capitalize(match[1]))
    }

    if (fn.includes('Array.isArray') === true) {
      runtimeTypes.push('Array')
    }

    if (fn.includes('Object') === true) {
      runtimeTypes.push('Object')
    }
  }

  if (runtimeTypes === void 0 || runtimeTypes.length === 0) {
    runtimeTypes = ['Any']
  } else if (runtimeTypes.includes('Any') === true) {
    runtimeTypes = ['Any']
  } else {
    runtimeTypes.sort()
  }

  return {
    runtimeTypes,
    isRuntimeRequired: runtimeProp.required === true,
    hasRuntimeDefault: Object.hasOwn(runtimeProp, 'default'),
    runtimeDefaultValue: runtimeProp.default
  }
}

function extractRuntimeDefinablePropTypes(apiTypes) {
  if (apiTypes.includes('Any') === true) {
    return ['Any']
  }

  return apiTypes.some(type => runtimePropTypeToAny.has(type) === true)
    ? ['Any']
    : apiTypes
        .filter(type => runtimePropTypeExceptions.has(type) === false)
        .sort()
}

function encodeDefaultValue(val, isFunction) {
  if (typeof val === 'string') return `'${val}'`

  if (typeof val === 'function') {
    const fn = val.toString()

    if (isFunction === true) return fn

    const arrayMatch = fn.match(arrayRE)
    if (arrayMatch !== null) return arrayMatch[1]

    const objMatch = fn.match(objectRE)
    if (objMatch !== null) return objMatch[1]

    const arrowMatch = fn.match(functionRE)
    if (arrowMatch !== null) return fn.slice(arrowMatch[1].length)
  }

  return String(val)
}

function getStaticNames(content, regex, normalize = name => name) {
  const names = new Set()
  let match

  regex.lastIndex = 0

  while ((match = regex.exec(content)) !== null) {
    names.add(normalize(match[1] || match[2]))
  }

  return names
}

function findMatchingBrace(content, startIndex) {
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
      if (depth === 0) return index
    }
  }

  return -1
}

function splitTopLevelObjectEntries(content) {
  const entries = []
  let start = 0
  let depth = 0
  let quote = null
  let escaped = false

  for (let index = 0; index < content.length; index++) {
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

    if (char === '(' || char === '[' || char === '{') depth++
    if (char === ')' || char === ']' || char === '}') depth--

    if (char === ',' && depth === 0) {
      entries.push(content.slice(start, index).trim())
      start = index + 1
    }
  }

  entries.push(content.slice(start).trim())
  return entries.filter(Boolean)
}

function getExposedMethodNames(content) {
  const names = new Set()
  const assignRE = /Object\.assign\(\s*(?:vm\.)?proxy\s*,\s*\{/g
  let match

  while ((match = assignRE.exec(content)) !== null) {
    const bodyStart = match.index + match[0].length - 1
    const bodyEnd = findMatchingBrace(content, bodyStart)

    if (bodyEnd === -1) continue

    splitTopLevelObjectEntries(content.slice(bodyStart + 1, bodyEnd)).forEach(
      entry => {
        const key = entry.split(':')[0].trim()

        if (/^[A-Za-z$_][\w$]*$/.test(key) === true) {
          names.add(key)
        }
      }
    )
  }

  return names
}

function addError(file, message) {
  errors.push(`${componentLabel(file)}: ${message}`)
}

function addWarning(file, message) {
  warnings.push(`${componentLabel(file)}: ${message}`)
}

function auditProps(file, apiProps, runtimeProps) {
  for (const runtimePropName in runtimeProps) {
    const apiPropName = kebabCase(runtimePropName)
    const apiEntry = apiProps[apiPropName]

    if (runtimePropName.includes('-') === true) {
      addError(file, `runtime prop "${runtimePropName}" should be camelCase`)
    }

    if (/^on[A-Z]/.test(runtimePropName) === true) {
      continue
    }

    if (apiEntry === void 0) {
      addError(
        file,
        `missing JSON prop "${apiPropName}" found in runtime props as "${runtimePropName}"`
      )
      continue
    }

    if (apiEntry.passthrough === 'child') {
      if (
        Object(runtimeProps[runtimePropName]) !==
          runtimeProps[runtimePropName] ||
        Object.keys(runtimeProps[runtimePropName]).length !== 0
      ) {
        addError(
          file,
          `JSON prop "${apiPropName}" is passthrough="child" but runtime prop is not an empty object`
        )
      }

      continue
    }

    const apiTypes =
      Array.isArray(apiEntry.type) === true ? apiEntry.type : [apiEntry.type]

    const {
      runtimeTypes,
      isRuntimeRequired,
      hasRuntimeDefault,
      runtimeDefaultValue
    } = extractRuntimePropAttrs(runtimeProps[runtimePropName])

    const definableApiTypes = extractRuntimeDefinablePropTypes(apiTypes)

    if (
      definableApiTypes.length !== runtimeTypes.length ||
      definableApiTypes.every((type, index) => type === runtimeTypes[index]) ===
        false
    ) {
      addError(
        file,
        `JSON prop "${apiPropName}" type ${JSON.stringify(apiTypes)} does not match runtime ${JSON.stringify(runtimeTypes)}`
      )
    }

    if (isRuntimeRequired === true && apiEntry.required !== true) {
      addError(file, `JSON prop "${apiPropName}" is missing required=true`)
    }

    if (hasRuntimeDefault === true) {
      const isRuntimeFunction =
        runtimeTypes.length === 1 && runtimeTypes[0] === 'Function'
      const encodedValue = encodeDefaultValue(
        runtimeDefaultValue,
        isRuntimeFunction
      )

      if (Object.hasOwn(apiEntry, 'default') === false) {
        addError(
          file,
          `JSON prop "${apiPropName}" is missing default "${encodedValue}"`
        )
      } else if (
        apiIgnoreValueRE.test(apiEntry.default) === false &&
        apiEntry.__runtimeDefault !== true &&
        apiEntry.default !== encodedValue
      ) {
        addError(
          file,
          `JSON prop "${apiPropName}" default is "${apiEntry.default}" but runtime is "${encodedValue}"`
        )
      }
    } else if (
      apiEntry.__runtimeDefault !== true &&
      Object.hasOwn(apiEntry, 'default') === true
    ) {
      addError(
        file,
        `JSON prop "${apiPropName}" has a default but runtime does not`
      )
    }
  }

  for (const apiPropName in apiProps) {
    const apiEntry = apiProps[apiPropName]
    const runtimePropName = camelCase(apiPropName)

    if (apiEntry.passthrough === true) continue

    if (runtimeProps[runtimePropName] === void 0) {
      addError(
        file,
        `JSON prop "${apiPropName}" is not present in runtime props; mark passthrough if intentional`
      )
    }
  }
}

function auditEvents(file, apiEvents, runtimeProps, runtimeEmits, content) {
  const emittedNames = getStaticNames(content, emitRE, name =>
    kebabCase(name.at(0).toLowerCase() + name.slice(1))
  )

  for (const runtimeEmitName of runtimeEmits) {
    if (apiEvents[kebabCase(runtimeEmitName)] === void 0) {
      addError(
        file,
        `missing JSON event "${kebabCase(runtimeEmitName)}" found in runtime emits`
      )
    }

    if (runtimeEmitName.includes('-') === true) {
      addError(file, `runtime emit "${runtimeEmitName}" should be camelCase`)
    }
  }

  for (const emittedName of emittedNames) {
    if (apiEvents[emittedName] === void 0) {
      addError(
        file,
        `missing JSON event "${emittedName}" found in emit() usage`
      )
    }
  }

  for (const apiEventName in apiEvents) {
    const apiEntry = apiEvents[apiEventName]
    const runtimeEmitName = camelCase(apiEventName)
    const runtimePropName = `on${capitalize(runtimeEmitName)}`

    if (apiEntry.passthrough === true) continue

    if (
      runtimeEmits.includes(runtimeEmitName) === false &&
      runtimeProps[runtimePropName] === void 0 &&
      emittedNames.has(apiEventName) === false
    ) {
      addError(
        file,
        `JSON event "${apiEventName}" is not present in runtime emits, runtime props, or emit() usage`
      )
    }
  }
}

function auditSlots(file, apiSlots, content) {
  const sourceSlots = getStaticNames(content, slotRE, name =>
    name.replaceAll(/(\${.+})/g, '[name]')
  )

  for (const slotName of sourceSlots) {
    if (apiSlots[slotName] === void 0) {
      addError(file, `missing JSON slot "${slotName}" found in source usage`)
    }
  }
}

function auditMethods(file, apiMethods, content) {
  const exposedMethods = getExposedMethodNames(content)

  for (const methodName of exposedMethods) {
    if (apiMethods[methodName] === void 0) {
      addError(
        file,
        `missing JSON method "${methodName}" found in Object.assign(proxy, ...)`
      )
    }
  }
}

async function auditComponentJson(file) {
  const jsFile = file.replace(/\.json$/, '.js')
  const content = await readFile(jsFile, 'utf8')
  const api = await readApiWithMixins(file)

  if (api.meta?.docsUrl === void 0) {
    addError(file, 'missing meta.docsUrl')
  }

  let RuntimeComponent

  try {
    const runtimeModule = await import(pathToFileURL(jsFile).href)
    RuntimeComponent = runtimeModule.default
  } catch (err) {
    addError(file, `failed to import runtime component: ${err.message}`)
    return
  }

  auditProps(file, api.props || {}, RuntimeComponent.props || {})
  auditEvents(
    file,
    api.events || {},
    RuntimeComponent.props || {},
    RuntimeComponent.emits || [],
    content
  )
  auditSlots(file, api.slots || {}, content)
  auditMethods(file, api.methods || {}, content)
}

function auditComponentFileCoverage(jsonFiles, jsFiles) {
  const jsonNames = new Set(jsonFiles.map(file => basename(file, '.json')))

  for (const jsFile of jsFiles) {
    const name = basename(jsFile, '.js')
    if (jsonNames.has(name) === false) {
      addWarning(jsFile, 'runtime component has no adjacent API JSON file')
    }
  }
}

const componentJsonFiles = globSync(componentJsonGlob, {
  cwd: rootFolder,
  absolute: true
}).sort()

const componentJsFiles = globSync(componentJsGlob, {
  cwd: rootFolder,
  absolute: true
})
  .filter(file => file.endsWith('.test.js') === false)
  .sort()

auditComponentFileCoverage(componentJsonFiles, componentJsFiles)

for (const file of componentJsonFiles) {
  await auditComponentJson(file)
}

if (showSourceWarnings === true && warnings.length !== 0) {
  console.log(yellow(`\nAPI audit warnings (${warnings.length}):`))
  warnings.forEach(warning => {
    console.log(yellow(`- ${warning}`))
  })
}

if (errors.length !== 0) {
  console.log(red(`\nAPI audit errors (${errors.length}):`))
  errors.forEach(error => {
    console.log(red(`- ${error}`))
  })
  process.exit(1)
} else if (showSourceWarnings === false && warnings.length !== 0) {
  console.log(
    yellow(
      `API audit found ${warnings.length} source-scan warning${warnings.length === 1 ? '' : 's'}; run with --source-warnings to inspect them.`
    )
  )
}

console.log(
  green(
    `API audit passed for ${componentJsonFiles.length} component API files.`
  )
)
