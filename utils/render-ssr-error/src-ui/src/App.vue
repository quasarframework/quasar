<template>
  <AppHeader />
  <div class="app-layout__content row items-start no-wrap">
    <AppStack />
    <div class="col">
      <AppCode />
      <AppEnvironment />
    </div>
  </div>
</template>

<script setup>
import AppHeader from 'src/components/AppHeader.vue'
import AppStack from 'src/components/AppStack.vue'
import AppCode from 'src/components/AppCode.vue'
import AppEnvironment from 'src/components/AppEnvironment.vue'
</script>

<style lang="sass">
body
  background: $dark
</style>
