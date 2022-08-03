const packageName = '@mdi/svg'
const distName = 'mdi-v7'
const iconSetName = 'MDI'
const prefix = 'mdi'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { writeFileSync } = require('fs')
const { resolve, join } = require('path')

const skipped = []
const distFolder = resolve(__dirname, `../${distName}`)
const { defaultNameMapper, extract, writeExports } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/svg/`)
const svgFiles = glob.sync(svgFolder + '/**/*.svg')
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
  'materialdesignicons-webfont.woff',
  'materialdesignicons-webfont.woff2'
]

webfont.forEach(file => {
  copySync(
    resolve(__dirname, `../node_modules/@mdi/font/fonts/${file}`),
    resolve(__dirname, `../${distName}/${file}`)
  )
})

copySync(
  resolve(__dirname, `../node_modules/@mdi/font/LICENSE`),
  resolve(__dirname, `../${distName}/license.md`)
)
copySync(
  resolve(__dirname, `../node_modules/@mdi/svg/LICENSE`),
  resolve(__dirname, `../${distName}/LICENSE`)
)

// write the JSON file
const file = resolve(__dirname, join('..', distName, 'icons.json'))
writeFileSync(file, JSON.stringify([...iconNames].sort(), null, 2), 'utf-8')

console.log(`${distName} done with ${iconNames.length} icons`)
