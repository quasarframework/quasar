import { compileAsync } from 'sass-embedded'
import rtl from 'postcss-rtlcss'
import postcss from 'postcss'
import { transform } from 'lightningcss'

import {
  BUILD_TARGETS,
  banner,
  readFile,
  resolveToRoot,
  writeFile
} from './build.utils.js'

const postCssRtl = postcss([rtl({ mode: 'override' })])
const sassUseRE = /@use\s+['"][^'"]+['"]/g

function moveUseStatementsToTop(code) {
  const useStatements = code.match(sassUseRE)

  return useStatements === null
    ? code
    : [...new Set(useStatements)].join('\n') +
        '\n' +
        code.replace(sassUseRE, '')
}

function compileSass(src) {
  return compileAsync(src, {
    silenceDeprecations: ['import']
  })
}

function getConcatenatedContent(src) {
  let code = ''

  src.forEach(file => {
    code += readFile(file) + '\n'
  })

  code = code
    // remove imports
    .replaceAll(/@import\s+'[^']+'[\s\r\n]+/g, '')
    // remove comments
    .replaceAll(/(\/\*[\w'-.,`\s\r\n*@]*\*\/)|(\/\/[^\r\n]*)/g, '')

  code = moveUseStatementsToTop(code)
    // remove unnecessary newlines
    .replaceAll(/[\r\n]+/g, '\r\n')

  return banner + code
}

function generateUMD(code, middleName, ext = '') {
  return writeFile(`dist/quasar${middleName}${ext}.css`, code, {
    summary: true,
    gzip: true
  }).then(textCode => {
    const { code: transformedCode } = transform({
      code: Buffer.from(textCode),
      minify: true,
      targets: BUILD_TARGETS.LIGHTNING_CSS
    })

    return writeFile(
      `dist/quasar${middleName}${ext}.prod.css`,
      transformedCode,
      { summary: true, gzip: true }
    )
  })
}

function renderAsset(cssCode, middleName = '') {
  return Promise.all([
    generateUMD(cssCode, middleName),
    postCssRtl
      .process(cssCode, { from: void 0 })
      .then(transformedCode =>
        generateUMD(transformedCode.css, middleName, '.rtl')
      )
  ])
}

async function generateBase(source) {
  const src = resolveToRoot(source)
  const sassDistDest = resolveToRoot('dist/quasar.sass')

  const result = await compileSass(src)

  // remove @charset declaration -- breaks Vite usage
  const cssCode = result.css.toString().replace('@charset "UTF-8";', '')
  const depsList = result.loadedUrls
  const concatenatedContent = getConcatenatedContent(depsList)

  return Promise.all([
    renderAsset(cssCode),
    writeFile(sassDistDest, concatenatedContent)
  ])
}

async function generateAddon(source) {
  const src = resolveToRoot(source)

  const result = await compileSass(src)
  const cssCode = result.css.toString()

  return renderAsset(cssCode, '.addon')
}

export async function buildCss(withDiff) {
  if (withDiff) {
    const { prepareDiff } = await import('./prepare-diff.js')
    prepareDiff('dist/quasar.sass')
  }

  await Promise.all([
    generateBase('src/css/index.sass'),
    generateAddon('src/css/flex-addon.sass')
  ]).catch(err => {
    console.error(err)
    process.exit(1)
  })
}
