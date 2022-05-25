const packageName = ''
const iconSetName = 'Google Material Design Symbols'
const prefix = 'sym_'

// ------------

const { resolve } = require('path')
const fetch = require('cross-fetch')
const { writeFileSync } = require('fs')

const cpus = require('os').cpus().length
const maxJobCount = cpus * 2 - 1 || 1

const skipped = {}
const distFolder = {}
const iconNames = {}
const svgExports = {}
const typeExports = {}

const { extractSvg, writeExports, Queue, sleep, retry } = require('./utils')

const themeMap = {
  outlined: 'Material Symbols Outlined',
  rounded: 'Material Symbols Rounded',
  sharp: 'Material Symbols Sharp'
  // We could do twotone, as they use opacity, but parsing fails
  // on 'twotoneMedicationLiquid' because of SVG 'use' directive
  // twotone: '_twotone'
}

function downloadIcon(icon) {
  return Promise.all(
    Object.keys(themeMap).map(async (theme) => {
      // get future icon name
      const themeName = theme
      const name = (prefix + theme + '_' + icon.name)
        .replace(/(_\w)/g, m => m[1].toUpperCase())

      if (iconNames[theme].has(name)) {
        return
      }

      const formattedTheme = themeName.split('_').join('')
      const url = `https://fonts.gstatic.com/s/i/short-term/release/materialsymbols${formattedTheme}/${icon.name}/default/24px.svg`
      // console.log(url)
      const response = await fetch(url)


      if (response.status !== 200) {
        skipped[theme].push(name)
        return
        // throw new Error(`status ${response.status}`)
      }

      const SVG = await response.text()

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

async function run () {
  try {
    const response = await fetch('https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true')
    const text = await response.text()
    const data = JSON.parse(text.replace(")]}'", ''))
    let icons = []
    data.icons.forEach(val => {
      for (const family in themeMap) {
        if (val.unsupported_families.includes(themeMap[family])) {
          return
        }
      }
      icons.push(val)
    })
    icons = icons.map((icon, index) => ({ index, ...icon }))

    console.log('\nDownloading Google Material Design Symbols SVGs...')
    console.log(`${icons.length} * ${Object.keys(themeMap).length} icons to download...(${icons.length * Object.keys(themeMap).length})`)

    Object.keys(themeMap).map(async (theme) => {
      if (skipped[theme] === void 0) skipped[theme] = []
      if (svgExports[theme] === void 0) svgExports[theme] = []
      if (typeExports[theme] === void 0) typeExports[theme] = []
      if (iconNames[theme] === void 0) iconNames[theme] = new Set()
      if (distFolder[theme] === void 0) distFolder[theme] = resolve(__dirname, `../material-symbols-${theme}`)
    })

    const queue = new Queue(
      async (icon) => {
        await retry(async ({ tries }) => {
          await sleep((tries - 1) * 100)
          await downloadIcon(icon)
        })
      },
      { concurrency: maxJobCount },
    )
    queue.push(icons)
    await queue.wait({ empty: true })

    console.log('')

    Object.keys(themeMap).map(async (theme) => {
      // convert from Set to an array
      iconNames[theme] = [...iconNames[theme]]

      svgExports[theme].sort((a, b) => {
        return ('' + a).localeCompare(b)
      })
      typeExports[theme].sort((a, b) => {
        return ('' + a).localeCompare(b)
      })
      iconNames[theme].sort((a, b) => {
        return ('' + a).localeCompare(b)
      })

      console.log((`Updating SVG for ../material-symbols-${theme}; icon count: ${iconNames[theme].length}`))
      writeExports(iconSetName, packageName, distFolder[theme], svgExports[theme], typeExports[theme], skipped[theme])

      // write the JSON file
      const file = resolve(distFolder[theme], 'icons.json')
      writeFileSync(file, JSON.stringify(iconNames[theme], null, 2), 'utf-8')
    })
  } catch (err) {
    console.log('err', err)
    throw err
  }

  process.exit(0)
}

run()
