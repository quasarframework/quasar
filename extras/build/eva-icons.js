const packageName = 'eva-icons'

// ------------

const glob = require('glob')
const { copySync } = require('fs-extra')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = []
const dist = resolve(__dirname, `../eva-icons/index.js`)
const { parseSvgContent } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/`)
const iconTypes = ['fill', 'outline']
const iconNames = new Set()

function extract (file) {
  const name = ('eva-' + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

  if (iconNames.has(name)) {
    return null
  }

  const content = readFileSync(file, 'utf-8')

  try {
    const { dPath, viewBox } = parseSvgContent(name, content)

    iconNames.add(name)
    return `export const ${name} = '${dPath}${viewBox}'`
  }
  catch (err) {
    console.error(err)
    skipped.push(name)
    return null
  }
}

function getBanner () {
  const { version } = require(resolve(__dirname, `../node_modules/${packageName}/package.json`))
  return `/* Fontawesome Free v${version} */\n\n`
}

const svgExports = []

iconTypes.forEach(type => {
  const svgFiles = glob.sync(svgFolder + `/${type}/svg/*.svg`)

  svgFiles.forEach(file => {
    svgExports.push(extract(file))
  })
})

if (svgExports.length === 0) {
  console.log('WARNING. Eva-icons skipped completely')
}
else {
  writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

  if (skipped.length > 0) {
    console.log(`eva-icons - skipped (${skipped.length}): ${skipped}`)
  }
}

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
