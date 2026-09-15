// The files the Vite plugin page shows: VitePluginUsage.vue lets the
// reader pick the options, the docs generator (build/mcp) writes the
// default pick.

export const extrasOptions = [
  'roboto-font',
  'material-icons',
  'material-icons-outlined',
  'material-icons-round',
  'material-icons-sharp',
  'material-symbols-outlined',
  'material-symbols-rounded',
  'material-symbols-sharp',
  'mdi-v7',
  'fontawesome-v7',
  'ionicons-v4',
  'eva-icons',
  'themify',
  'line-awesome',
  'bootstrap-icons'
]

export const iconSetOptions = [
  { label: 'Material (webfont)', value: 'material-icons' },
  { label: 'Material (svg)', value: 'svg-material-icons' },
  { label: 'Material Outlined (webfont)', value: 'material-icons-outlined' },
  { label: 'Material Round (webfont)', value: 'material-icons-round' },
  { label: 'Material Sharp (webfont)', value: 'material-icons-sharp' },
  {
    label: 'Material Symbols Outlined (webfont)',
    value: 'material-symbols-outlined'
  },
  {
    label: 'Material Symbols Round (webfont)',
    value: 'material-symbols-rounded'
  },
  {
    label: 'Material Symbols Sharp (webfont)',
    value: 'material-symbols-sharp'
  },
  { label: 'MDI v7 (webfont)', value: 'mdi-v7' },
  { label: 'MDI v7 (svg)', value: 'svg-mdi-v7' },
  { label: 'Ionicons v8 (svg)', value: 'svg-ionicons-v8' },
  { label: 'Ionicons v4 (webfont)', value: 'ionicons-v4' },
  { label: 'Ionicons v4 (svg)', value: 'svg-ionicons-v4' },
  { label: 'Fontawesome v7 (webfont)', value: 'fontawesome-v7' },
  { label: 'Fontawesome v7 (svg)', value: 'svg-fontawesome-v7' },
  { label: 'Eva Icons (webfont)', value: 'eva-icons' },
  { label: 'Eva Icons (svg)', value: 'svg-eva-icons' },
  { label: 'Themify (webfont)', value: 'themify' },
  { label: 'Themify (svg)', value: 'svg-themify' },
  { label: 'Line Awesome (webfont)', value: 'line-awesome' },
  { label: 'Line Awesome (svg)', value: 'svg-line-awesome' },
  { label: 'Bootstrap Icons (webfont)', value: 'bootstrap-icons' },
  { label: 'Bootstrap Icons (svg)', value: 'svg-bootstrap-icons' }
]

export const autoImportCaseOptions = ['kebab', 'pascal', 'combined']

export const defaultCss = {
  'roboto-font': false,

  'material-icons': true,
  'material-icons-outlined': false,
  'material-icons-round': false,
  'material-icons-sharp': false,

  'material-symbols-outlined': false,
  'material-symbols-rounded': false,
  'material-symbols-sharp': false,

  'mdi-v7': false,
  'fontawesome-v7': false,
  'ionicons-v4': false,
  'eva-icons': false,
  themify: false,
  'line-awesome': false,
  'bootstrap-icons': false,

  animate: false
}

export const defaultOptions = {
  css: defaultCss,
  cfgObject: false,
  useSassVariables: true,
  autoImportCase: 'kebab',
  lang: 'en-US',
  iconSet: 'material-icons'
}

export const sassVariablesFile = `// Create: src/quasar-variables.sass

$primary   : #1976D2
$secondary : #26A69A
$accent    : #9C27B0

$dark      : #1D1D1D

$positive  : #21BA45
$negative  : #C10015
$info      : #31CCEC
$warning   : #F2C037`

/**
 * @param {{ css: Record<string, boolean>, cfgObject: boolean, useSassVariables: boolean, lang: string, iconSet: string }} options
 * @returns {string}
 */
export function buildMainJs({
  css,
  cfgObject,
  useSassVariables,
  lang,
  iconSet
}) {
  const cssAcc = extrasOptions
    .filter(key => css[key])
    .map(key => `import '@quasar/extras/${key}/${key}.css'`)

  if (iconSet !== 'material-icons' && !iconSet.startsWith('svg-')) {
    const importValue = `import '@quasar/extras/${iconSet}/${iconSet}.css'`
    if (!cssAcc.includes(importValue)) {
      cssAcc.push(`// ..required because of selected iconSet:\n${importValue}`)
    }
  }

  const libs =
    cssAcc.length !== 0
      ? `// Import icon libraries\n${cssAcc.join('\n')}\n\n`
      : ''

  const animExample = css.animate
    ? `// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css\n\n`
    : ''

  const quasarCssPath = useSassVariables
    ? 'src/css/index.sass'
    : 'dist/quasar.css'
  const cssImport = `${libs}${animExample}// Import Quasar css
import 'quasar/${quasarCssPath}'`

  const jsAcc = []
  if (lang !== 'en-US') {
    jsAcc.push(`import quasarLang from 'quasar/lang/${lang}'`)
  }
  if (iconSet !== 'material-icons') {
    jsAcc.push(`import quasarIconSet from 'quasar/icon-set/${iconSet}'`)
  }
  const jsImport = `${jsAcc.length !== 0 ? '\n' : ''}${jsAcc.join('\n')}`

  let config = '\n  plugins: {}, // import Quasar plugins and add here'
  if (lang !== 'en-US') {
    config += '\n  lang: quasarLang,'
  }
  if (iconSet !== 'material-icons') {
    config += '\n  iconSet: quasarIconSet,'
  }
  if (cfgObject) {
    config += `\n  /*
  config: {
    brand: {
      // primary: '#e46262',
      // ... or all other brand colors
    },
    notify: {...}, // default set of options for Notify Quasar plugin
    loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  }\n  */`
  }

  return `// main.js

import { createApp } from 'vue'
import { Quasar } from 'quasar'${jsImport}

${cssImport}

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const myApp = createApp(App)

myApp.use(Quasar, {${config}
})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')`
}

/**
 * @param {{ useSassVariables: boolean, autoImportCase: string }} options
 * @returns {string}
 */
export function buildViteConfigJs({ useSassVariables, autoImportCase }) {
  const extraImports = useSassVariables
    ? "import { join } from 'node:path'\n"
    : ''

  const pluginOptions = []
  if (autoImportCase !== 'kebab') {
    pluginOptions.push(`      autoImportComponentCase: '${autoImportCase}'`)
  }
  if (useSassVariables) {
    pluginOptions.push(
      "      sassVariables: join(import.meta.dirname, 'src/quasar-variables.sass')"
    )
  }
  const vitePluginOptions =
    pluginOptions.length === 0 ? '' : `{\n${pluginOptions.join(',\n')}\n    }`

  return `// vite.config.js

${extraImports}import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar(${vitePluginOptions})
  ]
})`
}
