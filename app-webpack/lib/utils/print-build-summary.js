const { readFileSync, statSync } = require('node:fs')
const { join, dirname, basename } = require('node:path')
const { gzipSync } = require('zlib')
const { underline, green, blue, magenta, cyan, gray } = require('kolorist')
const fglob = require('fast-glob')

const highlightTypes = [ 'js', 'css' ]
const delimiters = {
  top: { start: ' ╔', middle: '═', end: '╗', join: '╦' },
  separator: { start: ' ╟', middle: '─', end: '╢', join: '╫' },
  thickSeparator: { start: ' ╠', middle: '═', end: '╣', join: '╬' },
  line: { start: ' ║', middle: '─', end: '║', join: '║' },
  bottom: { start: ' ╚', middle: '═', end: '╝', join: '╩' }
}
const colorFn = {
  js: green,
  css: blue,
  json: magenta,
  html: cyan
}

function getAssets (distDir) {
  const acc = []

  Object.keys(colorFn).forEach(type => {
    const fileList = fglob.sync([ `**/*.${ type }` ], { cwd: distDir })
    const assets = fileList.map(name => {
      const file = join(distDir, name)
      const { size } = statSync(file)
      return {
        name,
        file,
        size,
        type
      }
    })

    acc.push(...assets)
  })

  return acc
}

function getHumanSize (bytes) {
  return `${ (bytes / 1024).toFixed(2) } KB`
}

function getGzippedSize (file) {
  try {
    const buffer = readFileSync(file)
    return gzipSync(buffer).length
  }
  catch (_) {
    return '-'
  }
}

function getAssetLines (assetList, showGzipped) {
  const total = highlightTypes.reduce((acc, type) => {
    acc[ type ] = { size: 0, number: 0 }
    return acc
  }, {})

  const lineList = []
  let lastType = null

  assetList.forEach(asset => {
    if (lastType !== asset.type) {
      lastType = asset.type
      lineList.push('separator')
    }

    const folder = dirname(asset.name)
    const filename = basename(asset.name)
    const size = getHumanSize(asset.size)
    const shouldHighlight = highlightTypes.includes(asset.type)

    const acc = {
      asset: (folder !== '.' ? gray(folder + '/') : '') + colorFn[ asset.type ](filename),
      assetLen: ((folder !== '.' ? folder + '/' : '') + filename).length,
      size,
      sizeLen: size.length
    }

    if (showGzipped === true) {
      const val = shouldHighlight === true
        ? getHumanSize(getGzippedSize(asset.file))
        : '-'

      acc.gzipped = gray(val)
      acc.gzippedLen = val.length
    }

    if (shouldHighlight === true) {
      const target = total[ asset.type ]
      target.size += asset.size
      target.number++
    }

    lineList.push(acc)
  })

  lineList.push('thickSeparator')

  highlightTypes.forEach(type => {
    const target = total[ type ]
    const plural = target.number > 1 ? 's' : ''

    const asset = `Total ${ type.toUpperCase() } (${ target.number } file${ plural })`
    const size = getHumanSize(target.size)

    lineList.push({
      asset: colorFn[ type ](asset),
      assetLen: asset.length,
      size,
      sizeLen: size.length,
      gzipped: gray('-'),
      gzippedLen: 1
    })
  })

  return lineList
}

function getAssetColumnWidth (assetList) {
  const total = highlightTypes.reduce((acc, type) => {
    acc[ type ] = 0
    return acc
  }, {})

  let maxAssetNameLen = assetList.reduce(
    (acc, asset) => {
      if (highlightTypes.includes(asset.type)) {
        total[ asset.type ]++
      }
      return Math.max(acc, asset.name.length)
    },
    0
  )

  highlightTypes.forEach(type => {
    const target = total[ type ]
    const plural = target.number > 1 ? 's' : ''
    const banner = `Total ${ type.toUpperCase() } (${ target.number } file${ plural })`

    if (banner.length > maxAssetNameLen) {
      maxAssetNameLen = banner.length
    }
  })

  return /* spacing */ 2 + maxAssetNameLen
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getTable (widthMap) {
  const acc = {}
  const colKeys = Object.keys(widthMap)
  const separatorLine = (
    delimiters.separator.start
    + colKeys.map(key => delimiters.separator.middle.repeat(widthMap[ key ])).join(delimiters.separator.join)
    + delimiters.separator.end
  )
  const thickSeparatorLine = (
    delimiters.thickSeparator.start
    + colKeys.map(key => delimiters.thickSeparator.middle.repeat(widthMap[ key ])).join(delimiters.thickSeparator.join)
    + delimiters.thickSeparator.end
  )

  acc.printLine = function (line) {
    if (line === 'separator') {
      console.log(separatorLine)
      return
    }

    if (line === 'thickSeparator') {
      console.log(thickSeparatorLine)
      return
    }

    console.log(
      delimiters.line.start
      + colKeys.map(key => (' '.repeat(widthMap[ key ] - line[ key + 'Len' ] - 1) + line[ key ] + ' ')).join(delimiters.line.join)
      + delimiters.line.end
    )
  }

  acc.printHeader = function () {
    console.log(
      delimiters.top.start
      + colKeys.map(key => delimiters.top.middle.repeat(widthMap[ key ])).join(delimiters.top.join)
      + delimiters.top.end
    )

    acc.printLine(
      colKeys.reduce((acc, key) => {
        const val = capitalize(key)
        acc[ key ] = underline(val)
        acc[ key + 'Len' ] = val.length
        return acc
      }, {})
    )
  }

  acc.printFooter = function () {
    console.log(
      delimiters.bottom.start
      + colKeys.map(key => delimiters.bottom.middle.repeat(widthMap[ key ])).join(delimiters.bottom.join)
      + delimiters.bottom.end
      + '\n'
    )
  }

  return acc
}

module.exports.printBuildSummary = function printBuildSummary (distDir, showGzipped) {
  const assetList = getAssets(distDir)

  const widthMap = {
    asset: getAssetColumnWidth(assetList),
    size: 14
  }

  if (showGzipped === true) {
    widthMap.gzipped = widthMap.size
  }

  const table = getTable(widthMap)

  console.log(' Build summary with important files:')

  table.printHeader()
  getAssetLines(assetList, showGzipped).forEach(table.printLine)
  table.printFooter()
}
