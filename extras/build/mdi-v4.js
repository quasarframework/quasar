const packageName = '@mdi/svg'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../mdi-v4/index.js`)
const { parseSvgContent } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/svg/`)
const svgFiles = glob.sync(svgFolder + '/**/*.svg')
const iconNames = new Set()

function extract (file) {
  const name = ('mdi-' + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

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
  return `/* MDI v${version} */\n\n`
}

const svgExports = []

svgFiles.forEach(file => {
  svgExports.push(extract(file))
})

if (svgExports.length === 0) {
  console.log('WARNING. MDI skipped completely')
}
else {
  writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

  if (skipped.length > 0) {
    console.log(`mdi - skipped (${skipped.length}): ${skipped}`)
  }
}

// then update webfont files

const webfont = [
  'materialdesignicons-webfont.woff',
  'materialdesignicons-webfont.woff2'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/@mdi/font/fonts/${file}`),
    resolve(__dirname, `../mdi-v4/${file}`)
  )
})

copySync(
  resolve(__dirname, `../node_modules/@mdi/font/license.md`),
  resolve(__dirname, `../mdi-v4/license.md`)
)
copySync(
  resolve(__dirname, `../node_modules/@mdi/svg/LICENSE`),
  resolve(__dirname, `../mdi-v4/LICENSE`)
)
