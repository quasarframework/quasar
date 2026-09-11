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

const packageName = 'eva-icons'
const distName = 'eva-icons'
const iconSetName = 'Eva-Icons'
const prefix = 'eva'

// ------------

const skipped = []
const distFolder = resolve(import.meta.dirname, '../exports/eva-icons')

const svgFolder = resolve(
  import.meta.dirname,
  `../node_modules/${packageName}/`
)
const iconTypes = ['fill', 'outline']
let iconNames = new Set()

const svgExports = []
const typeExports = []

iconTypes.forEach(type => {
  const svgFiles = globSync(svgFolder + `/${type}/svg/*.svg`)

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

const webfont = ['Eva-Icons.woff2']
const banner = getBanner('Eva Icons', packageName)

webfont.forEach(file => {
  fse.copySync(
    resolve(
      import.meta.dirname,
      `../node_modules/${packageName}/style/fonts/${file}`
    ),
    resolve(distFolder, file)
  )
})

copyCssFile({
  from: resolve(
    import.meta.dirname,
    `../node_modules/${packageName}/style/eva-icons.css`
  ),
  to: resolve(distFolder, 'eva-icons.css'),
  replaceFn: content =>
    banner +
    content
      .replace('@font-face {', '@font-face {\nfont-display: block;')
      .replace('src: url("./fonts/Eva-Icons.eot");', '')
      .replace(/src:[^;]+;/, 'src: url("./Eva-Icons.woff2") format("woff2");')
})

// write the JSON file
const file = resolve(distFolder, 'icons.json')
writeFileSync(file, JSON.stringify([...iconNames].sort(), null, 2), 'utf8')

console.log(`${distName} done with ${iconNames.length} icons`)
