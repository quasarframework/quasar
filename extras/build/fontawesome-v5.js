const packageName = '@fortawesome/fontawesome-free'

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../fontawesome-v5/index.js`)

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/svgs/`)
const iconTypes = ['brands', 'regular', 'solid']

function extract (prefix, file) {
  const content = readFileSync(file, 'utf-8')

  const name = (prefix + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

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
  return `/* Fontawesome Free v${version} */\n\n`
}

const svgExports = new Set()

iconTypes.forEach(type => {
  const svgFiles = glob.sync(svgFolder + `/${type}/*.svg`)

  svgFiles.forEach(file => {
    svgExports.add(extract('fa' + type.charAt(0) + '-', file))
  })
})

writeFileSync(dist, getBanner() + Array.from(svgExports).filter(x => x !== null).join('\n'), 'utf-8')

if (skipped.length > 0) {
  console.log(`fontawesome - skipped (${skipped.length}): ${skipped}`)
}
