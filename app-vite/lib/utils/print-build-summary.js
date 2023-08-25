import { readFileSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { gzipSync } from 'zlib'
import { table } from 'table'
import { underline, green, blue, magenta, cyan, gray } from 'kolorist'
import fglob from 'fast-glob'

const colorFn = {
  js: green,
  css: blue,
  json: magenta,
  html: cyan
}

const gzipTypes = [ 'js', 'css' ]

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

function getTableLines (assets, showGzipped) {
  return assets.map(asset => {
    const dir = dirname(asset.name)

    const acc = [
      (dir !== '.' ? gray(dir + '/') : '') + colorFn[ asset.type ](basename(asset.name)),
      getHumanSize(asset.size)
    ]

    if (showGzipped === true) {
      acc.push(
        gzipTypes.includes(asset.type) === true
          ? getHumanSize(getGzippedSize(asset.file))
          : gray('-')
      )
    }

    return acc
  })
}

function getTableIndexDelimiters (assets) {
  let lastType
  const delimiters = [ 0, assets.length + 1 ]

  assets.forEach((asset, index) => {
    if (lastType !== asset.type) {
      lastType = asset.type
      delimiters.push(index + 1)
    }
  })

  return delimiters
}

export function printBuildSummary (distDir, showGzipped) {
  const assets = getAssets(distDir)
  const tableLines = getTableLines(assets, showGzipped)
  const tableIndexDelimiters = getTableIndexDelimiters(assets)

  const header = [
    underline('Asset'),
    underline('Size')
  ]
  const columns = {
    0: { alignment: 'right' },
    1: { alignment: 'right' }
  }

  if (showGzipped === true) {
    header.push(underline('Gzipped'))
    columns[ 2 ] = { alignment: 'right' }
  }

  const data = [
    header,
    ...tableLines
  ]

  const output = table(data, {
    columns,
    drawHorizontalLine: index => tableIndexDelimiters.includes(index)
  })

  console.log(' Build summary with important files:')
  console.log(' ' + output.replace(/\n/g, '\n '))
}
