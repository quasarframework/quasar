import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { globSync } from 'tinyglobby'
import fse from 'fs-extra'

import {
  copyCssFile,
  defaultNameMapper,
  extract,
  writeExports
} from './utils.js'

const packageName = 'bootstrap-icons'
const distName = 'bootstrap-icons'
const iconSetName = 'Bootstrap'
const prefix = 'bi'

// ------------

const skipped = []
const distFolder = resolve(import.meta.dirname, '../exports/bootstrap-icons')

const svgFolder = resolve(
  import.meta.dirname,
  `../node_modules/${packageName}/icons/`
)
const svgFiles = globSync(svgFolder + '/*.svg')
let iconNames = new Set()

const svgExports = []
const typeExports = []

svgFiles.forEach(file => {
  const name = defaultNameMapper(file, prefix)

  if (iconNames.has(name)) return

  try {
    const { svgDef, typeDef } = extract(file, name)
    svgExports.push(svgDef)
    typeExports.push(typeDef)

    iconNames.add(name)
  } catch (err) {
    console.error(err)
    skipped.push(name)
  }
})

iconNames = [...iconNames]
svgExports.sort((a, b) => String(a).localeCompare(b))
typeExports.sort((a, b) => String(a).localeCompare(b))
iconNames.sort((a, b) => String(a).localeCompare(b))

writeExports(
  iconSetName,
  packageName,
  distFolder,
  svgExports,
  typeExports,
  skipped
)

// then update webfont files

const webfont = ['bootstrap-icons.woff2']

webfont.forEach(file => {
  fse.copySync(
    resolve(
      import.meta.dirname,
      `../node_modules/${packageName}/font/fonts/${file}`
    ),
    resolve(distFolder, file)
  )
})

copyCssFile({
  from: resolve(
    import.meta.dirname,
    `../node_modules/${packageName}/font/bootstrap-icons.css`
  ),
  to: resolve(distFolder, 'bootstrap-icons.css'),
  replaceFn: content =>
    content.replace(
      /src:[^;]+;/,
      'src: url("./bootstrap-icons.woff2") format("woff2");'
    )
})

fse.copySync(
  resolve(import.meta.dirname, `../node_modules/${packageName}/LICENSE`),
  resolve(distFolder, 'LICENSE')
)

// write the JSON file
const file = resolve(distFolder, 'icons.json')
writeFileSync(file, JSON.stringify([...iconNames].sort(), null, 2), 'utf8')

console.log(`${distName} done with ${iconNames.length} icons`)
