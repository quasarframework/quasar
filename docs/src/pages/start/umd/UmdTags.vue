<template>
  <q-card flat bordered>
    <q-card-section class="q-gutter-xs q-pa-sm">
      <q-toggle v-model="css.roboto" label="Roboto font" />
      <q-toggle v-model="css.animate" label="Animate.css" />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-gutter-xs q-pa-sm">
      <q-toggle v-model="css['material-icons']" label="Material Icons" />
      <q-toggle
        v-model="css['material-icons-outlined']"
        label="Material Icons (Outlined)"
      />
      <q-toggle
        v-model="css['material-icons-round']"
        label="Material Icons (Round)"
      />
      <q-toggle
        v-model="css['material-icons-sharp']"
        label="Material Icons (Sharp)"
      />
      <q-toggle
        v-model="css['material-symbols-outlined']"
        label="Material Symbols (Outlined)"
      />
      <q-toggle
        v-model="css['material-symbols-rounded']"
        label="Material Symbols (Rounded)"
      />
      <q-toggle
        v-model="css['material-symbols-sharp']"
        label="Material Symbols (Sharp)"
      />
      <q-toggle v-model="css['mdi-v7']" label="MDI v7" />
      <q-toggle v-model="css['fontawesome-v7']" label="Fontawesome v7" />
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

    <DocCode class="relative-position" lang="html" :code="output" />
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed, reactive, ref } from 'vue'
import languages from 'quasar/lang/index.json'

import DocCode from '@/components/DocCode.vue'
import { buildUmdHtml, defaultOptions, iconSetOptions } from './umd-tags.js'

const { version } = useQuasar()
const langOptions = languages.map(lang => ({
  label: lang.nativeName,
  value: lang.isoName
}))

const css = reactive({ ...defaultOptions.css })
const minified = ref(defaultOptions.minified)
const rtl = ref(defaultOptions.rtl)
const cfgObject = ref(defaultOptions.cfgObject)
const lang = ref(defaultOptions.lang)
const iconSet = ref(defaultOptions.iconSet)

const output = computed(() =>
  buildUmdHtml({
    version,
    css,
    minified: minified.value,
    rtl: rtl.value,
    cfgObject: cfgObject.value,
    lang: lang.value,
    iconSet: iconSet.value
  })
)
</script>
