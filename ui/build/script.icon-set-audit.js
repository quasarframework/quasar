import { access, readFile, readdir } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { green, red, yellow } from 'kolorist'

import { resolveToRoot } from './build.utils.js'

// material-icons is the canonical icon-set shape. Optional editor entries are
// declared by the public type and fall back at runtime when a pack omits them.
const optionalPaths = new Set([
  'editor.heading1',
  'editor.heading2',
  'editor.heading3',
  'editor.heading4',
  'editor.heading5',
  'editor.heading6',
  'editor.size1',
  'editor.size2',
  'editor.size3',
  'editor.size4',
  'editor.size5',
  'editor.size6',
  'editor.size7'
])

// Some icon sets still carry older, harmless keys. Keep these as warnings so
// cleanup remains reviewable instead of silently changing public files.
const toleratedExtraPaths = new Set(['carousel.thumbnails'])

const showFallbackWarnings = process.argv.includes('--fallback-warnings')

const iconSetFolder = resolveToRoot('icon-set')
const extrasFolder = resolveToRoot('../extras/exports')
const extrasExports = new Map()

const convert = str => str.replaceAll(/(-\w)/g, m => m[1].toUpperCase())
const materialConvert = (str, old, prefix) => {
  if (old !== '') {
    str = str.slice(old.length)
  }

  return (prefix + str).replaceAll(/(_\w)/g, m => m[1].toUpperCase())
}

// Keep this conversion list aligned with build.icon-sets.js. The generated SVG
// icon sets use these rules, so the audit uses the same rules to prove that a
// webfont icon value can be resolved to an exported @quasar/extras SVG icon.
const iconTypes = [
  {
    name: 'material-icons-outlined',
    regex: /^o_/,
    convert: str => materialConvert(str, 'o_', 'outlined_')
  },
  {
    name: 'material-icons-round',
    regex: /^r_/,
    convert: str => materialConvert(str, 'r_', 'round_')
  },
  {
    name: 'material-icons-sharp',
    regex: /^s_/,
    convert: str => materialConvert(str, 's_', 'sharp_')
  },
  {
    name: 'material-symbols-outlined',
    regex: /^sym_o_/,
    convert: str => materialConvert(str, 'sym_o_', 'sym_outlined_')
  },
  {
    name: 'material-symbols-rounded',
    regex: /^sym_r_/,
    convert: str => materialConvert(str, 'sym_r_', 'sym_rounded_')
  },
  {
    name: 'material-symbols-sharp',
    regex: /^sym_s_/,
    convert: str => materialConvert(str, 'sym_s_', 'sym_sharp_')
  },
  {
    name: 'mdi-v7',
    regex: /^mdi-/,
    convert
  },
  {
    name: 'ionicons-v4',
    regex: /^ion-/,
    convert: str =>
      convert(/ion-(md|ios)-/.test(str) ? str : str.replace(/ion-/, 'ion-md-'))
  },
  {
    name: 'fontawesome-v7',
    regex: /^fa[brs] fa-/,
    convert: str => convert(str.replace(' fa-', '-'))
  },
  {
    name: 'eva-icons',
    regex: /^eva-/,
    convert
  },
  {
    name: 'themify',
    regex: /^ti-/,
    convert
  },
  {
    name: 'line-awesome',
    regex: /^la[brs] la-/,
    convert: str =>
      convert(
        (str.startsWith('las la-') ? str + '-solid' : str).replace(
          /^la[brs] la-/,
          'la-'
        )
      )
  },
  {
    name: 'bootstrap-icons',
    regex: /^bi-/,
    convert
  },
  {
    name: 'material-icons',
    regex: /./,
    convert: str => materialConvert(str, '', 'mat_')
  }
]

function getType(value) {
  if (Array.isArray(value)) {
    return `array:${value.length}`
  }

  return typeof value
}

// Compare nested icon-set objects as "section.key" paths. This mirrors the
// language audit approach and catches missing, renamed, or incorrectly typed
// icon entries without maintaining a second schema by hand.
function flatten(obj, prefix = '') {
  const entries = new Map()

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix === '' ? key : `${prefix}.${key}`

    if (
      value !== null &&
      typeof value === 'object' &&
      Array.isArray(value) === false
    ) {
      for (const entry of flatten(value, path)) {
        entries.set(entry[0], entry[1])
      }
    } else {
      entries.set(path, value)
    }
  }

  return entries
}

