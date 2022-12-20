<template>
  <q-card flat bordered>
    <q-card-section class="q-gutter-xs q-pa-sm">
      <q-toggle v-model="css['roboto-font']" label="Roboto font" />
      <q-toggle v-model="css['roboto-font-latin-ext']" label="Roboto font extended" />
      <q-toggle v-model="css.animate" label="Animations from Animate.css" />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-gutter-xs q-pa-sm">
      <q-toggle v-model="css['material-icons']" label="Material Icons" />
      <q-toggle v-model="css['material-icons-outlined']" label="Material Icons (Outlined)" />
      <q-toggle v-model="css['material-icons-round']" label="Material Icons (Round)" />
      <q-toggle v-model="css['material-icons-sharp']" label="Material Icons (Sharp)" />
      <q-toggle v-model="css['material-symbols-outlined']" label="Material Symbols (Outlined)" />
      <q-toggle v-model="css['material-symbols-rounded']" label="Material Symbols (Rounded)" />
      <q-toggle v-model="css['material-symbols-sharp']" label="Material Symbols (Sharp)" />
      <q-toggle v-model="css['mdi-v7']" label="MDI v7" />
      <q-toggle v-model="css['fontawesome-v6']" label="Fontawesome v6" />
      <q-toggle v-model="css['fontawesome-v5']" label="Fontawesome v5" />
      <q-toggle v-model="css['ionicons-v4']" label="Ionicons v4" />
      <q-toggle v-model="css['eva-icons']" label="Eva Icons" />
      <q-toggle v-model="css.themify" label="Themify" />
      <q-toggle v-model="css['line-awesome']" label="Line Awesome" />
      <q-toggle v-model="css['bootstrap-icons']" label="Bootstrap Icons" />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-gutter-xs q-pa-sm row items-center">
      <q-select
        label="Auto-import component case"
        dense
        outlined
        :options="autoImportCaseOptions"
        emit-value
        map-options
        options-dense
        v-model="autoImportCase"
        style="width: 200px"
      />

      <q-toggle v-model="useSassVariables" label="Quasar Sass/SCSS variables" />
      <q-toggle v-model="cfgObject" label="Quasar Config Object" />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-col-gutter-sm q-pa-sm row">
      <div class="col-xs-12 col-md-6">
        <q-select
          label="Quasar Language Pack"
          dense
          outlined
          :options="langOptions"
          emit-value
          map-options
          options-dense
          v-model="lang"
          style="width: 100%"
        />
      </div>
      <div class="col-xs-12 col-md-6">
        <q-select
          label="Quasar Icon Set"
          dense
          outlined
          :options="iconSetOptions"
          options-dense
          emit-value
          map-options
          v-model="iconSet"
        />
      </div>
    </q-card-section>

    <q-separator />

    <doc-code class="relative-position" lang="js" :code="fileMainJs" />

    <q-separator />

    <doc-code class="relative-position" lang="js" :code="fileViteConfigJs" />

    <template v-if="useSassVariables">
      <q-separator />
      <doc-code class="relative-position" :code="fileSassVariables" />
    </template>
  </q-card>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import languages from 'quasar/lang/index.json'

import DocCode from 'src/components/DocCode.vue'

const extrasOptions = [
  'roboto-font',
  'roboto-font-latin-ext',
  'material-icons',
  'material-icons-outlined',
  'material-icons-round',
  'material-icons-sharp',
  'material-symbols-outlined',
  'material-symbols-rounded',
  'material-symbols-sharp',
  'mdi-v7',
  'fontawesome-v5',
  // must come after v5 if used together: https://fontawesome.com/v6/docs/web/setup/upgrade/#if-you-re-unable-to-remove-font-awesome-5
  'fontawesome-v6',
  'ionicons-v4',
  'eva-icons',
  'themify',
  'line-awesome',
  'bootstrap-icons'
]

const langOptions = languages.map(lang => ({ label: lang.nativeName, value: lang.isoName }))

const iconSetOptions = [
  { label: 'Material (webfont)', value: 'material-icons' },
  { label: 'Material (svg)', value: 'svg-material-icons' },
  { label: 'Material Outlined (webfont)', value: 'material-icons-outlined' },
  { label: 'Material Round (webfont)', value: 'material-icons-round' },
  { label: 'Material Sharp (webfont)', value: 'material-icons-sharp' },
  { label: 'Material Symbols Outlined (webfont)', value: 'material-symbols-outlined' },
  { label: 'Material Symbols Round (webfont)', value: 'material-symbols-rounded' },
  { label: 'Material Symbols Sharp (webfont)', value: 'material-symbols-sharp' },
  { label: 'MDI v6 (webfont)', value: 'mdi-v7' },
  { label: 'MDI v6 (svg)', value: 'svg-mdi-v7' },
  { label: 'Ionicons v6 (svg)', value: 'svg-ionicons-v6' },
  { label: 'Ionicons v5 (svg)', value: 'svg-ionicons-v5' },
  { label: 'Ionicons v4 (webfont)', value: 'ionicons-v4' },
  { label: 'Ionicons v4 (svg)', value: 'svg-ionicons-v4' },
  { label: 'Fontawesome v6 (webfont)', value: 'fontawesome-v6' },
  { label: 'Fontawesome v6 (svg)', value: 'svg-fontawesome-v6' },
  { label: 'Fontawesome v5 (webfont)', value: 'fontawesome-v5' },
  { label: 'Fontawesome v5 (svg)', value: 'svg-fontawesome-v5' },
  { label: 'Eva Icons (webfont)', value: 'eva-icons' },
  { label: 'Eva Icons (svg)', value: 'svg-eva-icons' },
  { label: 'Themify (webfont)', value: 'themify' },
  { label: 'Themify (svg)', value: 'svg-themify' },
  { label: 'Line Awesome (webfont)', value: 'line-awesome' },
  { label: 'Line Awesome (svg)', value: 'svg-line-awesome' },
  { label: 'Bootstrap Icons (webfont)', value: 'bootstrap-icons' },
  { label: 'Bootstrap Icons (svg)', value: 'svg-bootstrap-icons' }
]

