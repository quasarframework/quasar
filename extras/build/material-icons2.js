const packageName = 'material-design-icons'
const iconSetName = 'Google Material Design Icons'

// ------------

const { copySync } = require('fs-extra')
const { resolve } = require('path')
const fetch = require('cross-fetch')

let skipped = {}
let distFolder = {}
// const distFolder = resolve(__dirname, `../material-icons`)
const { extractSvg, writeExports, Queue, sleep, retry } = require('./utils')

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/`)
const iconNames = {}

const svgExports = {}
const typeExports = {}

const themeMap = {
  baseline: '', // filled
  outlined: '_outlined',
  round: '_round',
  // twotone: '_two_tone',
  sharp: '_sharp',
}

function downloadIcon(icon) {
  // console.log(`downloadIcon ${icon.index}: ${icon.name}`)

  return Promise.all(
    Object.keys(themeMap).map(async (theme) => {
      const themeName = themeMap[theme]
      const formattedTheme = themeName.split('_').join('')
      const response = await fetch(
        `https://fonts.gstatic.com/s/i/materialicons${formattedTheme}/${icon.name}/v${icon.version}/24px.svg`,
      )
      if (response.status !== 200) {
        throw new Error(`status ${response.status}`)
      }
      const SVG = await response.text()
      const name = ((themeName === '' ? 'mat_' : theme + '_') + icon.name)
        .replace(/(_\w)/g, m => m[1].toUpperCase())

      if (iconNames[theme].has(name)) {
        return
      }

      try {
        const { svgDef, typeDef } = extractSvg(SVG, name)
        svgExports[theme].push(svgDef)
        typeExports[theme].push(typeDef)

        iconNames[theme].add(name)
      }
      catch(err) {
        console.error(err)
        skipped[theme].push(name)
      }
    }),
  )
}

async function run() {
  try {
    const response = await fetch('https://fonts.google.com/metadata/icons')
    const text = await response.text()
    const data = JSON.parse(text.replace(")]}'", ''))
    let icons = data.icons
    icons = icons.map((icon, index) => ({ index, ...icon }))

    console.log('\nDownloading Google Material Design SVGs...')
    console.log(`${icons.length} icons to download...`)

    Object.keys(themeMap).map(async (theme) => {
      if (skipped[theme] === void 0) skipped[theme] = []
      if (svgExports[theme] === void 0) svgExports[theme] = []
      if (typeExports[theme] === void 0) typeExports[theme] = []
      if (iconNames[theme] === void 0) iconNames[theme] = new Set()
      if (distFolder[theme] === void 0) distFolder[theme] = resolve(__dirname, `../material-icons${themeMap[theme]}`).replace(/_/g, '-')
    })

    const queue = new Queue(
      async (icon) => {
        await retry(async ({ tries }) => {
          await sleep((tries - 1) * 100)
          await downloadIcon(icon)
        })
      },
      { concurrency: 5 },
    )
    queue.push(icons)
    await queue.wait({ empty: true })

    console.log('')
    Object.keys(themeMap).map(async (theme) => {
      console.log((`Updating SVG for ../material-icons${themeMap[theme]}`).replace(/_/g, '-'))
      writeExports(iconSetName, packageName, distFolder[theme], svgExports[theme], typeExports[theme], skipped[theme])

      copySync(
        resolve(__dirname, `../node_modules/${packageName}/LICENSE`),
        resolve(__dirname, `../material-icons${themeMap[theme]}/LICENSE`).replace(/_/g, '-')
      )
    })
  } catch (err) {
    console.log('err', err)
    throw err
  }

  process.exit(0)
}

run()
