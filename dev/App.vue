<template>
  <div id="q-app">
    <q-body>
      <router-view></router-view>
      <q-ajax-bar ref="bar" />
    </q-body>
  </div>
</template>

<script>
export default {
  mounted () {
    window.bar = this.$refs.bar
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
