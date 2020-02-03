const packageName = 'themify-icons'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../themify/index.js`)
const { parseSvgContent } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/SVG/`)
const svgFiles = glob.sync(svgFolder + '/*.svg')
const iconNames = new Set()

function extract (file) {
  const name = ('ti-' + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

  if (iconNames.has(name)) {
    return null
  }

  const content = readFileSync(file, 'utf-8')

  try {
    const { dPath, viewBox } = parseSvgContent(name, content)

    iconNames.add(name)
    return `export const ${name} = '${dPath}${viewBox}'`
  }
  catch (err) {
    console.error(err)
    skipped.push(name)
    return null
  }
}

function getBanner () {
  return `/* Themify v1.0.1 */\n\n`
}

const svgExports = []

svgFiles.forEach(file => {
  svgExports.push(extract(file))
})

if (svgExports.length === 0) {
  console.log('WARNING. Themify skipped completely')
}
else {
  writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

  if (skipped.length > 0) {
    console.log(`themify - skipped (${skipped.length}): ${skipped}`)
  }
}

// then update webfont files

const webfont = [
  'themify.woff'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/${packageName}/fonts/${file}`),
    resolve(__dirname, `../themify/${file}`)
  )
})
