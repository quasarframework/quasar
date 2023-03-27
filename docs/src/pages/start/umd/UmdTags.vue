<template>
  <q-card flat bordered>
    <q-card-section class="q-gutter-xs q-pa-sm">
      <q-toggle v-model="css.roboto" label="Roboto font" />
      <q-toggle v-model="css.animate" label="Animate.css" />
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

    <q-card-section class="q-gutter-xs q-pa-sm">
      <q-toggle v-model="cfgObject" label="Quasar Config Object" />
      <q-toggle v-model="minified" label="Minified files" />
      <q-toggle v-model="rtl" label="RTL CSS support" />
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

    <doc-code class="relative-position" lang="html" :code="output" />
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, reactive, computed } from 'vue'
import languages from 'quasar/lang/index.json'

import DocCode from 'src/components/DocCode.vue'

const cssMap = {
  'mdi-v7': 'cdn.jsdelivr.net/npm/@mdi/font@^7.0.0/css/materialdesignicons.min.css',
  'fontawesome-v5': 'use.fontawesome.com/releases/v5.15.4/css/all.css',
  // must come after v5 if used together: https://fontawesome.com/v6/docs/web/setup/upgrade/#if-you-re-unable-to-remove-font-awesome-5
  'fontawesome-v6': 'use.fontawesome.com/releases/v6.1.1/css/all.css',
  'ionicons-v4': 'cdn.jsdelivr.net/npm/ionicons@^4.0.0/dist/css/ionicons.min.css',
  'eva-icons': 'cdn.jsdelivr.net/npm/eva-icons@^1.0.0/style/eva-icons.css',
  themify: 'themify.me/wp-content/themes/themify-v32/themify-icons/themify-icons.css',
  'line-awesome': 'maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css',
  'bootstrap-icons': 'cdn.jsdelivr.net/npm/bootstrap-icons@^1.0.0/font/bootstrap-icons.css',
  animate: 'cdn.jsdelivr.net/npm/animate.css@^4.0.0/animate.min.css'
}

const googleMap = {
  roboto: 'Roboto:100,300,400,500,700,900',
  'material-icons': 'Material+Icons',
  'material-icons-outlined': 'Material+Icons+Outlined',
  'material-icons-round': 'Material+Icons+Round',
  'material-icons-sharp': 'Material+Icons+Sharp'
}

const googleSymbolsMap = {
  'material-symbols-outlined': 'Material+Symbols+Outlined',
  'material-symbols-rounded': 'Material+Symbols+Rounded',
  'material-symbols-sharp': 'Material+Symbols+Sharp'
}

const camelize = str => str.replace(/(-\w)/g, m => m[ 1 ].toUpperCase())

