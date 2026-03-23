import { compileAsync } from 'sass-embedded'
import rtl from 'postcss-rtlcss'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import { transform } from 'lightningcss'

import {
  banner,
  resolveToRoot,
  readFile,
  writeFile,
  BUILD_TARGETS
} from './build.utils.js'
import prepareDiff from './prepare-diff.js'

const sassUseRE = /@use\s+['"][^'"]+['"]/g

function moveUseStatementsToTop(code) {
  const useStatements = code.match(sassUseRE)

  return useStatements === null
    ? code
    : Array.from(new Set(useStatements)).join('\n') +
        '\n' +
        code.replace(sassUseRE, '')
}

function compileSass(src) {
  return compileAsync(src, {
    silenceDeprecations: ['import']
  })
}

function getConcatenatedContent(src, noBanner) {
  return new Promise(resolve => {
    let code = ''
    const localBanner = noBanner !== true ? banner : ''

    src.forEach(file => {
      code += readFile(file) + '\n'
    })

    code = code
      // remove imports
      .replace(/@import\s+'[^']+'[\s\r\n]+/g, '')
      // remove comments
      .replace(/(\/\*[\w'-.,`\s\r\n*@]*\*\/)|(\/\/[^\r\n]*)/g, '')

    code = moveUseStatementsToTop(code)
      // remove unnecessary newlines
      .replace(/[\r\n]+/g, '\r\n')

    resolve(localBanner + code)
  })
}

function generateUMD(code, middleName, ext = '') {
  return writeFile(`dist/quasar${middleName}${ext}.css`, code, true).then(
    textCode => {
      const { code: transformedCode } = transform({
        code: Buffer.from(textCode),
        minify: true,
        targets: BUILD_TARGETS.LIGHTNING_CSS
      })

      return writeFile(
        `dist/quasar${middleName}${ext}.prod.css`,
        transformedCode,
        true
      )
    }
  )
}

function renderAsset(cssCode, middleName = '') {
  return postcss([
    autoprefixer({
      overrideBrowserslist: BUILD_TARGETS.AUTOPREFIXER
    })
  ])
    .process(cssCode, { from: void 0 })
    .then(code => {
      code.warnings().forEach(warn => {
        console.warn(warn.toString())
      })
      return code.css
    })
    .then(code =>
      Promise.all([
        generateUMD(code, middleName),
        postcss([rtl({})])
          .process(code, { from: void 0 })
          .then(transformedCode =>
            generateUMD(transformedCode.css, middleName, '.rtl')
          )
      ])
    )
}

async function generateBase(source) {
  const src = resolveToRoot(source)
  const sassDistDest = resolveToRoot('dist/quasar.sass')

  const result = await compileSass(src)

  // remove @charset declaration -- breaks Vite usage
  const cssCode = result.css.toString().replace('@charset "UTF-8";', '')
  const depsList = result.loadedUrls

  return Promise.all([
    renderAsset(cssCode),

    getConcatenatedContent(depsList).then(code => writeFile(sassDistDest, code))
  ])
}

async function generateAddon(source) {
  const src = resolveToRoot(source)

  const result = await compileSass(src)
  const cssCode = result.css.toString()

  return renderAsset(cssCode, '.addon')
}

export function buildCss(withDiff) {
  if (withDiff === true) {
    prepareDiff('dist/quasar.sass')
  }

  Promise.all([
    generateBase('src/css/index.sass'),
    generateAddon('src/css/flex-addon.sass')
  ]).catch(e => {
    console.error(e)
    process.exit(1)
  })
}
