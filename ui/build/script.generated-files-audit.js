import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { globSync } from 'tinyglobby'

const rootDir = resolve(import.meta.dirname, '..')
const buildDir = resolve(rootDir, 'build')
const iconSetDir = resolve(rootDir, 'icon-set')
const langDir = resolve(rootDir, 'lang')

const errors = []

const staticImportLineRE =
  /^\s*import\s+(?:[\s\S]*?\s+from\s+)?(['"])(\.[^'"]+)\1/
const dynamicImportRE = /\bimport\s*\(\s*(['"])(\.[^'"]+)\1\s*\)/
const packageScriptRE = /\bnode\s+(build\/[^\s&|]+\.js)\b/g
const newlineRE = /[\n\r]+/g

function toDisplayPath(file) {
  return file.slice(rootDir.length + 1)
}

function addError(message) {
  errors.push(message)
}

function normalizeContent(content) {
  return content.trim().split(newlineRE).join('\n')
}

function resolveLocalImport(importer, rawPath) {
  const importPath = rawPath.split('?')[0]
  const basePath = resolve(dirname(importer), importPath)
  const candidates = [basePath, `${basePath}.js`, resolve(basePath, 'index.js')]

  return candidates.find(candidate => existsSync(candidate)) ?? null
}

async function auditPackageScripts() {
  const packageJson = JSON.parse(
    await readFile(resolve(rootDir, 'package.json'), 'utf8')
  )

  for (const [scriptName, scriptCommand] of Object.entries(
    packageJson.scripts || {}
  )) {
    for (const match of scriptCommand.matchAll(packageScriptRE)) {
      const scriptFile = resolve(rootDir, match[1])

      if (!existsSync(scriptFile)) {
        addError(
          `package.json script "${scriptName}" references missing ${match[1]}`
        )
      }
    }
  }
}

async function auditBuildImports() {
  const buildFiles = globSync('*.js', {
    cwd: buildDir,
    absolute: true
  })

  for (const buildFile of buildFiles) {
    const content = await readFile(buildFile, 'utf8')

    for (const line of content.split('\n')) {
      const match = staticImportLineRE.exec(line) ?? dynamicImportRE.exec(line)
      if (match === null) continue

      const rawPath = match[2]
      if (resolveLocalImport(buildFile, rawPath) === null) {
        addError(
          `${toDisplayPath(buildFile)} imports missing local module "${rawPath}"`
        )
      }
    }
  }
}

async function auditLangIndex() {
  const languages = []
  const files = globSync('*.js', {
    cwd: langDir,
    absolute: true
  })

  for (const file of files) {
    const lang = await import(file).then(module => module.default)
    languages.push({
      isoName: lang.isoName,
      nativeName: lang.nativeName
    })
  }

  const expected = JSON.stringify(languages)
  const actual = await readFile(resolve(langDir, 'index.json'), 'utf8')

  if (actual !== expected) {
    addError('lang/index.json is not in sync with lang/*.js language metadata')
  }
}

function convert(str) {
  return str.replaceAll(/(-\w)/g, match => match[1].toUpperCase())
}

function materialConvert(str, oldPrefix, newPrefix) {
  if (oldPrefix !== '') {
    str = str.slice(oldPrefix.length)
  }

  return (newPrefix + str).replaceAll(/(_\w)/g, match => match[1].toUpperCase())
}

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

const iconTypeNames = iconTypes.map(type => type.name)

function convertWebfont(name, originalType) {
  const type = originalType.regex.test(name)
    ? originalType
    : iconTypes.find(item => item.regex.test(name)) || iconTypes[0]

  return {
    importName: type.name,
    variableName: type.convert(name)
  }
}

function makeImportList() {
  return Object.fromEntries(iconTypeNames.map(name => [name, []]))
}

function splitIconSetContent(content) {
  const delimiter = 'export default {'
  const chunks = content.split(delimiter)

  return {
    outsideOfExport: chunks[0],
    insideOfExport: delimiter + chunks[1]
  }
}

function getGeneratedSvgIconSetContent(type, originalContent) {
  const { outsideOfExport, insideOfExport } =
    splitIconSetContent(originalContent)
  const importList = makeImportList()

  const contentString = insideOfExport
    .replace(/name: '(.+)'/, 'name: ""')
    .replaceAll(/'(.+)'/g, (_match, name) => {
      const { importName, variableName } = convertWebfont(name, type)
      if (!importList[importName].includes(variableName)) {
        importList[importName].push(variableName)
      }
      return variableName
    })
    .replace(/name: ""/, `name: 'svg-${type.name}'`)

  const importString = Object.keys(importList)
    .filter(listName => importList[listName].length !== 0)
    .map(
      listName =>
        'import {\n  ' +
        importList[listName].join(',\n  ') +
        `\n} from '@quasar/extras/${listName}'`
    )
    .join('\n\n')

  return [
    `
/*
 * DO NOT EDIT THIS FILE. It is automatically generated
 * from its webfont counterpart (same filename without "svg-" prefix).
 * Edit that file instead (${type.name}.js).
 */`,
    importString,
    outsideOfExport,
    contentString
  ]
    .filter(Boolean)
    .join('\n\n')
}

async function auditGeneratedSvgIconSets() {
  for (const type of iconTypes) {
    const webfontFile = resolve(iconSetDir, `${type.name}.js`)
    const svgFile = resolve(iconSetDir, `svg-${type.name}.js`)

    if (!existsSync(webfontFile)) {
      addError(
        `generated SVG icon source is missing: ${toDisplayPath(webfontFile)}`
      )
      continue
    }

    if (!existsSync(svgFile)) {
      addError(`generated SVG icon set is missing: ${toDisplayPath(svgFile)}`)
      continue
    }

    const expected = getGeneratedSvgIconSetContent(
      type,
      await readFile(webfontFile, 'utf8')
    )
    const actual = await readFile(svgFile, 'utf8')

    if (normalizeContent(actual) !== normalizeContent(expected)) {
      addError(`${toDisplayPath(svgFile)} is not in sync with ${type.name}.js`)
    }
  }
}

await auditPackageScripts()
await auditBuildImports()
await auditLangIndex()
await auditGeneratedSvgIconSets()

if (errors.length !== 0) {
  console.error(`Generated files audit failed (${errors.length}):`)
  for (const error of errors) {
    console.error(`  - ${error}`)
  }
  process.exit(1)
}

console.log('Generated files audit passed.')
