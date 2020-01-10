const packageName = '@mdi/svg'

// ------------

const glob = require('glob')
const fse = require('fs-extra')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../mdi-v4/index.js`)

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
    const dPath = content.match(/ d="([\w ,\.-]+)"/)[1]
    const viewBox = content.match(/viewBox="([0-9 ]+)"/)[1]

    iconNames.add(name)
    return `export const ${name} = '${dPath}${viewBox !== '0 0 24 24' ? `|${viewBox}` : ''}'`
  }
  catch (err) {
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
  fse.copySync(
    resolve(__dirname, `../node_modules/@mdi/font/fonts/${file}`),
    resolve(__dirname, `../mdi-v4/${file}`)
  )
})
