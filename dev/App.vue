<template>
  <div id="q-app">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="300" @leave="resetScroll">
      <router-view/>
    </transition>
    <div
      style="padding: 10px; right: 10px; bottom: 10px"
      class="bg-white shadow-4 fixed z-top"
    >
      <q-btn dense flat size="sm" icon="visibility" @click="showSelector = !showSelector" class="absolute-top-right z-top" />
      <template v-if="showSelector">
        <q-select
          hide-underline
          stack-label="I18n"
          :options="[
            { label: 'English (US)', value: 'en-us' }
            ,{ label: 'English (UK)', value: 'en-uk' }
            ,{ label: 'Romanian', value: 'ro' }
            ,{ label: 'Hebrew', value: 'he' }
            ,{ label: 'Chinese (Simplified)', value: 'zh-hans' }
            ,{ label: 'Chinese (Traditional)', value: 'zh-hant' }
            ,{ label: 'Italian', value: 'it' }
            ,{ label: 'Spanish', value: 'es' }
            ,{ label: 'Swedish', value: 'sv' }
            ,{ label: 'Farsi', value: 'fa-ir' }
            ,{ label: 'French', value: 'fr' }
            ,{ label: 'Dutch', value: 'nl' }
            ,{ label: 'German', value: 'de' }
            ,{ label: 'Indonezian', value: 'id' }
            ,{ label: 'Croatian', value: 'hr' }
            ,{ label: 'Russian', value: 'ru' }
            ,{ label: 'Ukrainian', value: 'uk' }
            ,{ label: 'Polish', value: 'pl' }
            ,{ label: 'Czech', value: 'cs' }
          ]"
          v-model="lang"
        />
        <q-select
          hide-underline
          stack-label="Icon set"
          :options="[
            { label: 'Material', value: 'material-icons' }
            ,{ label: 'MDI', value: 'mdi' }
            ,{ label: 'Ionicons', value: 'ionicons' }
            ,{ label: 'Fontawesome', value: 'fontawesome' }
          ]"
          v-model="iconSet"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  meta: {
    title: 'Quasar Development'
  },
  data () {
    return {
      lang: this.$q.i18n.lang,
      iconSet: this.$q.icon.name,
      showSelector: false
    }
  },
  watch: {
    lang (lang) {
      import(`../i18n/${lang}`).then(lang => {
        this.$q.i18n.set(lang.default)
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
  }
}
</script>
