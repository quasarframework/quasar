const { readFileSync } = require('fs')
const { join, basename } = require('path')
const { gzipSync } = require('zlib')
const { table } = require('table')
const { bold, underline, green, blue, magenta } = require('chalk')

const { warn } = require('./logger')
const { printWebpackWarnings } = require('./print-webpack-issue')

const colorFn = {
  js: green,
  css: blue,
  json: magenta
}

const assetNameRE = /\.(js|css|json)$/

function getAssets (stats) {
  const statsJson = stats.toJson({
    hash: false,
    modules: false,
    chunks: false
  })

  const allAssets = statsJson.assets
    ? statsJson.assets
    : statsJson.children.reduce((acc, child) => acc.concat(child.assets), [])

  const assetNameMap = new Map()
  const assets = []

  allAssets.forEach(({ name, size }) => {
    if (assetNameMap.has(name) === false) {
      assetNameMap.set(name, true)

      const match = name.match(assetNameRE)

      if (match !== null) {
        assets.push({
          type: match[1],
          name,
          size
        })
      }
    }
  })

  assets.sort((a, b) => {
    return a.type === b.type
      ? (a.name < b.name ? -1 : 1)
      : (a.type < b.type ? -1 : 1)
  })

  return assets
}

function getHumanSize (bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`
}

function getGzippedSize (asset, outputFolder) {
  try {
    const file = join(outputFolder, asset.name)
    const buffer = readFileSync(file)

    return gzipSync(buffer).length
  }
  catch (_) {
    return '-'
  }
}

function getTableLines (assets, outputFolder) {
  return assets.map(asset => {
    const color = colorFn[asset.type]

    return [
      color(basename(asset.name)),
      getHumanSize(asset.size),
      getHumanSize(getGzippedSize(asset, outputFolder))
    ]
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

module.exports = (stats, outputFolder, name) => {
  const assets = getAssets(stats)
  const tableLines = getTableLines(assets, outputFolder)
  const tableIndexDelimiters = getTableIndexDelimiters(assets)

  const data = [
    [
      underline('Asset'),
      underline('Size'),
      underline('Gzipped')
    ],

    ...tableLines
  ]

  const output = table(data, {
    columns: {
      0: { alignment: 'right' },
      1: { alignment: 'right' },
      2: { alignment: 'right' }
    },

    drawHorizontalLine: index => tableIndexDelimiters.includes(index)
  })

  console.log(` Summary for "${bold(green(name))}" (only css/js/json)`)
  console.log(' ' + output.replace(/\n/g, '\n '))

  if (stats.hasWarnings()) {
    const summary = printWebpackWarnings(name, stats)
    warn(`Build succeeded, but with ${summary}. Check log above.\n`)
  }
}
