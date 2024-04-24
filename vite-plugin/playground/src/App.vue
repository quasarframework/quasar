<template>
  <AssetTransform />

  <JsScriptSetup />
  <JsScript />

  <TsScriptSetup />
  <TsScript />

  <!-- TODO: Add tests for 'pascal' and 'combined' too -->
  <!-- TODO: Add tests for Pug -->

  <!-- TODO: Add SCSS Transforms -->
</template>

<script setup>
import AssetTransform from './components/AssetTransform.vue'
import JsScriptSetup from './components/JsScriptSetup.vue'
import JsScript from './components/JsScript.vue'
import TsScriptSetup from './components/TsScriptSetup.vue'
import TsScript from './components/TsScript.vue'
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
