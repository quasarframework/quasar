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

const packageName = 'line-awesome'
const distName = 'line-awesome'
const iconSetName = 'Line Awesome'

// ------------

const skipped = []
const distFolder = resolve(import.meta.dirname, '../exports/line-awesome')

const svgFolder = resolve(
  import.meta.dirname,
  `../node_modules/${packageName}/svg/`
)
const svgFiles = globSync(svgFolder + '/*.svg')
let iconNames = new Set()

const svgExports = []
const typeExports = []

svgFiles.forEach(file => {
  const name = defaultNameMapper(file, 'la')

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

const banner = getBanner('Line Awesome', packageName)
const webfont = [
  'la-brands-400.woff2',
  'la-regular-400.woff2',
  'la-solid-900.woff2'
]

webfont.forEach(file => {
  fse.copySync(
    resolve(
      import.meta.dirname,
      `../node_modules/${packageName}/dist/line-awesome/fonts/${file}`
    ),
    resolve(distFolder, file)
  )
})

copyCssFile({
  from: resolve(
    import.meta.dirname,
    `../node_modules/${packageName}/dist/line-awesome/css/line-awesome.css`
  ),
  to: resolve(distFolder, 'line-awesome.css'),
  replaceFn: content =>
    banner +
    content
      .replaceAll('font-display: auto;', 'font-display: block;')
      .replace(/src:[^;]+la-brands-400[^;]+;/, '')
      .replace(
        /src:[^;]+la-brands-400[^;]+;/,
        'src: url("./la-brands-400.woff2") format("woff2");'
      )
      .replace(/src:[^;]+la-regular-400[^;]+;/, '')
      .replace(
        /src:[^;]+la-regular-400[^;]+;/,
        'src: url("./la-regular-400.woff2") format("woff2");'
      )
      .replace(/src:[^;]+la-solid-900[^;]+;/, '')
      .replace(
        /src:[^;]+la-solid-900[^;]+;/,
        'src: url("./la-solid-900.woff2") format("woff2");'
      )
})

fse.copySync(
  resolve(import.meta.dirname, `../node_modules/${packageName}/LICENSE.md`),
  resolve(distFolder, 'LICENSE.md')
)

// write the JSON file
const file = resolve(distFolder, 'icons.json')
writeFileSync(file, JSON.stringify([...iconNames].sort(), null, 2), 'utf8')

console.log(`${distName} done with ${iconNames.length} icons`)
