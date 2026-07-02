import { readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { globSync } from 'tinyglobby'
import { green, red, yellow } from 'kolorist'

import { resolveToRoot, rootFolder } from './build.utils.js'

// en-US is the canonical language-pack shape. These optional paths are
// supported by runtime/types even though en-US does not need to declare them.
const optionalPaths = new Set(['rtl', 'date.headerTitle'])
const showIntlWarnings = process.argv.includes('--intl-warnings')

// Some Quasar language ids are legacy/non-BCP-47 ids. Map them only for
// advisory Intl checks; never use these aliases to rewrite Quasar isoName.
const localeAliases = {
  'kur-CKB': 'ckb-IQ',
  mm: 'my',
  'sr-CYR': 'sr-Cyrl'
}

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

function toIntlLocale(isoName) {
  return localeAliases[isoName] ?? isoName
}

function validateStringArray(errors, file, path, value) {
  if (Array.isArray(value) === false) return

  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || entry.length === 0) {
      errors.push(`${file}: ${path}[${index}] must be a non-empty string`)
    }
  })
}

// Hard failures: anything here means a language pack no longer matches the
// shape consumed by Quasar components or documented by the public type.
function validateLanguageShape(errors, file, lang, expectedPaths) {
  const paths = flatten(lang)
  const expectedFile = `${lang.isoName}.js`

  if (expectedFile !== file) {
    errors.push(`${file}: isoName should match filename; found ${lang.isoName}`)
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
  }

  for (const path of paths.keys()) {
    if (
      expectedPaths.has(path) === false &&
      optionalPaths.has(path) === false
    ) {
      errors.push(`${file}: unknown ${path}`)
    }
  }

  for (const path of [
    'date.days',
    'date.daysShort',
    'date.months',
    'date.monthsShort'
  ]) {
    validateStringArray(errors, file, path, paths.get(path))
  }

  if (Number.isInteger(lang.date.firstDayOfWeek) === false) {
    errors.push(`${file}: date.firstDayOfWeek must be an integer`)
  } else if (lang.date.firstDayOfWeek < 0 || lang.date.firstDayOfWeek > 6) {
    errors.push(`${file}: date.firstDayOfWeek must be between 0 and 6`)
  }

  if (typeof lang.date.format24h !== 'boolean') {
    errors.push(`${file}: date.format24h must be a boolean`)
  }
}

// Advisory warnings: Intl data is useful for spotting suspicious locale
// metadata, but it is not a strict contract for Quasar language packs.
function addIntlWarnings(warnings, file, lang) {
  if (showIntlWarnings === false) return

  const locale = toIntlLocale(lang.isoName)

  try {
    const firstDay = new Intl.Locale(locale).weekInfo?.firstDay

    if (firstDay !== void 0) {
      const firstDayOfWeek = firstDay % 7

      if (lang.date.firstDayOfWeek !== firstDayOfWeek) {
        warnings.push(
          `${file}: date.firstDayOfWeek is ${lang.date.firstDayOfWeek}; Intl.Locale(${locale}).weekInfo suggests ${firstDayOfWeek}`
        )
      }
    }
  } catch {}
}

function getLanguage(file) {
  return import(pathToFileURL(file).href).then(module => module.default)
}

const errors = []
const warnings = []
const files = globSync('lang/*.js', { cwd: rootFolder, absolute: true })
const enUS = await getLanguage(resolveToRoot('lang/en-US.js'))
const expectedPaths = flatten(enUS)
const indexJson = JSON.parse(
  await readFile(resolveToRoot('lang/index.json'), 'utf8')
)
const expectedIndex = []

for (const file of files) {
  const lang = await getLanguage(file)
  const filename = basename(file)

  expectedIndex.push({
    isoName: lang.isoName,
    nativeName: lang.nativeName
  })

  validateLanguageShape(errors, filename, lang, expectedPaths)
  addIntlWarnings(warnings, filename, lang)
}

// build.lang.js writes index.json from the same source files. If this drifts,
// language metadata imports and generated typings can disagree with the files.
if (JSON.stringify(indexJson) !== JSON.stringify(expectedIndex)) {
  errors.push(
    `lang/index.json is out of sync; regenerate it from ${join(rootFolder)}`
  )
}

if (warnings.length !== 0) {
  console.log(yellow(`\nLanguage audit warnings (${warnings.length}):`))
  warnings.forEach(warning => console.log(yellow(`- ${warning}`)))
}

if (errors.length !== 0) {
  console.log(red(`\nLanguage audit failed (${errors.length}):`))
  errors.forEach(error => console.log(red(`- ${error}`)))
  process.exit(1)
}

console.log(green(`Language audit passed for ${files.length} language packs.`))
