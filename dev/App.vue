<template>
  <div class="q-app">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" :duration="300" @leave="resetScroll">
      <router-view></router-view>
    </transition>
    <q-ajax-bar ref="bar" />
    <div
      style="padding: 0px 10px; right: 10px; bottom: 100px; padding: 5px; border-radius: 5px;"
      class="bg-white shadow-4 fixed z-top"
    >
      <q-select
        hide-underline
        stack-label="I18n"
        :options="[
          { label: 'English (US)', value: 'en-us' }
          ,{ label: 'English (UK)', value: 'en-uk' }
          ,{ label: 'Romanian', value: 'ro' }
          ,{ label: 'Hebrew', value: 'he' }
          ,{ label: 'Chinese (Simplified)', value: 'zh-hans' }
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
          { label: 'Material', value: 'material' }
          ,{ label: 'MDI', value: 'mdi' }
          ,{ label: 'Ionicons', value: 'ionicons' }
          ,{ label: 'Fontawesome', value: 'fontawesome' }
        ]"
        v-model="iconSet"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      lang: this.$q.i18n.lang,
      iconSet: this.$q.icon.name
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
  mounted () {
    window.bar = this.$refs.bar
    if (this.$q.platform.is.cordova) {
      console.log('on CORDOVA')
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

<style lang="stylus">
p.caption
  margin 35px 0
  padding 12px 0 12px 12px
  border-left 4px solid #027be3
  font-weight bold
  margin-left 10px
</style>
