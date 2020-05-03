const packageName = 'material-design-icons'
const iconSetName = 'Google Material Design Icons'

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { copySync } = require('fs-extra')
const { resolve } = require('path')

let skipped = []
const distFolder = resolve(__dirname, `../material-icons`)
const { extract, writeExports } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/`)
const svgFiles = glob.sync(svgFolder + '/*/svg/production/ic_*_24px.svg')
const iconNames = new Set()

const svgExports = []
const typeExports = []

svgFiles.forEach(file => {
  const name = ('mat_' + file.match(/ic_(.*)_24px\.svg/)[1])
    .replace(/(_\w)/g, m => m[1].toUpperCase())

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

writeExports(iconSetName, packageName, distFolder, svgExports, typeExports, skipped)

copySync(
  resolve(__dirname, `../node_modules/${packageName}/LICENSE`),
  resolve(__dirname, `../material-icons/LICENSE`)
)
