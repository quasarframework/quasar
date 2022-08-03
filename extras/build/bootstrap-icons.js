const packageName = 'bootstrap-icons'
const distName = 'bootstrap-icons'
const iconSetName = 'Bootstrap'
const prefix = 'bi'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { writeFileSync } = require('fs')
const { resolve, join } = require('path')

let skipped = []
const distFolder = resolve(__dirname, `../bootstrap-icons`)
const { defaultNameMapper, extract, writeExports } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/icons/`)
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
  catch(err) {
    console.error(err)
    skipped.push(name)
  }
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
  'bootstrap-icons.woff',
  'bootstrap-icons.woff2'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/${packageName}/font/fonts/${file}`),
    resolve(__dirname, `../bootstrap-icons/${file}`)
  )
})

copySync(
  resolve(__dirname, `../node_modules/${packageName}/LICENSE.md`),
  resolve(__dirname, `../bootstrap-icons/LICENSE.md`)
)

// write the JSON file
const file = resolve(__dirname, join('..', distName, 'icons.json'))
writeFileSync(file, JSON.stringify([...iconNames].sort(), null, 2), 'utf-8')

console.log(`${distName} done with ${iconNames.length} icons`)