const { version } = useQuasar()
const langOptions = languages.map(lang => ({ label: lang.nativeName, value: lang.isoName }))
const iconSetOptions = [
  { label: 'Material (webfont)', value: 'material-icons' },
  { label: 'Material (svg)', value: 'svg-material-icons' },
  { label: 'Material Outlined (webfont)', value: 'material-icons-outlined' },
  { label: 'Material Round (webfont)', value: 'material-icons-round' },
  { label: 'Material Sharp (webfont)', value: 'material-icons-sharp' },
  { label: 'Material Symbols Outlined (webfont)', value: 'material-symbols-outlined' },
  { label: 'Material Symbols Rounded (webfont)', value: 'material-symbols-rounded' },
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

const css = reactive({
  roboto: true,

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

const minified = ref(true)
const rtl = ref(false)
const cfgObject = ref(false)
const lang = ref('en-US')
const iconSet = ref('material-icons')

function parseUrl (url) {
  const min = minified.value === false
    ? url.replace('.prod', '')
    : url

  return rtl.value === false
    ? min.replace('.rtl', '')
    : min
}

function getCssTag (url) {
  // funky form below, otherwise vue-loader will misinterpret
  return '<' + `link href="https://${parseUrl(url)}" rel="stylesheet" type="text/css"` + '>'
}

function getJsTag (url) {
  // funky form below, otherwise vue-loader will crash
  return '<' + `script src="https://${url}"` + '><' + '/script>'
}

const googleFonts = computed(() => {
  const cssAcc = Object.keys(googleMap)
    .filter(key => css[ key ] === true)
    .map(key => googleMap[ key ])

  return cssAcc.length === 0
    ? ''
    : `fonts.googleapis.com/css?family=${cssAcc.join('|')}`
})

const googleSymbolsFonts = computed(() => {
  const cssAcc = Object.keys(googleSymbolsMap)
    .filter(key => css[ key ] === true)
    .map(key => googleSymbolsMap[ key ])

  return cssAcc.length === 0
    ? ''
    : `fonts.googleapis.com/css2?family=${cssAcc.join('|')}`
})

const head = computed(() => {
  const cssAcc = Object.keys(cssMap)
    .filter(key => css[ key ] === true)
    .map(key => cssMap[ key ])

  cssAcc.unshift(googleSymbolsFonts.value)
  cssAcc.unshift(googleFonts.value)
  cssAcc.push(`cdn.jsdelivr.net/npm/quasar@${version}/dist/quasar.rtl.prod.css`)

  return cssAcc.filter(url => url)
    .map(url => getCssTag(url))
    .join('\n    ')
})

const configInstantiation = computed(() => {
  if (cfgObject.value === false) {
    return ''
  }

  return `, {
        config: {
          /*
          brand: {
            // primary: '#e46262',
            // ... or all other brand colors
          },
          notify: {...}, // default set of options for Notify Quasar plugin
          loading: {...}, // default set of options for Loading Quasar plugin
          loadingBar: { ... }, // settings for LoadingBar Quasar plugin
          // ..and many more (check Installation card on each Quasar component/directive/plugin)
          */
        }\n      }`
})

const postCreateApp = computed(() => {
  let str = ''

  if (lang.value !== 'en-US') {
    str += `Quasar.lang.set(Quasar.lang.${lang.value.replace(/-/g, '')})\n      `
  }

  if (iconSet.value !== 'material-icons') {
    str += `Quasar.iconSet.set(Quasar.iconSet.${camelize(iconSet.value)})\n      `
  }

  return str
})

const scriptTag = computed(() => {
  const startup = `
      /*
        Example kicking off the UI. Obviously, adapt this to your specific needs.
        Assumes you have a <div id="q-app"></div> in your <body> above
       */
      const app = Vue.createApp({
        setup () {
          return {}
        }
      })

      app.use(Quasar${configInstantiation.value})
      ${postCreateApp.value}app.mount('#q-app')
    `

  // funky form below otherwise vue-loader will crash
  return '\n    <' + `script>${startup}<` + '/script>'
})

const body = computed(() => {
  const js = [
    parseUrl('cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js'),
    parseUrl(`cdn.jsdelivr.net/npm/quasar@${version}/dist/quasar.umd.prod.js`)
  ]

  if (lang.value !== 'en-US') {
    js.push(`cdn.jsdelivr.net/npm/quasar@${version}/dist/lang/${lang.value}.umd.prod.js`)
  }

  if (iconSet.value !== 'material-icons') {
    js.push(`cdn.jsdelivr.net/npm/quasar@${version}/dist/icon-set/${iconSet.value}.umd.prod.js`)
  }

  return js.map(getJsTag).join('\n    ')
})

const output = computed(() => {
  return `<!DOCTYPE html>
<html>
  <!--
    WARNING! Make sure that you match all Quasar related
    tags to the same version! (Below it's "@${version}")
  -->

  <head>
    ${head.value}
  </head>

  <body>
    <!-- example of injection point where you write your app template -->
    <div id="q-app"></div>

    <!-- Add the following at the end of your body tag -->
    ${body.value}
    ${scriptTag.value}
  </body>
</html>
`
})
</script>
