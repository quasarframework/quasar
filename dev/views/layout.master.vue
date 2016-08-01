<template>
  <div class="row">
    <button class="primary" v-link="'/'">Home</primary>
    <button class="secondary" v-link="'/layout'">Layout</button>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
</script>

<style>
  #quasar-app {
    overflow: auto;
  }
</style>
