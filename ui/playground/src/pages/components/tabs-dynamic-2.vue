<template>
  <div class="q-layout-padding">
    <q-btn color="primary" label="Export" @click="exportDialog = true" />
    <q-dialog v-model="exportDialog">
      <q-card>
        <q-tabs
          class="text-grey-7"
          v-model="exportTab"
          active-color="primary"
          align="justify"
        >
          <q-tab name="sass" no-caps label="Sass" />
          <q-tab name="scss" no-caps label="SCSS" />
          <q-tab name="quasar-cli" no-caps label="Quasar CLI" />
          <q-tab name="umd" no-caps label="UMD" />
          <q-tab name="vue-cli" no-caps label="Vue CLI" />
        </q-tabs>

        <q-separator />

        <q-tab-panels class="bg-code" v-model="exportTab" animated>
          <q-tab-panel class="q-pa-none" name="sass">
            <pre>{{ sassExport }}</pre>
          </q-tab-panel>

          <q-tab-panel class="q-pa-none" name="scss">
            <pre>{{ scssExport }}</pre>
          </q-tab-panel>

          <q-tab-panel class="q-pa-none" name="quasar-cli">
            <pre>{{ quasarCliExport }}</pre>
          </q-tab-panel>

          <q-tab-panel class="q-pa-none" name="umd">
            <pre>{{ umdExport }}</pre>
          </q-tab-panel>

          <q-tab-panel class="q-pa-none" name="vue-cli">
            <pre>{{ vueCliExport }}</pre>
          </q-tab-panel>
        </q-tab-panels>

        <q-separator />

        <q-card-actions align="right">
          <q-btn color="primary" flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { colors as quasarColors, setCssVar } from 'quasar'
import { computed, ref, watch } from 'vue'

const { luminosity } = quasarColors

const colors = ref({
  primary: '#027BE3',
  secondary: '#26A69A',
  accent: '#9C27B0',

  dark: '#1d1d1d',

  positive: '#21BA45',
  negative: '#C10015',
  info: '#31CCEC',
  warning: '#F2C037'
})

const dark = ref({
  primary: true,
  secondary: true,
  accent: true,
  dark: true,

  positive: true,
  negative: true,
  info: false,
  warning: false
})

const darkMode = ref(false)
const exportDialog = ref(false)
const exportTab = ref('sass')
const list = ref([
  'primary',
  'secondary',
  'accent',
  'dark',
  'positive',
  'negative',
  'info',
  'warning'
])
const sideColors = ref([
  'secondary',
  'dark',
  'positive',
  'negative',
  'info',
  'warning'
])

watch(
  () => colors.value.primary,
  val => {
    update('primary', val)
  }
)

watch(
  () => colors.value.secondary,
  val => {
    update('secondary', val)
  }
)

watch(
  () => colors.value.accent,
  val => {
    update('accent', val)
  }
)

watch(
  () => colors.value.dark,
  val => {
    update('dark', val)
  }
)

watch(
  () => colors.value.positive,
  val => {
    update('positive', val)
  }
)

watch(
  () => colors.value.negative,
  val => {
    update('negative', val)
  }
)

watch(
  () => colors.value.info,
  val => {
    update('info', val)
  }
)

watch(
  () => colors.value.warning,
  val => {
    update('warning', val)
  }
)

const pageClass = computed(() =>
  darkMode.value === true ? 'bg-grey-10 text-white' : 'bg-white text-black'
)

const sassExport = computed(
  () =>
    '// src/css/quasar.variables.sass\n\n' +
    `$primary   : ${colors.value.primary}\n` +
    `$secondary : ${colors.value.secondary}\n` +
    `$accent    : ${colors.value.accent}\n\n` +
    `$dark      : ${colors.value.dark}\n\n` +
    `$positive  : ${colors.value.positive}\n` +
    `$negative  : ${colors.value.negative}\n` +
    `$info      : ${colors.value.info}\n` +
    `$warning   : ${colors.value.warning}`
)

const scssExport = computed(
  () =>
    '// src/css/quasar.variables.scss\n\n' +
    `$primary   : ${colors.value.primary};\n` +
    `$secondary : ${colors.value.secondary};\n` +
    `$accent    : ${colors.value.accent};\n\n` +
    `$dark      : ${colors.value.dark};\n\n` +
    `$positive  : ${colors.value.positive};\n` +
    `$negative  : ${colors.value.negative};\n` +
    `$info      : ${colors.value.info};\n` +
    `$warning   : ${colors.value.warning};`
)

const quasarCliExport = computed(
  () => `// quasar.conf.js

return {
  framework: {
    config: {
      brand: {
        primary: '${colors.value.primary}',
        secondary: '${colors.value.secondary}',
        accent: '${colors.value.accent}',

        dark: '${colors.value.dark}',

        positive: '${colors.value.positive}',
        negative: '${colors.value.negative}',
        info: '${colors.value.info}',
        warning: '${colors.value.warning}'
      }
    }
  }
}`
)

const umdExport = computed(
  () => `app.use(Quasar, {
  config: {
    brand: {
      primary: '${colors.value.primary}',
      secondary: '${colors.value.secondary}',
      accent: '${colors.value.accent}',

      dark: '${colors.value.dark}',

      positive: '${colors.value.positive}',
      negative: '${colors.value.negative}',
      info: '${colors.value.info}',
      warning: '${colors.value.warning}'
    }
  }
}`
)

const vueCliExport = computed(
  () => `// main.js

app.use(Quasar, {
  config: {
    brand: {
      primary: '${colors.value.primary}',
      secondary: '${colors.value.secondary}',
      accent: '${colors.value.accent}',

      dark: '${colors.value.dark}',

      positive: '${colors.value.positive}',
      negative: '${colors.value.negative}',
      info: '${colors.value.info}',
      warning: '${colors.value.warning}'
    }
  }
})`
)

function update(color, val) {
  setCssVar(color, val, document.getElementById('theme-picker'))
  dark.value[color] = luminosity(val) <= 0.4
}
</script>
