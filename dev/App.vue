<template>
  <q-app>
    <q-transition enter="fadeIn" leave="fadeOut" mode="out-in" :duration="300" @leave="resetScroll">
      <router-view></router-view>
    </q-transition>
    <q-ajax-bar ref="bar" />
  </q-app>
</template>

<script>
export default {
  mounted () {
    window.bar = this.$refs.bar
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
