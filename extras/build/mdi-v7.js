import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { globSync } from 'tinyglobby'
import fse from 'fs-extra'

import {
  copyCssFile,
  defaultNameMapper,
  extract,
  getBanner,
  writeExports
} from './utils.js'

const packageName = '@mdi/svg'
const distName = 'mdi-v7'
const iconSetName = 'MDI'
const prefix = 'mdi'

// ------------

const skipped = []
const distFolder = resolve(import.meta.dirname, `../exports/${distName}`)

const svgFolder = resolve(
  import.meta.dirname,
  `../node_modules/${packageName}/svg/`
)
const svgFiles = globSync(svgFolder + '/**/*.svg')
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

const banner = getBanner('MaterialDesignIcons.com', packageName)
const webfont = ['materialdesignicons-webfont.woff2']

webfont.forEach(file => {
  fse.copySync(
    resolve(import.meta.dirname, `../node_modules/@mdi/font/fonts/${file}`),
    resolve(distFolder, file)
  )
})

copyCssFile({
  from: resolve(
    import.meta.dirname,
    '../node_modules/@mdi/font/css/materialdesignicons.css'
  ),
  to: resolve(distFolder, 'mdi-v7.css'),
  replaceFn: content =>
    content
      .replace('/* MaterialDesignIcons.com */', banner)
      .replace('@font-face {', '@font-face {\n  font-display: block;')
      .replace('/*# sourceMappingURL=materialdesignicons.css.map */', '')
      // has two "src:" lines, remove first then replace second:
      .replace(/src:[^;]+;/, '')
      .replace(
        /src:[^;]+;/,
        'src: url("./materialdesignicons-webfont.woff2") format("woff2");'
      )
})

fse.copySync(
  resolve(import.meta.dirname, '../node_modules/@mdi/font/LICENSE'),
  resolve(distFolder, 'license.md')
)
fse.copySync(
  resolve(import.meta.dirname, '../node_modules/@mdi/svg/LICENSE'),
  resolve(distFolder, 'LICENSE')
)

// write the JSON file
const file = resolve(distFolder, 'icons.json')
writeFileSync(file, JSON.stringify([...iconNames].sort(), null, 2), 'utf8')

console.log(`${distName} done with ${iconNames.length} icons`)
