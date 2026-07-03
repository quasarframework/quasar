import { join, normalize, relative, resolve } from 'node:path'
import fse from 'fs-extra'
import { blue, gray, green, magenta, red, underline } from 'kolorist'
import { table } from 'table'

const jsRE = /\.c?js$/
const cssRE = /\.(css|sass)$/
const tsRE = /\.ts$/
const jsonRE = /\.json$/

let zlib = null
const tableData = []

export const BUILD_TARGETS = getBuildTargets()

function getBuildTargets() {
  const targets = [
    { name: 'chrome', major: 111 },
    { name: 'edge', major: 111 },
    { name: 'firefox', major: 114 },
    { name: 'safari', major: 16, minor: 4 },
    { name: 'ios', major: 16, minor: 4 }
  ]

  return {
    ROLLDOWN_NODE: 'node20',

    ROLLDOWN_BROWSER: targets.map(
      target =>
        `${target.name}${target.major}${target.minor ? `.${target.minor}` : ''}`
    ),

    LIGHTNING_CSS: targets.reduce((acc, target) => {
      acc[target.name] =
        (target.major << 16) + (target.minor ? target.minor << 8 : 0)
      return acc
    }, {})
  }
}

export function plural(num) {
  return num === 1 ? '' : 's'
}

const camelCaseRE = /((-|\.)\w)/g
const camelCaseInnerRE = /-|\./
export function camelCase(str) {
  // assumes kebab case "str"
  return str.replace(camelCaseRE, text =>
    text.replace(camelCaseInnerRE, '').toUpperCase()
  )
}

const kebabRE = /([a-zA-Z])([A-Z])/g
export function kebabCase(str) {
  // assumes pascal case "str"
  return str.replace(kebabRE, '$1-$2').toLowerCase()
}

export function capitalize(str) {
  return str.at(0).toUpperCase() + str.slice(1)
}

export const rootFolder = normalize(join(import.meta.dirname, '..'))
export const distDir = join(rootFolder, 'dist')

export function resolveToRoot(...pathList) {
  return resolve(rootFolder, ...pathList)
}

export function relativeToRoot(...pathList) {
  return relative(rootFolder, ...pathList)
}

export const { version } = readJsonFile(
  join(import.meta.dirname, '../package.json')
)

export const banner =
  '/*!\n' +
  ' * Quasar Framework v' +
  version +
  '\n' +
  ' * (c) 2015-present Razvan Stoenescu\n' +
  ' * Released under the MIT License.\n' +
  ' */\n'

process.on('exit', code => {
  if (code === 0 && tableData.length !== 0) {
    tableData.sort((a, b) =>
      a[0] === b[0] ? (a[1] < b[1] ? -1 : 1) : a[0] < b[0] ? -1 : 1
    )

    tableData.unshift([
      underline('Type'),
      underline('Filename'),
      underline('Size'),
      ...(zlib ? [underline('Gzipped')] : [])
    ])

    const output = table(tableData, {
      columns: {
        0: { alignment: 'right' },
        1: { alignment: 'left' },
        2: { alignment: 'right' },
        ...(zlib ? { 3: { alignment: 'right' } } : {})
      }
    })

    console.log()
    console.log(` Summary of Quasar v${version}:`)
    console.log(output)
  }
})

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

export function createFolder(folder) {
  const dir = join(rootFolder, folder)
  fse.ensureDirSync(dir)
}

function getDestinationInfo(dest) {
  if (jsonRE.test(dest)) {
    return {
      banner: gray('[json]'),
      tableEntryType: gray('json')
    }
  }

  if (jsRE.test(dest)) {
    return {
      banner: green('[js]  '),
      tableEntryType: green('js')
    }
  }

  if (cssRE.test(dest)) {
    return {
      banner: blue('[css] '),
      tableEntryType: blue('css')
    }
  }

  if (tsRE.test(dest)) {
    return {
      banner: magenta('[ts]  '),
      tableEntryType: magenta('ts')
    }
  }

  logError(`Unknown file type using buildUtils.writeFile: ${dest}`)
  process.exit(1)
}

export async function enableGzip() {
  const { default: zlibFn } = await import('node:zlib')
  zlib = zlibFn
}

export function writeFile(dest, code, { summary = false, gzip = false } = {}) {
  const { banner: writeFileBanner, tableEntryType } = getDestinationInfo(dest)

  const fileSize = getSize(code)
  const filePath = relative(distDir, dest)

  let msg = `${writeFileBanner} ${filePath.padEnd(55)} ${fileSize.padStart(8)}`
  const tableEntry = summary ? [tableEntryType, filePath, fileSize] : null

  const promiseList = [
    new Promise(done => {
      fse.writeFile(dest, code, err => {
        if (err) {
          logError(`Failed to write file: ${dest}`)
          console.error(err)
          process.exit(1)
        }

        done()
      })
    })
  ]

  if (zlib) {
    if (gzip) {
      promiseList.push(
        new Promise(done => {
          zlib.gzip(code, (gzipErr, zipped) => {
            if (gzipErr) {
              logError(`Failed to gzip file: ${dest}`)
              tableEntry?.push('-')
            } else {
              msg += ` (gzipped: ${getSize(zipped).padStart(8)})`
              tableEntry?.push(getSize(zipped))
            }

            done()
          })
        })
      )
    } else {
      tableEntry?.push('-')
    }
  }

  return Promise.all(promiseList).then(() => {
    console.log(msg)
    if (tableEntry !== null) tableData.push(tableEntry)
    return code
  })
}

export function readFile(file) {
  return fse.readFileSync(file, 'utf8')
}

export function readJsonFile(file) {
  return JSON.parse(fse.readFileSync(file, 'utf8'))
}

const newlineRE = /[\n\r]+/
export function writeFileIfChanged(dest, newContent, opts) {
  let currentContent = ''
  try {
    currentContent = fse.readFileSync(dest, 'utf8')
  } catch {}

  return newContent.split(newlineRE).join('\n') !==
    currentContent.split(newlineRE).join('\n')
    ? writeFile(dest, newContent, opts)
    : Promise.resolve(newContent)
}

export function logError(err) {
  console.error('\n' + red('[Error]'), err)
  console.log()
}

export function clone(data) {
  const str = JSON.stringify(data)

  if (str) {
    return JSON.parse(str)
  }
}

const privateFileRE = /test|private/

export function filterOutPrivateFiles(file) {
  return !privateFileRE.test(file)
}
