<template>
  <div id="theme-picker">
    <div class="row items-stretch">
      <div class="theme-picker__colors flex q-gutter-sm">
        <q-btn v-for="color in list" :key="`picker-${color}`" :color="color" :text-color="dark[color] === true ? 'white' : 'black'" no-caps glossy unelevated>
          <div class="text-weight-light">
            <div class="text-capitalize">{{ color }}</div>
            <div>{{ colors[color] }}</div>
          </div>
          <q-menu anchor="top start" self="top start">
            <q-color v-model="colors[color]" />
          </q-menu>
        </q-btn>
      </div>

      <div class="theme-picker__content col">
        <div class="relative-position fit rounded-borders shadow-2 bg-white overflow-hidden" :class="pageClass">
          <div :class="`bg-primary text-${dark.primary === true ? 'white shadow-2' : 'black'}`">
            <q-bar dense :dark="dark.primary">
              <q-space />
              <q-icon class="q-mr-xs" :name="fasSquare" size="12px" style="opacity: 0.5" />
              <q-icon class="q-mr-xs" :name="fasCircle" size="12px" style="opacity: 0.5" />
              <q-icon class="q-mr-sm rotate-90" :name="fasPlay" size="12px" style="opacity: 0.5" />
            </q-bar>
            <q-toolbar>
              <q-btn flat dense round :icon="mdiArrowLeft" />
              <q-space />
              <q-toggle class="q-mr-sm" dense v-model="darkMode" :dark="dark.primary" color="red" label="Dark page" />
              <q-btn flat dense round :icon="mdiMagnify" />
              <q-btn flat dense round :icon="mdiMenu" />
            </q-toolbar>
            <q-toolbar inset>
              <q-toolbar-title>Quasar</q-toolbar-title>
            </q-toolbar>
          </div>

          <div class="q-px-md q-py-lg">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="color in sideColors" :key="`card-${color}`">
                <q-card flat :class="`bg-${color} text-${dark[color] === true ? 'white' : 'black'}`">
                  <q-card-section>
                    <div class="text-h6 row no-wrap items-center">
                      <div class="ellipsis text-capitalize">{{ color }}</div>
                      <q-space />
                      <q-icon v-if="color !== 'secondary' && color !== 'dark'" :name="$q.iconSet.type[color]" size="24px" />
                    </div>
                  </q-card-section>
                  <q-card-section>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</q-card-section>
                </q-card>
              </div>
            </div>
            <q-btn class="absolute" fab :icon="mdiMapMarkerRadius" color="accent" :text-color="dark.accent === true ? 'white' : 'black'" style="bottom: 16px; right: 16px" />
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-mt-lg q-mb-sm" />

    <div class="col-12 row items-center justify-end q-gutter-md">
      <q-btn class="call-to-action-btn" no-caps padding="8px 16px" label="Export" @click="exportDialog = true" />
    </div>

    <q-dialog v-model="exportDialog">
      <q-card>
        <q-tabs class="theme-picker__tabs text-grey-7" v-model="exportTab" active-color="brand-primary" align="justify">
          <q-tab name="sass" no-caps label="Sass" />
          <q-tab name="scss" no-caps label="SCSS" />
          <q-tab name="quasar-cli" no-caps label="Quasar CLI" />
          <q-tab name="umd" no-caps label="Vite / UMD / Vue CLI" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="exportTab" animated>
          <q-tab-panel class="q-pa-none" name="sass">
            <doc-code copy :code="sassExport" />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="scss">
            <doc-code copy :code="scssExport" />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="quasar-cli">
            <doc-code copy :code="quasarCliExport" />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="umd">
            <doc-code copy :code="umdExport" />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="vue-cli">
            <doc-code copy :code="vueCliExport" />
          </q-tab-panel>
        </q-tab-panels>

        <q-separator />

        <q-card-actions align="right">
          <q-btn class="call-to-action-btn" no-caps padding="8px 16px" label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { colors as quasarColors, setCssVar } from 'quasar'

import {
  fasSquare, fasCircle, fasPlay
} from '@quasar/extras/fontawesome-v6'

