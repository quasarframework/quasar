<template>
  <div id="q-app">
    <router-view></router-view>
    <q-ajax-bar ref="bar" />
  </div>
</template>

<script>
export default {
  mounted () {
    window.bar = this.$refs.bar
  }
}
</script>
