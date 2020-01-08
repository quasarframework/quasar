const packageName = '@fortawesome/fontawesome-free'

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

const dist = resolve(__dirname, `../fa-svg.js`)

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/svgs/`)
const iconTypes = ['brands', 'regular', 'solid']

function extract (prefix, file) {
  const content = readFileSync(file, 'utf-8')

  const name = (prefix + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())
  const dPath = content.match(/ d="([\w ,\.-]+)"/)[1]
  const viewBox = content.match(/viewBox="([0-9 ]+)"/)[1]

  return `export const ${name} = "${dPath}|${viewBox}"`
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

writeFileSync(dist, getBanner() + svgExports.join('\n'), 'utf-8')
