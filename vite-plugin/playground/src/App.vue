<template>
  <VueTransformAssetUrls />

  <ScriptSetup />
  <RegularScript />
  <!-- TODO: Add tests for 'pascal' and 'combined' too -->
  <!-- TODO: Add tests for TypeScript and Pug -->

  <!-- TODO: Add JS transforms (currently only covered through custom-component.js in vue transforms a bit) -->

  <!-- TODO: Add SCSS Transforms -->
</template>

<script setup>
import VueTransformAssetUrls from './components/VueTransformAssetUrls.vue'
import ScriptSetup from './components/script-setup/ScriptSetup.vue'
import RegularScript from './components/regular-script/RegularScript.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
