const packageName = 'eva-icons'

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../eva-icons/index.js`)

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/`)
const iconTypes = ['fill', 'outline']
const iconNames = new Set()

function extract (file) {
  const name = ('eva-' + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

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
  const svgFiles = glob.sync(svgFolder + `/${type}/svg/*.svg`)

  svgFiles.forEach(file => {
    svgExports.push(extract(file))
  })
})

writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

if (skipped.length > 0) {
  console.log(`eva icons - skipped (${skipped.length}): ${skipped}`)
}
