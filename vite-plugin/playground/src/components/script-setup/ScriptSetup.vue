<template>
  <h1>SFC Script Setup Transforms</h1>

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

    <div id="script-setup-only-custom-with-imports">
      <OnlyCustomWithImports />
    </div>

    <div id="script-setup-only-custom-with-aliased-imports">
      <OnlyCustomWithAliasedImports />
    </div>

    <div id="script-setup-mixed-case">
      <MixedCase />
    </div>

    <div id="script-setup-mixed-case-with-duplicates">
      <MixedCaseWithDuplicates />
    </div>

    <div id="script-setup-mixed-case-with-duplicates-and-aliased-imports">
      <MixedCaseWithDuplicatesAndAliasedImports />
    </div>
  </div>
</template>

<script setup>
import Basic from './1-Basic.vue'
import Imports from './2-Imports.vue'
import AliasedImports from './3-AliasedImports.vue'
import Custom from './4-Custom.vue'
import CustomWithImports from './5-CustomWithImports.vue'
import CustomWithAliasedImports from './6-CustomWithAliasedImports.vue'
import OnlyCustomWithImports from './7-OnlyCustomWithImports.vue'
import OnlyCustomWithAliasedImports from './8-OnlyCustomWithAliasedImports.vue'
import MixedCase from './9-MixedCase.vue'
import MixedCaseWithDuplicates from './10-MixedCaseWithDuplicates.vue'
import MixedCaseWithDuplicatesAndAliasedImports from './11-MixedCaseWithDuplicatesAndAliasedImports.vue'
</script>
