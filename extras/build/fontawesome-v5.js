const packageName = '@fortawesome/fontawesome-free'

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../fontawesome-v5/index.js`)

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
  return `/* Fontawesome Free v${version} */\n\n`
}

const svgExports = []

iconTypes.forEach(type => {
  const svgFiles = glob.sync(svgFolder + `/${type}/*.svg`)

  svgFiles.forEach(file => {
    svgExports.push(extract('fa' + type.charAt(0) + '-', file))
  })
})

writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

if (skipped.length > 0) {
  console.log(`fontawesome - skipped (${skipped.length}): ${skipped}`)
}
