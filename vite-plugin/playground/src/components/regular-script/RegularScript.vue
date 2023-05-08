<template>
  <h2>SFC Regular Script Tag</h2>

  <div>
    <div id="script-basic">
      <Basic />
    </div>

    <div id="script-imports">
      <Imports />
    </div>

    <div id="script-aliased-imports">
      <AliasedImports />
    </div>

    <div id="script-custom">
      <Custom />
    </div>

    <div id="script-custom-with-imports">
      <CustomWithImports />
    </div>

    <div id="script-custom-with-aliased-imports">
      <CustomWithAliasedImports />
    </div>
  </div>
</template>

<script setup>
import Basic from './1-Basic.vue';
import Imports from './2-Imports.vue';
import AliasedImports from './3-AliasedImports.vue';
import Custom from './4-Custom.vue';
import CustomWithImports from './5-CustomWithImports.vue';
import CustomWithAliasedImports from './6-CustomWithAliasedImports.vue';
</script>
