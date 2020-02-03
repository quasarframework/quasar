const packageName = 'material-design-icons'

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { copySync } = require('fs-extra')
const { resolve } = require('path')

let skipped = []
const dist = resolve(__dirname, `../material-icons/index.js`)
const { parseSvgContent } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/`)
const svgFiles = glob.sync(svgFolder + '/*/svg/production/ic_*_24px.svg')
const iconNames = new Set()

function extract (file) {
  const name = ('mat_' + file.match(/ic_(.*)_24px\.svg/)[1])
    .replace(/(_\w)/g, m => m[1].toUpperCase())

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
  return `/* Google Material Design Icons v${version} */\n\n`
}

const svgExports = []

svgFiles.forEach(file => {
  svgExports.push(extract(file))
})

if (svgExports.length === 0) {
  console.log('WARNING. Material-icons skipped completely')
}
else {
  writeFileSync(dist, getBanner() + svgExports.filter(x => x !== null).join('\n'), 'utf-8')

  if (skipped.length > 0) {
    console.log(`material-icons - skipped (${skipped.length}): ${skipped}`)
  }
}

copySync(
  resolve(__dirname, `../node_modules/${packageName}/LICENSE`),
  resolve(__dirname, `../material-icons/LICENSE`)
)
