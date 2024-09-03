import { compileAsync } from 'sass-embedded'
import rtl from 'postcss-rtlcss'
import postcss from 'postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'

import { banner, resolveToRoot, readFile, writeFile } from './build.utils.js'
import prepareDiff from './prepare-diff.js'

const nano = postcss([
  cssnano({
    preset: [ 'default', {
      mergeLonghand: false,
      convertValues: false,
      cssDeclarationSorter: false,
      reduceTransforms: false
    } ]
  })
])

const sassUseRE = /@use\s+['"][^'"]+['"]/g

function moveUseStatementsToTop (code) {
  const useStatements = code.match(sassUseRE)

  return useStatements === null
    ? code
    : Array.from(new Set(useStatements)).join('\n')
      + '\n'
      + code.replace(sassUseRE, '')
}

function getConcatenatedContent (src, noBanner) {
  return new Promise(resolve => {
    let code = ''
    const localBanner = noBanner !== true
      ? banner
      : ''

    src.forEach(file => {
      code += readFile(file) + '\n'
    })

    code = code
      // remove imports
      .replace(/@import\s+'[^']+'[\s\r\n]+/g, '')
      // remove comments
      .replace(/(\/\*[\w'-.,`\s\r\n*@]*\*\/)|(\/\/[^\r\n]*)/g, '')
      // remove unnecessary newlines
      .replace(/[\r\n]+/g, '\r\n')

    resolve(
      localBanner + moveUseStatementsToTop(code)
    )
  })
}

function generateUMD (code, middleName, ext = '') {
  return writeFile(`dist/quasar${ middleName }${ ext }.css`, code, true)
    .then(code => nano.process(code, { from: void 0 }))
    .then(code => writeFile(`dist/quasar${ middleName }${ ext }.prod.css`, code.css, true))
}

function renderAsset (cssCode, middleName = '') {
  return postcss([ autoprefixer ]).process(cssCode, { from: void 0 })
    .then(code => {
      code.warnings().forEach(warn => {
        console.warn(warn.toString())
      })
      return code.css
    })
    .then(code => Promise.all([
      generateUMD(code, middleName),
      postcss([ rtl({}) ]).process(code, { from: void 0 })
        .then(code => generateUMD(code.css, middleName, '.rtl'))
    ]))
}

async function generateBase (source) {
  const src = resolveToRoot(source)
  const sassDistDest = resolveToRoot('dist/quasar.sass')

  const result = await compileAsync(src)

  // remove @charset declaration -- breaks Vite usage
  const cssCode = result.css.toString().replace('@charset "UTF-8";', '')
  const depsList = result.loadedUrls

  return Promise.all([
    renderAsset(cssCode),

    getConcatenatedContent(depsList)
      .then(code => writeFile(sassDistDest, code))
  ])
}

async function generateAddon (source) {
  const src = resolveToRoot(source)

  const result = await compileAsync(src)
  const cssCode = result.css.toString()

  return renderAsset(cssCode, '.addon')
}

export function buildCss (withDiff) {
  if (withDiff === true) {
    prepareDiff('dist/quasar.sass')
  }

  Promise
    .all([
      generateBase('src/css/index.sass'),
      generateAddon('src/css/flex-addon.sass')
    ])
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
}
