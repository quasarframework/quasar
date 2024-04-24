<template>
  <h4>SFC Script (JS)</h4>

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
import Basic from './js-script/BasicTest.vue'
import Imports from './js-script/ImportsTest.vue'
import AliasedImports from './js-script/AliasedImports.vue'
import CustomComp from './js-script/CustomComp.vue'
import CustomWithImports from './js-script/CustomWithImports.vue'
import CustomWithAliasedImports from './js-script/CustomWithAliasedImports.vue'
import OnlyCustomWithImports from './js-script/OnlyCustomWithImports.vue'
import OnlyCustomWithAliasedImports from './js-script/OnlyCustomWithAliasedImports.vue'
import MixedCase from './js-script/MixedCase.vue'
import MixedCaseWithDuplicates from './js-script/MixedCaseWithDuplicates.vue'
import MixedCaseWithDuplicatesAndAliasedImports from './js-script/MixedCaseWithDuplicatesAndAliasedImports.vue'
import WithDirective from './js-script/WithDirective.vue'
import ExtendBtn from './js-script/ExtendBtn.vue'
</script>
