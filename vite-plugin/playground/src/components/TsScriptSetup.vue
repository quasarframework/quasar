<template>
  <h4>SFC Script Setup (TS)</h4>

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
    <WithDirective />

    <ExtendBtn label="Click me">
      <q-icon name="map" />
    </ExtendBtn>
  </div>
</template>

<script setup>
import Basic from './ts-script-setup/BasicTest.vue'
import Imports from './ts-script-setup/ImportsTest.vue'
import AliasedImports from './ts-script-setup/AliasedImports.vue'
import CustomComp from './ts-script-setup/CustomComp.vue'
import CustomWithImports from './ts-script-setup/CustomWithImports.vue'
import CustomWithAliasedImports from './ts-script-setup/CustomWithAliasedImports.vue'
import OnlyCustomWithImports from './ts-script-setup/OnlyCustomWithImports.vue'
import OnlyCustomWithAliasedImports from './ts-script-setup/OnlyCustomWithAliasedImports.vue'
import MixedCase from './ts-script-setup/MixedCase.vue'
import MixedCaseWithDuplicates from './ts-script-setup/MixedCaseWithDuplicates.vue'
import MixedCaseWithDuplicatesAndAliasedImports from './ts-script-setup/MixedCaseWithDuplicatesAndAliasedImports.vue'
import WithDirective from './ts-script-setup/WithDirective.vue'
import ExtendBtn from './ts-script-setup/ExtendBtn.vue'
</script>
