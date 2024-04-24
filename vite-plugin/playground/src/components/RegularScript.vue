<template>
  <h4>SFC Regular Script Tag Transforms</h4>

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
import Basic from './regular-script/BasicTest.vue'
import Imports from './regular-script/ImportsTest.vue'
import AliasedImports from './regular-script/AliasedImports.vue'
import CustomComp from './regular-script/CustomComp.vue'
import CustomWithImports from './regular-script/CustomWithImports.vue'
import CustomWithAliasedImports from './regular-script/CustomWithAliasedImports.vue'
import OnlyCustomWithImports from './regular-script/OnlyCustomWithImports.vue'
import OnlyCustomWithAliasedImports from './regular-script/OnlyCustomWithAliasedImports.vue'
import MixedCase from './regular-script/MixedCase.vue'
import MixedCaseWithDuplicates from './regular-script/MixedCaseWithDuplicates.vue'
import MixedCaseWithDuplicatesAndAliasedImports from './regular-script/MixedCaseWithDuplicatesAndAliasedImports.vue'
import ExtendBtn from './regular-script/ExtendBtn.vue'
</script>
