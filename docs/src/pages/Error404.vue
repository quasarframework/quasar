<template lang="pug">
.fixed-center.text-center.text-white
  p
    img(src='statics/quasar-logo.png', style='width:30vw;max-width:150px;')
  p.text-grey-7
    | Sorry, nothing here...
    strong  (404)
  div.menus-container
    q-btn(
      color='primary'
      style='width:200px;'
      to="/"
    ) Homepage
    q-btn(
      color='primary'
      style='width:200px;'
      to="/quasar-cli"
    ) Quasar CLI
    q-btn(
      color='primary'
      style='width:200px;'
      to="/style"
    ) Style
    q-btn(
      color='primary'
      style='width:200px;'
      to="/layout"
    ) Layout
    q-btn(
      color='primary'
      style='width:200px;'
      to="/vue-components"
    ) Vue Components
    q-btn(
      color='primary'
      style='width:200px;'
      to="/vue-directives"
    ) Vue Directives
    q-btn(
      color='primary'
      style='width:200px;'
      to="/quasar-plugins"
    ) Quasar Plugins
    q-btn(
      color='primary'
      style='width:200px;'
      to="/app-extensions"
    ) App Extensions
    q-btn(
      color='primary'
      style='width:200px;'
      to="/quasar-utils"
    ) Quasar Utils
</template>

<script>
export default {
  name: 'Error404',

  meta: {
    title: 'Oops...'
  }
}
</script>

<style lang="stylus">
.menus-container a
  margin 4px
</style>
