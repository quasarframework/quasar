const packageName = 'eva-icons'
const distName = 'eva-icons'
const iconSetName = 'Eva-Icons'
const prefix = 'eva'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { writeFileSync } = require('fs')
const { resolve, join } = require('path')

const skipped = []
const distFolder = resolve(__dirname, '../eva-icons')
const { defaultNameMapper, extract, writeExports, copyCssFile, getBanner } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${ packageName }/`)
const iconTypes = [ 'fill', 'outline' ]
let iconNames = new Set()

const svgExports = []
const typeExports = []

iconTypes.forEach(type => {
  const svgFiles = glob.sync(svgFolder + `/${ type }/svg/*.svg`)

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
  'Eva-Icons.woff2',
  'Eva-Icons.woff'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/${ packageName }/style/fonts/${ file }`),
    resolve(__dirname, `../eva-icons/${ file }`)
  )
})

copyCssFile({
  from: resolve(__dirname, `../node_modules/${ packageName }/style/eva-icons.css`),
  to: resolve(__dirname, '../eva-icons/eva-icons.css'),
  replaceFn: content => (
    getBanner('Eva Icons', packageName)
      + (
        content
          .replace('@font-face {', '@font-face {\nfont-display: block;')
          .replace('src: url("./fonts/Eva-Icons.eot");', '')
          .replace(/src:[^;]+;/, 'src: url("./Eva-Icons.woff2") format("woff2"), url("./Eva-Icons.woff") format("woff");')
      )
  )
})

// write the JSON file
const file = resolve(__dirname, join('..', distName, 'icons.json'))
writeFileSync(file, JSON.stringify([ ...iconNames ].sort(), null, 2), 'utf-8')

console.log(`${ distName } done with ${ iconNames.length } icons`)
