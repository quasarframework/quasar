<template>
  <h4>SFC Script (TS)</h4>

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
import Basic from './ts-script/BasicTest.vue'
import Imports from './ts-script/ImportsTest.vue'
import AliasedImports from './ts-script/AliasedImports.vue'
import CustomComp from './ts-script/CustomComp.vue'
import CustomWithImports from './ts-script/CustomWithImports.vue'
import CustomWithAliasedImports from './ts-script/CustomWithAliasedImports.vue'
import OnlyCustomWithImports from './ts-script/OnlyCustomWithImports.vue'
import OnlyCustomWithAliasedImports from './ts-script/OnlyCustomWithAliasedImports.vue'
import MixedCase from './ts-script/MixedCase.vue'
import MixedCaseWithDuplicates from './ts-script/MixedCaseWithDuplicates.vue'
import MixedCaseWithDuplicatesAndAliasedImports from './ts-script/MixedCaseWithDuplicatesAndAliasedImports.vue'
import WithDirective from './ts-script/WithDirective.vue'
import ExtendBtn from './ts-script/ExtendBtn.vue'
</script>