function isSvgPath(value) {
  // Inline SVG paths are valid Quasar icon values. They usually begin with a
  // path command and contain path syntax, unlike webfont icon names/classes.
  return (
    typeof value === 'string' &&
    /^[Mm][0-9A-Za-z,.\- ]+$/.test(value) === true &&
    /[, ]/.test(value) === true
  )
}

function getExpectedFamily(filename) {
  if (/^fontawesome-v\d/.test(filename)) return 'fontawesome'
  if (filename.startsWith('material-icons') === true) return 'material-icons'
  if (filename.startsWith('material-symbols') === true) {
    return 'material-symbols'
  }
  if (/^mdi-v\d/.test(filename)) return 'mdi'
  if (/^ionicons-v\d/.test(filename)) return 'ionicons'

  return filename
}

function getIconFamily(value) {
  if (typeof value !== 'string') return 'non-string'
  if (isSvgPath(value) === true) return 'inline-svg'
  if (value.startsWith('bi-') === true) return 'bootstrap-icons'
  if (value.startsWith('eva-') === true) return 'eva-icons'
  if (/^fa[a-z-]* fa-/.test(value)) return 'fontawesome'
  if (value.startsWith('ion-') === true) return 'ionicons'
  if (/^la[brs] la-/.test(value)) return 'line-awesome'
  if (value.startsWith('mdi-') === true) return 'mdi'
  if (/^sym_[ors]_/.test(value)) return 'material-symbols'
  if (/^[ors]_/.test(value)) return 'material-icons'
  if (value.startsWith('ti-') === true) return 'themify'
  if (/^[a-z0-9_]+$/.test(value)) return 'material-icons'

  return 'unknown'
}

function getIconSet(file) {
  return import(pathToFileURL(join(iconSetFolder, file)).href).then(
    module => module.default
  )
}

function convertWebfont(name, originalType) {
  const type =
    originalType.regex.test(name) === true
      ? originalType
      : iconTypes.find(item => item.regex.test(name)) || iconTypes[0]

  return {
    importName: type.name,
    variableName: type.convert(name)
  }
}

async function getAvailableExports(importName) {
  if (extrasExports.has(importName) === true) {
    return extrasExports.get(importName)
  }

  try {
    const content = await readFile(
      join(extrasFolder, importName, 'index.js'),
      'utf8'
    )
    const exports = new Set(
      [...content.matchAll(/^export const ([A-Za-z0-9_$]+)/gm)].map(
        match => match[1]
      )
    )

    extrasExports.set(importName, exports)
    return exports
  } catch {
    extrasExports.set(importName, null)
    return null
  }
}

function addFallbackWarnings(warnings, file, paths) {
  if (showFallbackWarnings === false) return

  const filename = basename(file, extname(file))
  const expectedFamily = getExpectedFamily(filename)

  for (const [path, value] of paths) {
    if (path === 'name') continue

    const family = getIconFamily(value)

    if (family !== expectedFamily) {
      warnings.push(
        `${file}: ${path} uses ${family} value ${JSON.stringify(value)}`
      )
    }
  }
}

async function validateIconAvailability(errors, warnings, file, paths) {
  const filename = basename(file, extname(file))
  const originalType = iconTypes.find(item => item.name === filename)

  // Pro and legacy webfont sets rely on external packages that are not present
  // in the current @quasar/extras workspace. They still get shape validation,
  // while generated/current SVG-backed sets are availability checked below.
  if (originalType === void 0) return

  for (const [path, value] of paths) {
    if (path === 'name' || typeof value !== 'string') continue
    if (isSvgPath(value) === true) continue

    const { importName, variableName } = convertWebfont(value, originalType)
    const availableExports = await getAvailableExports(importName)

    if (availableExports === null) {
      warnings.push(
        `${file}: cannot verify ${path}; missing @quasar/extras/${importName}`
      )
    } else if (availableExports.has(variableName) === false) {
      errors.push(
        `${file}: ${path} references ${value}; missing ${variableName} in @quasar/extras/${importName}`
      )
    }
  }
}

