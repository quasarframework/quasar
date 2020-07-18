const packageName = ''
const iconSetName = 'Google Material Design Icons'

// ------------

const { resolve } = require('path')
const fetch = require('cross-fetch')

const skipped = {}
const distFolder = {}
const iconNames = {}
const svgExports = {}
const typeExports = {}

const { extractSvg, writeExports, Queue, sleep, retry } = require('./utils')

const themeMap = {
  baseline: '', // filled
  outlined: '_outlined',
  round: '_round',
  sharp: '_sharp',
}

function downloadIcon(icon) {
  return Promise.all(
    Object.keys(themeMap).map(async (theme) => {
      // get future icon name
      const themeName = themeMap[theme]
      const name = ((themeName === '' ? 'mat_' : theme + '_') + icon.name)
        .replace(/(_\w)/g, m => m[1].toUpperCase())

      if (iconNames[theme].has(name)) {
        return
      }

      const formattedTheme = themeName.split('_').join('')
      const response = await fetch(
        `https://fonts.gstatic.com/s/i/materialicons${formattedTheme}/${icon.name}/v${icon.version}/24px.svg`,
      )

      if (response.status !== 200) {
        skipped[theme].push(name)
        throw new Error(`status ${response.status}`)
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

async function run() {
  try {
    const response = await fetch('https://fonts.google.com/metadata/icons')
    const text = await response.text()
    const data = JSON.parse(text.replace(")]}'", ''))
    let icons = data.icons
    icons = icons.map((icon, index) => ({ index, ...icon }))
    const version = icons.reduce((a, b) => {
      return a.version > b.version ? a : b
    }).version

    console.log('\nDownloading Google Material Design SVG icons...')
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
    console.log(`SVG version is: ${version}`)

    Object.keys(themeMap).map(async (theme) => {
      svgExports[theme].sort((a, b) => {
        return ('' + a).localeCompare(b);
      })
      typeExports[theme].sort((a, b) => {
        return ('' + a).localeCompare(b);
      })

      console.log((`Updating SVG for ../material-icons${themeMap[theme]}`).replace(/_/g, '-'))
      writeExports(iconSetName, packageName, distFolder[theme], svgExports[theme], typeExports[theme], skipped[theme])
    })
  } catch (err) {
    console.log('err', err)
    throw err
  }

  process.exit(0)
}

run()
