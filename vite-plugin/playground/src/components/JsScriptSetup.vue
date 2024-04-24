<template>
  <h4>SFC Script Setup (JS)</h4>

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
import Basic from './js-script-setup/BasicTest.vue'
import Imports from './js-script-setup/ImportsTest.vue'
import AliasedImports from './js-script-setup/AliasedImports.vue'
import CustomComp from './js-script-setup/CustomComp.vue'
import CustomWithImports from './js-script-setup/CustomWithImports.vue'
import CustomWithAliasedImports from './js-script-setup/CustomWithAliasedImports.vue'
import OnlyCustomWithImports from './js-script-setup/OnlyCustomWithImports.vue'
import OnlyCustomWithAliasedImports from './js-script-setup/OnlyCustomWithAliasedImports.vue'
import MixedCase from './js-script-setup/MixedCase.vue'
import MixedCaseWithDuplicates from './js-script-setup/MixedCaseWithDuplicates.vue'
import MixedCaseWithDuplicatesAndAliasedImports from './js-script-setup/MixedCaseWithDuplicatesAndAliasedImports.vue'
import WithDirective from './js-script-setup/WithDirective.vue'
import ExtendBtn from './js-script-setup/ExtendBtn.vue'
</script>
