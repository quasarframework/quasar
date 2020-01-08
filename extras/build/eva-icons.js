const packageName = 'eva-icons'

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = 0
const dist = resolve(__dirname, `../eva-svg.js`)

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/`)
const iconTypes = ['fill', 'outline']

function extract (suffix, file) {
  const content = readFileSync(file, 'utf-8')

  const name = ('eva-' + basename(file, '.svg') + suffix).replace(/(-\w)/g, m => m[1].toUpperCase())

  try {
    const dPath = content.match(/ d="([\w ,\.-]+)"/)[1]
    const viewBox = content.match(/viewBox="([0-9 ]+)"/)[1]

    return `export const ${name} = "${dPath}|${viewBox}"`
  }
  catch (err) {
    skipped++
    return null
  }
}

function getBanner () {
  const { version } = require(resolve(__dirname, `../node_modules/${packageName}/package.json`))
  return `/* Fontawesome Free v${version} */\n\n`
}

const svgExports = []

iconTypes.forEach(type => {
  const svgFiles = glob.sync(svgFolder + `/${type}/svg/*.svg`)

  const suffix = type !== 'fill'
    ? '-' + type
    : ''

  svgFiles.forEach(file => {
    svgExports.push(extract(suffix, file))
  })
})

writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

if (skipped > 0) {
  console.log('eva icons - skipped: ' + skipped)
}
