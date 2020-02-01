const packageName = 'line-awesome'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../line-awesome/index.js`)
const { parseSvgContent } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/svg/`)
const iconNames = new Set()

function extract (file) {
  const name = ('la-' + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

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
  const { version } = require(resolve(__dirname, `../node_modules/${packageName}/package.json`))
  return `/* Line Awesome v${version} */\n\n`
}

const svgExports = []
const svgFiles = glob.sync(svgFolder + `/*.svg`)

svgFiles.forEach(file => {
  svgExports.push(extract(file))
})

if (svgExports.length === 0) {
  console.log('WARNING. Line Awesome skipped completely')
}
else {
  writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

  if (skipped.length > 0) {
    console.log(`lineawesome - skipped (${skipped.length}): ${skipped}`)
  }
}

// then update webfont files

const webfont = [
  'la-brands-400.woff',
  'la-brands-400.woff2',
  'la-regular-400.woff',
  'la-regular-400.woff2',
  'la-solid-900.woff',
  'la-solid-900.woff2'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/${packageName}/dist/line-awesome/fonts/${file}`),
    resolve(__dirname, `../line-awesome/${file}`)
  )
})

copySync(
  resolve(__dirname, `../node_modules/${packageName}/LICENSE.md`),
  resolve(__dirname, `../line-awesome/LICENSE.md`)
)
