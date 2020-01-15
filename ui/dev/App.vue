<template>
  <div id="q-app">
    <router-view />

    <q-btn v-if="$q.platform.is.mobile" to="/" round icon="home" dense size="xs" class="fixed dev-home-btn z-max" color="accent" />

    <q-card
      style="padding: 11px; right: 11px; bottom: 10px; z-index: 6000;"
      class="rounded-borders shadow-4 fixed"
    >
      <q-btn dense flat size="sm" icon="visibility" @click="showSelector = !showSelector" class="absolute-top-right z-top" />
      <template v-if="showSelector">
        <q-toggle :value="$q.dark.isActive" @input="$q.dark.toggle" :label="`Dark Mode (${$q.dark.mode})`" />

        <q-btn dense flat size="sm" :icon="lang === 'he' ? 'navigate_before' : 'navigate_next'" @click="lang = lang === 'en-us' ? 'he' : 'en-us'" class="absolute-bottom-right z-top" />
        <q-select
          label="Quasar Language"
          dense
          borderless
          :options="langOptions"
          emit-value
          map-options
          options-dense
          v-model="lang"
          style="min-width: 150px"
        />
        <q-select
          label="Icon set"
          dense
          borderless
          :options="[
            { label: 'Material', value: 'material-icons' }
            ,{ label: 'Material Outlined', value: 'material-icons-outlined' }
            ,{ label: 'Material Round', value: 'material-icons-round' }
            ,{ label: 'Material Sharp', value: 'material-icons-sharp' }
            ,{ label: 'MDI v4', value: 'mdi-v4' }
            ,{ label: 'Ionicons v4', value: 'ionicons-v4' }
            ,{ label: 'Fontawesome v5', value: 'fontawesome-v5' }
            ,{ label: 'Eva Icons', value: 'eva-icons' }
            ,{ label: 'Themify', value: 'themify' }
            ,{ label: 'SVG Material', value: 'svg-material-icons' }
            ,{ label: 'SVG MDI v4', value: 'svg-mdi-v4' }
            ,{ label: 'SVG Ionicons v4', value: 'svg-ionicons-v4' }
            ,{ label: 'SVG Fontawesome v5', value: 'svg-fontawesome-v5' }
            ,{ label: 'SVG Eva Icons', value: 'svg-eva-icons' }
            ,{ label: 'SVG Themify', value: 'svg-themify' }
          ]"
          options-dense
          emit-value
          map-options
          v-model="iconSet"
        />
      </template>
    </q-card>
  </div>
</template>

<script>

// eslint-disable-next-line no-unused-vars
import Quasar, { Dark } from 'quasar'

import Vue from 'vue'
import languages from '../lang/index.json'

if (process.env.SERVER !== true) {
  window.Vue = Vue
}

export default {
  meta: {
    title: 'Quasar Development'
  },
  data () {
    return {
      lang: this.$q.lang.isoName,
      iconSet: this.$q.iconSet.name,
      showSelector: false
    }
  },
  watch: {
    lang (lang) {
      import(`../lang/${lang}`).then(lang => {
        this.$q.lang.set(lang.default)
      })
    },
    iconSet (set) {
      import(`../icon-set/${set}`).then(iconSet => {
        this.$q.iconSet.set(iconSet.default)
      })
    }
  },
  methods: {
    resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    }
  },
  created () {
    // this.$q.dark.set('auto')
    // this.$q.dark.set(false)
    this.langOptions = languages.map(lang => ({ label: lang.nativeName, value: lang.isoName }))
  },
  mounted () {
    window.$q = this.$q
    window.Quasar = Quasar
    /*
    this.$nextTick(() => {
      Dark.set(false)
    })
    */
  }
}
</script>

<style lang="stylus">
.dev-home-btn
  top: 36px
  right: 8px
</style>
