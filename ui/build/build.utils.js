import { join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'
import zlib from 'zlib'
import { red, green, blue, magenta, gray, underline } from 'kolorist'
import { table } from 'table'

const jsRE = /\.c?js$/
const cssRE = /\.(css|sass)$/
const tsRE = /\.ts$/
const jsonRE = /\.json$/

const tableData = []

export function plural (num) {
  return num === 1 ? '' : 's'
}

const camelCaseRE = /((-|\.)\w)/g
const camelCaseInnerRE = /-|\./
export function camelCase (str) {
  // assumes kebab case "str"
  return str.replace(
    camelCaseRE,
    text => text.replace(camelCaseInnerRE, '').toUpperCase()
  )
}

const kebabRE = /([a-zA-Z])([A-Z])/g
export function kebabCase (str) {
  // assumes pascal case "str"
  return str.replace(kebabRE, '$1-$2').toLowerCase()
}

export function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const rootFolder = fileURLToPath(
  new URL('..', import.meta.url)
)

export function resolveToRoot (...pathList) {
  return resolve(rootFolder, ...pathList)
}

export function relativeToRoot (...pathList) {
  return relative(rootFolder, ...pathList)
}

export const { version } = readJsonFile(
  new URL('../package.json', import.meta.url)
)

export const banner = (
  '/*!\n'
  + ' * Quasar Framework v' + version + '\n'
  + ' * (c) 2015-present Razvan Stoenescu\n'
  + ' * Released under the MIT License.\n'
  + ' */\n'
)

process.on('exit', code => {
  if (code === 0 && tableData.length > 0) {
    tableData.sort((a, b) => {
      return a[ 0 ] === b[ 0 ]
        ? a[ 1 ] < b[ 1 ] ? -1 : 1
        : a[ 0 ] < b[ 0 ] ? -1 : 1
    })

    tableData.unshift([
      underline('Type'),
      underline('Filename'),
      underline('Size'),
      underline('Gzipped')
    ])

    const output = table(tableData, {
      columns: {
        0: { alignment: 'right' },
        1: { alignment: 'left' },
        2: { alignment: 'right' },
        3: { alignment: 'right' }
      }
    })

    console.log()
    console.log(` Summary of Quasar v${ version }:`)
    console.log(output)
  }
})

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

export function createFolder (folder) {
  const dir = join(rootFolder, folder)
  fse.ensureDirSync(dir)
}

function getDestinationInfo (dest) {
  if (jsonRE.test(dest)) {
    return {
      banner: gray('[json]'),
      tableEntryType: gray('json'),
      toTable: false
    }
  }

  if (jsRE.test(dest)) {
    return {
      banner: green('[js]  '),
      tableEntryType: green('js'),
      toTable: dest.indexOf('dist/quasar') !== -1
    }
  }

  if (cssRE.test(dest)) {
    return {
      banner: blue('[css] '),
      tableEntryType: blue('css'),
      toTable: true
    }
  }

  if (tsRE.test(dest)) {
    return {
      banner: magenta('[ts]  '),
      tableEntryType: magenta('ts'),
      toTable: false
    }
  }

  logError(`Unknown file type using buildUtils.writeFile: ${ dest }`)
  process.exit(1)
}

export function writeFile (dest, code, zip) {
  const { banner, tableEntryType, toTable } = getDestinationInfo(dest)

  const fileSize = getSize(code)
  const filePath = relative(process.cwd(), dest)

  return new Promise((resolve, reject) => {
    function report (gzippedString, gzippedSize) {
      console.log(`${ banner } ${ filePath.padEnd(49) } ${ fileSize.padStart(8) }${ gzippedString || '' }`)

      if (toTable) {
        tableData.push([
          tableEntryType,
          filePath,
          fileSize,
          gzippedSize || '-'
        ])
      }

      resolve(code)
    }

    fse.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          const size = getSize(zipped)
          report(` (gzipped: ${ size.padStart(8) })`, size)
        })
      }
      else {
        report()
      }
    })
  })
}

export function readFile (file) {
  return fse.readFileSync(file, 'utf-8')
}

export function readJsonFile (file) {
  return JSON.parse(
    fse.readFileSync(file, 'utf-8')
  )
}

export function writeFileIfChanged (dest, newContent, zip) {
  let currentContent = ''
  try {
    currentContent = fse.readFileSync(dest, 'utf-8')
  }
  catch (e) {}

  return newContent.split(/[\n\r]+/).join('\n') !== currentContent.split(/[\n\r]+/).join('\n')
    ? writeFile(dest, newContent, zip)
    : Promise.resolve()
}

export function logError (err) {
  console.error('\n' + red('[Error]'), err)
  console.log()
}

export function clone (data) {
  const str = JSON.stringify(data)

  if (str) {
    return JSON.parse(str)
  }
}

const privateFileRE = /test|private/

export function filterOutPrivateFiles (file) {
  return privateFileRE.test(file) === false
}
