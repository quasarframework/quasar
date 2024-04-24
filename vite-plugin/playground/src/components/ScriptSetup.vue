<template>
  <h4>SFC Script Setup Transforms</h4>

  <div>
    <Basic />
    <Imports />
    <AliasedImports />
    <CustomComp />
    <CustomWithImports />
    <CustomWithAliasedImports />
    <OnlyCustomWithImports />
    <OnlyCustomWithAliasedImports />
    <MixedCase />
    <MixedCaseWithDuplicates />
    <MixedCaseWithDuplicatesAndAliasedImports />

    <ExtendBtn label="Click me">
      <q-icon name="map" />
    </ExtendBtn>
  </div>
</template>

<script setup>
import Basic from './script-setup/BasicTest.vue'
import Imports from './script-setup/ImportsTest.vue'
import AliasedImports from './script-setup/AliasedImports.vue'
import CustomComp from './script-setup/CustomComp.vue'
import CustomWithImports from './script-setup/CustomWithImports.vue'
import CustomWithAliasedImports from './script-setup/CustomWithAliasedImports.vue'
import OnlyCustomWithImports from './script-setup/OnlyCustomWithImports.vue'
import OnlyCustomWithAliasedImports from './script-setup/OnlyCustomWithAliasedImports.vue'
import MixedCase from './script-setup/MixedCase.vue'
import MixedCaseWithDuplicates from './script-setup/MixedCaseWithDuplicates.vue'
import MixedCaseWithDuplicatesAndAliasedImports from './script-setup/MixedCaseWithDuplicatesAndAliasedImports.vue'
import ExtendBtn from './script-setup/ExtendBtn.vue'
</script>
