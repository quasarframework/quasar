const packageName = '@fortawesome/fontawesome-free'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../fontawesome-v5/index.js`)
const { parseSvgContent } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/svgs/`)
const iconTypes = ['brands', 'regular', 'solid']
const iconNames = new Set()

function extract (prefix, file) {
  const name = (prefix + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

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
  return `/* Fontawesome Free v${version} */\n\n`
}

const svgExports = []

iconTypes.forEach(type => {
  const svgFiles = glob.sync(svgFolder + `/${type}/*.svg`)

  svgFiles.forEach(file => {
    svgExports.push(extract('fa' + type.charAt(0) + '-', file))
  })
})

if (svgExports.length === 0) {
  console.log('WARNING. Fontawesome skipped completely')
}
else {
  writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

  if (skipped.length > 0) {
    console.log(`fontawesome - skipped (${skipped.length}): ${skipped}`)
  }
}

// then update webfont files

const webfont = [
  'fa-brands-400.woff',
  'fa-brands-400.woff2',
  'fa-regular-400.woff',
  'fa-regular-400.woff2',
  'fa-solid-900.woff',
  'fa-solid-900.woff2'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/${packageName}/webfonts/${file}`),
    resolve(__dirname, `../fontawesome-v5/${file}`)
  )
})

copySync(
  resolve(__dirname, `../node_modules/${packageName}/LICENSE.txt`),
  resolve(__dirname, `../fontawesome-v5/LICENSE.txt`)
)
