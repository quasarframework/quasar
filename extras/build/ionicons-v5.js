const packageName = 'ionicons'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../ionicons-v5/index.js`)
const { parseSvgContent } = require('./utils')

const svgFolder = resolve(__dirname, `../repos/ionicons-5.0.0/${packageName}/dist/ionicons/svg/`)
const svgFiles = glob.sync(svgFolder + '/*.svg')
const iconNames = new Set()

function extract (file) {
  const name = ('ion-' + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

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
  const { version } = require(resolve(__dirname, `../repos/ionicons-5.0.0/${packageName}/package.json`))
  return `/* Ionicons v${version} */\n\n`
}

const svgExports = []

svgFiles.forEach(file => {
  svgExports.push(extract(file))
})

if (svgExports.length === 0) {
  console.log('WARNING. Ionicons v5 skipped completely')
}
else {
  writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

  if (skipped.length > 0) {
    console.log(`ionicons v5 - skipped (${skipped.length}): ${skipped}`)
  }
}

// then update webfont files

const webfont = [
  'ionicons.woff',
  'ionicons.woff2'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../repos/ionicons-5.0.0/${packageName}/docs/fonts/${file}`),
    resolve(__dirname, `../ionicons-v5/${file}`)
  )
})

copySync(
  resolve(__dirname, `../repos/ionicons-5.0.0/${packageName}/LICENSE`),
  resolve(__dirname, `../ionicons-v5/LICENSE`)
)
