<template>
  <div class="q-layout-padding">
    Icon Extras (SVG Viewer)
    <div class="row items-center justify-start q-gutter-sm">
      <q-select
        v-model="selectedIcon"
        :options="iconOptions"
        style="min-width: 300px"
        outlined
        dense
        options-dense
      />
      <div>Count: {{ iconSelectedKeys.length }}</div>
      <q-input v-model="filter" placeholder="Filter" clearable outlined dense />
    </div>
    <q-separator class="q-my-sm" />
    <div class="row items-center justify-start q-gutter-xs">
      <div v-for="key in filtered" :key="key">
        <q-icon :name="iconSelected.icons[key]" size="md" color="primary" />
        <q-tooltip class="q-ma-sm">{{ key }}</q-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
// oxlint-disable import/no-namespace

// When new icons show up, or icons are modified,
// this is a good way to test the updates to make
// sure our parsing works as expected.
// Use the filter to target updated/new icons

import * as svgMatIcons from '@quasar/extras/material-icons'
import * as svgMatOutlinedIcons from '@quasar/extras/material-icons-outlined'
import * as svgMatRoundIcons from '@quasar/extras/material-icons-round'
import * as svgMatSharpIcons from '@quasar/extras/material-icons-sharp'

import * as svgMatSymOutlinedIcons from '@quasar/extras/material-symbols-outlined'
import * as svgMatSymRoundedIcons from '@quasar/extras/material-symbols-rounded'
import * as svgMatSymSharpIcons from '@quasar/extras/material-symbols-sharp'

import * as svgBootstrapIcons from '@quasar/extras/bootstrap-icons'
import * as svgEvaIcons from '@quasar/extras/eva-icons'
import * as svgFontawesomeIcons from '@quasar/extras/fontawesome-v7'
import * as svgIonIcons from '@quasar/extras/ionicons-v8'
import * as svgLineAwesomeIcons from '@quasar/extras/line-awesome'
import * as svgMdiIcons from '@quasar/extras/mdi-v7'
import * as svgThemifyIcons from '@quasar/extras/themify'

import { computed, ref, watch } from 'vue'
import { debounce } from 'quasar'

const icons = ref([
  {
    name: 'material-icons',
    icons: svgMatIcons
  },
  {
    name: 'material-icons-outlined',
    icons: svgMatOutlinedIcons
  },
  {
    name: 'material-icons-round',
    icons: svgMatRoundIcons
  },
  {
    name: 'material-icons-sharp',
    icons: svgMatSharpIcons
  },
  {
    name: 'material-symbols-outlined',
    icons: svgMatSymOutlinedIcons
  },
  {
    name: 'material-symbols-rounded',
    icons: svgMatSymRoundedIcons
  },
  {
    name: 'material-symbols-sharp',
    icons: svgMatSymSharpIcons
  },
  {
    name: 'bootstrap-icons',
    icons: svgBootstrapIcons
  },
  {
    name: 'eva-icons',
    icons: svgEvaIcons
  },
  {
    name: 'fontawesome-v7',
    icons: svgFontawesomeIcons
  },
  {
    name: 'ionicons-v8',
    icons: svgIonIcons
  },
  {
    name: 'line-awesome',
    icons: svgLineAwesomeIcons
  },
  {
    name: 'mdi-v7',
    icons: svgMdiIcons
  },
  {
    name: 'themify',
    icons: svgThemifyIcons
  }
])

const selectedIcon = ref('material-icons')
const filter = ref('')
const debouncedFilter = ref('')

const iconSelected = computed(() =>
  icons.value.find(icon => icon.name === selectedIcon.value)
)

const iconSelectedKeys = computed(() => Object.keys(iconSelected.value.icons))

const iconOptions = computed(() => icons.value.map(icon => icon.name))

const filtered = computed(() => {
  if (!debouncedFilter.value) {
    return iconSelectedKeys.value
  }
  return iconSelectedKeys.value.filter(key =>
    key.toLowerCase().includes(debouncedFilter.value.toLowerCase())
  )
})

watch(
  () => filter.value,
  debounce(newValue => {
    debouncedFilter.value = newValue
  }, 300)
)
</script>
