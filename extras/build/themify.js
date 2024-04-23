const packageName = 'themify-icons'
const distName = 'themify'
const iconSetName = 'Themify'
const prefix = 'ti'
const version = '1.0.1'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { writeFileSync } = require('fs')
const { resolve, join } = require('path')

const skipped = []
const distFolder = resolve(__dirname, '../themify')
const { defaultNameMapper, extract, writeExports, copyCssFile, getBanner } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${ packageName }/SVG/`)
const svgFiles = glob.sync(svgFolder + '/*.svg')
let iconNames = new Set()

const svgExports = []
const typeExports = []

svgFiles.forEach(file => {
  const name = defaultNameMapper(file, prefix)

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

writeExports(iconSetName, version, distFolder, svgExports, typeExports, skipped)

// then update webfont files

const webfont = [
  'themify.woff'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/${ packageName }/fonts/${ file }`),
    resolve(__dirname, `../themify/${ file }`)
  )
})

copyCssFile({
  from: resolve(__dirname, `../node_modules/${ packageName }/css/themify-icons.css`),
  to: resolve(__dirname, '../themify/themify.css'),
  replaceFn: content => (
    getBanner('Themify Icons', packageName)
    + (
      content
        .replace(/src:[^;]+;/, '')
        .replace(/src:[^;]+;/, 'src: url(\'./themify.woff\') format(\'woff\');')
        .replace('font-display: swap;', 'font-display: block;')
        .replace('[class^="ti-"], [class*=" ti-"]', '.themify-icon')
    )
  )
})

// write the JSON file
const file = resolve(__dirname, join('..', distName, 'icons.json'))
writeFileSync(file, JSON.stringify([ ...iconNames ].sort(), null, 2), 'utf-8')

console.log(`${ distName } done with ${ iconNames.length } icons`)
