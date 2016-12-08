<template>
  <div id="q-app">
    <router-view></router-view>
    <q-ajax-bar ref="bar" />
  </div>
</template>

<script>
require('../src/themes/quasar.' + __THEME + '.styl')

export default {
  mounted () {
    window.bar = this.$refs.bar
  }
}
</script>