import {
  mdiArrowLeft, mdiMagnify, mdiMenu, mdiMapMarkerRadius
} from '@quasar/extras/mdi-v6'

import DocCode from 'src/components/DocCode.vue'

const { luminosity } = quasarColors

const colors = reactive({
  primary: '#1976d2',
  secondary: '#26A69A',
  accent: '#9C27B0',

  dark: '#1d1d1d',
  'dark-page': '#121212',

  positive: '#21BA45',
  negative: '#C10015',
  info: '#31CCEC',
  warning: '#F2C037'
})

const dark = reactive({
  primary: true,
  secondary: true,
  accent: true,
  dark: true,
  'dark-page': true,

  positive: true,
  negative: true,
  info: false,
  warning: false
})

const darkMode = ref(false)
const exportDialog = ref(false)
const exportTab = ref('sass')

function update (color, val) {
  setCssVar(color, val, document.getElementById('theme-picker'))
  dark[ color ] = luminosity(val) <= 0.4
}

const list = [ 'primary', 'secondary', 'accent', 'dark', 'dark-page', 'positive', 'negative', 'info', 'warning' ]

list.forEach(entry => {
  watch(() => colors[ entry ], val => { update(entry, val) })
})

const pageClass = computed(() => {
  return darkMode.value === true
    ? 'theme-picker__bg-dark text-white'
    : 'bg-white text-black'
})

const sassExport = computed(() => {
  return '// src/css/quasar.variables.sass\n\n' +
    `$primary   : ${colors.primary}\n` +
    `$secondary : ${colors.secondary}\n` +
    `$accent    : ${colors.accent}\n\n` +
    `$dark      : ${colors.dark}\n` +
    `$dark-page : ${colors[ 'dark-page' ]}\n\n` +
    `$positive  : ${colors.positive}\n` +
    `$negative  : ${colors.negative}\n` +
    `$info      : ${colors.info}\n` +
    `$warning   : ${colors.warning}`
})

const scssExport = computed(() => {
  return '// src/css/quasar.variables.scss\n\n' +
    `$primary   : ${colors.primary};\n` +
    `$secondary : ${colors.secondary};\n` +
    `$accent    : ${colors.accent};\n\n` +
    `$dark      : ${colors.dark};\n` +
    `$dark-page : ${colors[ 'dark-page' ]};\n\n` +
    `$positive  : ${colors.positive};\n` +
    `$negative  : ${colors.negative};\n` +
    `$info      : ${colors.info};\n` +
    `$warning   : ${colors.warning};`
})

const quasarCliExport = computed(() => {
  return `// quasar.config.js

return {
  framework: {
    config: {
      brand: {
        primary: '${colors.primary}',
        secondary: '${colors.secondary}',
        accent: '${colors.accent}',

        dark: '${colors.dark}',
        'dark-page': '${colors[ 'dark-page' ]}',

        positive: '${colors.positive}',
        negative: '${colors.negative}',
        info: '${colors.info}',
        warning: '${colors.warning}'
      }
    }
  }
}`
})

const umdExport = computed(() => {
  return `app.use(Quasar, {
  config: {
    brand: {
      primary: '${colors.primary}',
      secondary: '${colors.secondary}',
      accent: '${colors.accent}',

      dark: '${colors.dark}',
      'dark-page': '${colors[ 'dark-page' ]}',

      positive: '${colors.positive}',
      negative: '${colors.negative}',
      info: '${colors.info}',
      warning: '${colors.warning}'
    }
  }
}`
})

const sideColors = [ 'secondary', 'dark', 'positive', 'negative', 'info', 'warning' ]
</script>

<style lang="sass">
.theme-picker
  &__bg-dark
    background-color: var(--q-dark-page) !important

  &__content
    padding-top: 8px

  &__colors
    flex-direction: row

  &__colors .q-btn
    font-size: ($font-size - 2px)
  &__tabs .q-tab__label
    font-size: $font-size

  @media (min-width: $breakpoint-sm-min)
    &__colors
      flex-direction: column

    &__content
      padding: 0 0 0 8px
</style>
