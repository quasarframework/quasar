<template>
  <div id="q-app">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="300" @leave="resetScroll">
      <router-view/>
    </transition>
    <div
      style="padding: 10px; right: 10px; bottom: 10px"
      class="generic-border-radius bg-white shadow-4 fixed z-top"
    >
      <q-btn dense flat size="sm" icon="visibility" @click="showSelector = !showSelector" class="absolute-top-right z-top" />
      <template v-if="showSelector">
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
            ,{ label: 'MDI', value: 'mdi' }
            ,{ label: 'Ionicons', value: 'ionicons' }
            ,{ label: 'Fontawesome', value: 'fontawesome' }
            ,{ label: 'Eva Icons', value: 'eva-icons' }
          ]"
          emit-value
          map-options
          dense-options
          v-model="iconSet"
        />
      </template>
    </div>
  </div>
</template>

<script>
import languages from '../lang/index.json'

export default {
  meta: {
    title: 'Quasar Development'
  },
  data () {
    return {
      lang: this.$q.lang.isoName,
      iconSet: this.$q.icon.name,
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
      import(`../icons/${set}`).then(iconSet => {
        this.$q.icon.set(iconSet.default)
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
    this.langOptions = languages.map(lang => ({ label: lang.nativeName, value: lang.isoName }))
  }
}
</script>
