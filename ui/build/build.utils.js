const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const { green, blue, red, magenta, grey, underline } = require('chalk')

const kebabRegex = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g
const tableData = []

const { version } = require('../package.json')

process.on('exit', code => {
  if (code === 0 && tableData.length > 0) {
    const { table } = require('table')

    tableData.sort((a, b) => {
      return a[ 0 ] === b[ 0 ]
        ? a[ 1 ] < b[ 1 ] ? -1 : 1
        : a[ 0 ] < b[ 0 ] ? -1 : 1
    })

    tableData.unshift([
      underline('Ext'),
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

module.exports.createFolder = function (folder) {
  const dir = path.join(__dirname, '..', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function getDestinationInfo (dest) {
  if (dest.endsWith('.json')) {
    return {
      banner: grey('[json]'),
      tableEntryType: grey('json'),
      toTable: false
    }
  }

  if (dest.endsWith('.js')) {
    return {
      banner: green('[js]  '),
      tableEntryType: green('js'),
      toTable: dest.indexOf('dist/quasar') > -1
    }
  }

  if (dest.endsWith('.css') || dest.endsWith('.styl') || dest.endsWith('.sass')) {
    return {
      banner: blue('[css] '),
      tableEntryType: blue('css'),
      toTable: true
    }
  }

  if (dest.endsWith('.ts')) {
    return {
      banner: magenta('[ts]  '),
      tableEntryType: magenta('ts'),
      toTable: false
    }
  }

  logError(`Unknown file type using buildUtils.writeFile: ${ dest }`)
  process.exit(1)
}

module.exports.writeFile = function (dest, code, zip) {
  const { banner, tableEntryType, toTable } = getDestinationInfo(dest)

  const fileSize = getSize(code)
  const filePath = path.relative(process.cwd(), dest)

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

    fs.writeFile(dest, code, err => {
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

module.exports.readFile = function (file) {
  return fs.readFileSync(file, 'utf-8')
}

function logError (err) {
  console.error('\n' + red('[Error]'), err)
  console.log()
}

module.exports.logError = logError

module.exports.rollupQuasarUMD = function (config = {}) {
  return {
    name: 'quasar-umd',
    transform (code) {
      return {
        code: `Quasar.${ config.type }.set(${ code.replace('export default ', '') })`
      }
    }
  }
}

module.exports.kebabCase = function (str) {
  return str.replace(
    kebabRegex,
    match => '-' + match.toLowerCase()
  ).substring(1)
}
