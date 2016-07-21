<template>
  <div class="row">
    <button class="primary" v-link="'/'">Home</primary>
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
