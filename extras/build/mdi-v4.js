const packageName = '@mdi/svg'

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../mdi-v4/index.js`)

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/svg/`)
const svgFiles = glob.sync(svgFolder + '/**/*.svg')

function extract (file) {
  const content = readFileSync(file, 'utf-8')

  const name = ('mdi-' + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

  try {
    const dPath = content.match(/ d="([\w ,\.-]+)"/)[1]
    const viewBox = content.match(/viewBox="([0-9 ]+)"/)[1]

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

const svgExports = new Set()

svgFiles.forEach(file => {
  svgExports.add(extract(file))
})

writeFileSync(dist, getBanner() + Array.from(svgExports).join('\n'), 'utf-8')

if (skipped.length > 0) {
  console.log(`mdi - skipped (${skipped.length}): ${skipped}`)
}