const autoImportCaseOptions = [
  'kebab',
  'pascal',
  'combined'
]

const css = reactive({
  'roboto-font': false,
  'roboto-font-latin-ext': false,

  'material-icons': true,
  'material-icons-outlined': false,
  'material-icons-round': false,
  'material-icons-sharp': false,

  'material-symbols-outlined': false,
  'material-symbols-rounded': false,
  'material-symbols-sharp': false,

  'mdi-v7': false,
  'fontawesome-v6': false,
  'fontawesome-v5': false,
  'ionicons-v4': false,
  'eva-icons': false,
  themify: false,
  'line-awesome': false,
  'bootstrap-icons': false,

  animate: false
})

watch(() => css[ 'roboto-font' ], val => {
  if (val === true) {
    css[ 'roboto-font-latin-ext' ] = false
  }
})

watch(() => css[ 'roboto-font-latin-ext' ], val => {
  if (val === true) {
    css[ 'roboto-font' ] = false
  }
})

const cfgObject = ref(false)
const useSassVariables = ref(true) // Vite plugin cfg
const autoImportCase = ref('kebab') // Vite plugin cfg
const lang = ref('en-US')
const iconSet = ref('material-icons')

const cssImport = computed(() => {
  const acc = extrasOptions
    .filter(key => css[ key ] === true)
    .map(key => `import '@quasar/extras/${key}/${key}.css'`)

  if (
    iconSet.value !== 'material-icons' &&
    iconSet.value.startsWith('svg-') === false
  ) {
    const key = iconSet.value
    const importValue = `import '@quasar/extras/${key}/${key}.css'`
    if (acc.includes(importValue) === false) {
      acc.push(`// ..required because of selected iconSet:\n${importValue}`)
    }
  }

  const libs = acc.length > 0
    ? `// Import icon libraries\n${acc.join('\n')}\n\n`
    : ''

  const animExample = css.animate === true
    ? `// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css\n\n`
    : ''

  const quasarCssPath = useSassVariables.value === true
    ? 'src/css/index.sass'
    : 'dist/quasar.css'

  return `${libs}${animExample}// Import Quasar css
import 'quasar/${quasarCssPath}'`
})

const jsImport = computed(() => {
  const acc = []

  if (lang.value !== 'en-US') {
    acc.push(`import quasarLang from 'quasar/lang/${lang.value}'`)
  }

  if (iconSet.value !== 'material-icons') {
    acc.push(`import quasarIconSet from 'quasar/icon-set/${iconSet.value}'`)
  }

  return `${acc.length > 0 ? '\n' : ''}${acc.join('\n')}`
})

const configInstantiation = computed(() => {
  let str = '\n  plugins: {}, // import Quasar plugins and add here'

  if (lang.value !== 'en-US') {
    str += '\n  lang: quasarLang,'
  }

  if (iconSet.value !== 'material-icons') {
    str += '\n  iconSet: quasarIconSet,'
  }

  if (cfgObject.value === true) {
    str += `\n  /*
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

  return `, {${str}\n}`
})

const fileMainJs = computed(() => {
  return `// FILE: main.js

import { createApp } from 'vue'
import { Quasar } from '` + 'quasar' + `'${jsImport.value}

${cssImport.value}

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const myApp = createApp(App)

myApp.use(Quasar${configInstantiation.value})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
`
})

const vitePluginOptions = computed(() => {
  const acc = []

  if (autoImportCase.value !== 'kebab') {
    acc.push(`      autoImportComponentCase: '${autoImportCase.value}'`)
  }

  if (useSassVariables.value === true) {
    acc.push('      sassVariables: \'src/quasar-variables.sass\'')
  }

  return acc.length === 0
    ? ''
    : `{\n${acc.join(',\n')}\n    }`
})

const fileViteConfigJs = computed(() => {
  return `// FILE: vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar(${vitePluginOptions.value})
  ]
})
`
})

const fileSassVariables = computed(() => {
  return `// FILE (create it): src/quasar-variables.sass

$primary   : #1976D2
$secondary : #26A69A
$accent    : #9C27B0

$dark      : #1D1D1D

$positive  : #21BA45
$negative  : #C10015
$info      : #31CCEC
$warning   : #F2C037
`
})
</script>