async function validateIconSetShape(
  errors,
  warnings,
  file,
  iconSet,
  expectedPaths
) {
  const filename = basename(file, extname(file))
  const expectedName = filename
  const paths = flatten(iconSet)

  if (iconSet.name !== expectedName) {
    errors.push(`${file}: name should match filename; found ${iconSet.name}`)
  }

  for (const [path, expectedValue] of expectedPaths) {
    if (paths.has(path) === false) {
      errors.push(`${file}: missing ${path}`)
      continue
    }

    const value = paths.get(path)
    const type = getType(value)
    const expectedType = getType(expectedValue)

    if (type !== expectedType) {
      errors.push(`${file}: ${path} is ${type}; expected ${expectedType}`)
    }

    if (path !== 'name' && typeof value === 'string' && value.length === 0) {
      errors.push(`${file}: ${path} must be a non-empty string`)
    }
  }

  for (const path of paths.keys()) {
    if (expectedPaths.has(path) === true || optionalPaths.has(path) === true) {
      continue
    }

    const message = `${file}: unknown ${path}`

    if (toleratedExtraPaths.has(path) === true) {
      warnings.push(message)
    } else {
      errors.push(message)
    }
  }

  addFallbackWarnings(warnings, file, paths)
  await validateIconAvailability(errors, warnings, file, paths)
}

async function validateSvgImports(errors, warnings, file, content) {
  const imports = content.matchAll(
    /import\s+\{([\s\S]*?)\}\s+from '@quasar\/extras\/([^']+)'/g
  )

  for (const match of imports) {
    const importNames = match[1]
      .split(',')
      .map(name => name.trim())
      .filter(Boolean)
    const availableExports = await getAvailableExports(match[2])

    if (availableExports === null) {
      warnings.push(`${file}: cannot verify missing @quasar/extras/${match[2]}`)
      continue
    }

    for (const importName of importNames) {
      if (availableExports.has(importName) === false) {
        errors.push(
          `${file}: missing ${importName} in @quasar/extras/${match[2]}`
        )
      }
    }
  }
}

async function validateSvgIconSet(errors, warnings, file) {
  const filename = basename(file, extname(file))
  const webfontFile = `${filename.slice(4)}.js`
  const content = await readFile(join(iconSetFolder, file), 'utf8')
  const hasWebfontSource = await access(join(iconSetFolder, webfontFile))
    .then(() => true)
    .catch(() => false)

  if (hasWebfontSource === true) {
    if (content.includes('DO NOT EDIT THIS FILE') === false) {
      errors.push(`${file}: missing generated file banner`)
    }

    if (
      content.includes(`Edit that file instead (${webfontFile}).`) === false
    ) {
      errors.push(`${file}: generated banner should point to ${webfontFile}`)
    }
  }

  if (content.includes(`name: '${filename}'`) === false) {
    errors.push(`${file}: name should match filename`)
  }

  await validateSvgImports(errors, warnings, file, content)
}

const errors = []
const warnings = []
const iconSetFiles = await readdir(iconSetFolder)
const files = iconSetFiles.filter(file => file.endsWith('.js')).sort()
const webfontFiles = files.filter(file => file.startsWith('svg-') === false)
const svgFiles = files.filter(file => file.startsWith('svg-') === true)
const expectedPaths = flatten(await getIconSet('material-icons.js'))

for (const file of webfontFiles) {
  const iconSet = await getIconSet(file)
  await validateIconSetShape(errors, warnings, file, iconSet, expectedPaths)
}

for (const file of svgFiles) {
  await validateSvgIconSet(errors, warnings, file)
}

if (warnings.length !== 0) {
  console.log(yellow(`\nIcon set audit warnings (${warnings.length}):`))
  warnings.forEach(warning => console.log(yellow(`- ${warning}`)))
}

if (errors.length !== 0) {
  console.log(red(`\nIcon set audit failed (${errors.length}):`))
  errors.forEach(error => console.log(red(`- ${error}`)))
  process.exit(1)
}

console.log(
  green(
    `Icon set audit passed for ${webfontFiles.length} webfont and ${svgFiles.length} SVG icon sets.`
  )
)
