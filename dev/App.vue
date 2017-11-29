<template>
  <q-app>
    <q-transition enter="fadeIn" leave="fadeOut" mode="out-in" :duration="300" @leave="resetScroll">
      <router-view></router-view>
    </q-transition>
    <q-ajax-bar ref="bar" />
    <q-select
      :options="[
        { label: 'English', value: 'en' },
        { label: 'Romana', value: 'ro' }
      ]"
      v-model="lang"
      class="fixed-bottom-right z-max"
    />
  </q-app>
</template>

<script>
export default {
  data () {
    return {
      lang: 'en'
    }
  },
  watch: {
    lang (lang) {
      import(`../i18n/${lang}`).then(lang => {
        this.$q.i18n.set(lang.default)
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

<style lang="stylus" src="quasar-css"></style>

<style lang="stylus">
p.caption
  margin 35px 0
  padding 12px 0 12px 12px
  border-left 4px solid #027be3
  font-weight bold
</style>
