<template>
  <h2>SFC Script Setup</h2>

  <div>
    <div id="script-setup-basic">
      <Basic />
    </div>

    <div id="script-setup-imports">
      <Imports />
    </div>

    <div id="script-setup-aliased-imports">
      <AliasedImports />
    </div>

    <div id="script-setup-custom">
      <Custom />
    </div>

    <div id="script-setup-custom-with-imports">
      <CustomWithImports />
    </div>

    <div id="script-setup-custom-with-aliased-imports">
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
