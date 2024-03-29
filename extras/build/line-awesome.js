const packageName = 'line-awesome'
const distName = 'line-awesome'
const iconSetName = 'Line Awesome'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { writeFileSync } = require('fs')
const { resolve, join } = require('path')

const skipped = []
const distFolder = resolve(__dirname, '../line-awesome')
const { defaultNameMapper, extract, writeExports, copyCssFile, getBanner } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${ packageName }/svg/`)
const svgFiles = glob.sync(svgFolder + '/*.svg')
let iconNames = new Set()

const svgExports = []
const typeExports = []

svgFiles.forEach(file => {
  const name = defaultNameMapper(file, 'la')

  if (iconNames.has(name)) {
    return
  }

  try {
    const { svgDef, typeDef } = extract(file, name)
    svgExports.push(svgDef)
    typeExports.push(typeDef)

    iconNames.add(name)
  }
  catch (err) {
    console.error(err)
    skipped.push(name)
  }
})

iconNames = [ ...iconNames ]
svgExports.sort((a, b) => {
  return ('' + a).localeCompare(b)
})
typeExports.sort((a, b) => {
  return ('' + a).localeCompare(b)
})
iconNames.sort((a, b) => {
  return ('' + a).localeCompare(b)
})

writeExports(iconSetName, packageName, distFolder, svgExports, typeExports, skipped)

// then update webfont files

const webfont = [
  'la-brands-400.woff',
  'la-brands-400.woff2',
  'la-regular-400.woff',
  'la-regular-400.woff2',
  'la-solid-900.woff',
  'la-solid-900.woff2'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/${ packageName }/dist/line-awesome/fonts/${ file }`),
    resolve(__dirname, `../line-awesome/${ file }`)
  )
})

copyCssFile({
  from: resolve(__dirname, `../node_modules/${ packageName }/dist/line-awesome/css/line-awesome.css`),
  to: resolve(__dirname, '../line-awesome/line-awesome.css'),
  replaceFn: content => (
    getBanner('Line Awesome', packageName)
    + (
      content
        .replace(/src:[^;]+la-brands-400[^;]+;/, '')
        .replace(/src:[^;]+la-brands-400[^;]+;/, 'src: url("./la-brands-400.woff2") format("woff2"), url("./la-brands-400.woff") format("woff");')
        .replace(/src:[^;]+la-regular-400[^;]+;/, '')
        .replace(/src:[^;]+la-regular-400[^;]+;/, 'src: url("./la-regular-400.woff2") format("woff2"), url("./la-regular-400.woff") format("woff");')
        .replace(/src:[^;]+la-solid-900[^;]+;/, '')
        .replace(/src:[^;]+la-solid-900[^;]+;/, 'src: url("./la-solid-900.woff2") format("woff2"), url("./la-solid-900.woff") format("woff");')
    )
  )
})

copySync(
  resolve(__dirname, `../node_modules/${ packageName }/LICENSE.md`),
  resolve(__dirname, '../line-awesome/LICENSE.md')
)

// write the JSON file
const file = resolve(__dirname, join('..', distName, 'icons.json'))
writeFileSync(file, JSON.stringify([ ...iconNames ].sort(), null, 2), 'utf-8')

console.log(`${ distName } done with ${ iconNames.length } icons`)
