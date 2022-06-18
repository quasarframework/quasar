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
const distFolder = resolve(__dirname, `../eva-icons`)
const { defaultNameMapper, extract, writeExports } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/`)
const iconTypes = ['fill', 'outline']
let iconNames = new Set()

const svgExports = []
const typeExports = []

iconTypes.forEach(type => {
  const svgFiles = glob.sync(svgFolder + `/${type}/svg/*.svg`)

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
    catch(err) {
      console.error(err)
      skipped.push(name)
    }
  })
})

iconNames = [...iconNames]
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
    resolve(__dirname, `../node_modules/${packageName}/style/fonts/${file}`),
    resolve(__dirname, `../eva-icons/${file}`)
  )
})

// write the JSON file
const file = resolve(__dirname, join('..', distName, 'icons.json'))
writeFileSync(file, JSON.stringify([...iconNames].sort(), null, 2), 'utf-8')

console.log(`${distName} done with ${iconNames.length} icons`)
