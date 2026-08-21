import { basename } from 'node:path'
import { globSync } from 'tinyglobby'

import {
  logError,
  resolveToRoot,
  rootFolder,
  writeFileIfChanged
} from './build.utils.js'

// en-US is the canonical language-pack shape. These optional paths are
// supported by runtime/types even though en-US does not need to declare them.
const optionalPaths = new Set(['rtl', 'date.headerTitle'])

function getType(value) {
  if (Array.isArray(value)) {
    return `array:${value.length}`
  }

  if (typeof value === 'function') {
    return `function:${value.length}`
  }

  return typeof value
}

// Compare nested language objects as a flat map of "section.key" paths. This
// catches renamed keys, missing keys, wrong function arity, and tuple length
// drift without maintaining a second hand-written schema.
function flatten(obj, prefix = '') {
  const entries = new Map()

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix === '' ? key : `${prefix}.${key}`

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      for (const entry of flatten(value, path)) {
        entries.set(entry[0], entry[1])
      }
    } else {
      entries.set(path, value)
    }
  }

  return entries
}

// Probe values per arity, chosen to walk every plural branch a pack can
// take: 0/1/2/5/20 covers the one/few/many splits the Slavic and Baltic
// packs switch on, and the 3-arity probe is the pagination (start, end,
// total) triplet.
const stringProbes = {
  1: [[0], [1], [2], [5], [20]],
  2: [
    [1, 10],
    [10, 100]
  ],
  3: [
    [1, 10, 100],
    [10, 20, 20]
  ]
}

const pathProbes = {
  'date.headerTitle': [[new Date(2000, 0, 1), { year: 2000, month: 1, day: 1 }]]
}

// Machine-translation batches leave debris that no shape check can see:
// stray padding, doubled spaces, and control characters. These render straight
// into aria-labels, so treat them as build failures.
function validateStringText(file, path, value) {
  if (value !== value.trim()) {
    throw new Error(`${file}: ${path} has leading/trailing whitespace`)
  }

  if (value.includes('  ')) {
    throw new Error(`${file}: ${path} has consecutive spaces`)
  }

  for (const char of value) {
    const code = char.codePointAt(0)

    if (code < 0x20 || code === 0x7f) {
      throw new Error(`${file}: ${path} has a control character`)
    }
  }
}

export function validateStringValues(file, value, path = '') {
  if (typeof value === 'string') {
    validateStringText(file, path, value)
    return
  }

  if (typeof value === 'function') {
    for (const probe of pathProbes[path] || stringProbes[value.length] || []) {
      let result
      try {
        result = value(...probe)
      } catch (err) {
        throw new Error(
          `${file}: ${path}(${probe.join(', ')}) threw: ${err instanceof Error ? err.message : String(err)}`,
          { cause: err }
        )
      }

      if (typeof result !== 'string') {
        throw new TypeError(
          `${file}: ${path}(${probe.join(', ')}) must return a string`
        )
      }

      validateStringText(file, `${path}(${probe.join(', ')})`, result)
    }

    return
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      validateStringValues(file, entry, `${path}[${index}]`)
    })
    return
  }

  if (value !== null && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      validateStringValues(file, entry, path === '' ? key : `${path}.${key}`)
    }
  }
}

function validateStringArray(file, path, value) {
  if (!Array.isArray(value)) return

  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || entry.length === 0) {
      throw new Error(`${file}: ${path}[${index}] must be a non-empty string`)
    }
  })
}

// Hard failures: anything here means a language pack no longer matches the
// shape consumed by Quasar components or documented by the public type.
function validateLanguageShape(file, lang, expectedPaths) {
  const paths = flatten(lang)
  const expectedFile = `${lang.isoName}.js`

  if (expectedFile !== file) {
    throw new Error(
      `${file}: isoName should match filename; found ${lang.isoName}`
    )
  }

  for (const [path, expectedValue] of expectedPaths) {
    if (!paths.has(path)) {
      throw new Error(`${file}: missing ${path}`)
    }

    const value = paths.get(path)
    const type = getType(value)
    const expectedType = getType(expectedValue)

    if (type !== expectedType) {
      throw new Error(`${file}: ${path} is ${type}; expected ${expectedType}`)
    }
  }

  for (const path of paths.keys()) {
    if (!expectedPaths.has(path) && !optionalPaths.has(path)) {
      throw new Error(`${file}: unknown ${path}`)
    }
  }

  for (const path of [
    'date.days',
    'date.daysShort',
    'date.months',
    'date.monthsShort'
  ]) {
    validateStringArray(file, path, paths.get(path))
  }

  validateStringValues(file, lang)

  if (Number.isInteger(lang.date.firstDayOfWeek) === false) {
    throw new TypeError(`${file}: date.firstDayOfWeek must be an integer`)
  } else if (lang.date.firstDayOfWeek < 0 || lang.date.firstDayOfWeek > 6) {
    throw new RangeError(`${file}: date.firstDayOfWeek must be between 0 and 6`)
  }

  if (typeof lang.date.format24h !== 'boolean') {
    throw new TypeError(`${file}: date.format24h must be a boolean`)
  }
}

export async function generate() {
  const languages = []
  try {
    // relative import specifiers keep this working on Windows too
    // (an absolute path is not a valid ESM specifier there)
    const { default: enUS } = await import('../lang/en-US.js')
    const expectedPaths = flatten(enUS)

    const fileList = globSync('lang/*.js', { cwd: rootFolder })

    for (const file of fileList) {
      const lang = await import(`../${file}`).then(module => module.default)

      validateLanguageShape(basename(file), lang, expectedPaths)
      languages.push({
        isoName: lang.isoName,
        nativeName: lang.nativeName
      })
    }

    const langFile = resolveToRoot('lang/index.json')
    const quasarLangIndex = JSON.stringify(languages)

    await writeFileIfChanged(langFile, quasarLangIndex)

    return languages
  } catch (err) {
    logError('build.lang.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
