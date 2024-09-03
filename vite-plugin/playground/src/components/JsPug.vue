<template>
  <h4>SFC Script Setup + Pug</h4>

  <div>
    <Basic />
    <Imports />
    <AliasedImports />
    <CustomWithImports />
    <CustomWithAliasedImports />
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
import Basic from './js-pug/BasicTest.vue'
import Imports from './js-pug/ImportsTest.vue'
import AliasedImports from './js-pug/AliasedImports.vue'
import CustomWithImports from './js-pug/CustomWithImports.vue'
import CustomWithAliasedImports from './js-pug/CustomWithAliasedImports.vue'
import MixedCase from './js-pug/MixedCase.vue'
import MixedCaseWithDuplicates from './js-pug/MixedCaseWithDuplicates.vue'
import MixedCaseWithDuplicatesAndAliasedImports from './js-pug/MixedCaseWithDuplicatesAndAliasedImports.vue'
import WithDirective from './js-pug/WithDirective.vue'
import ExtendBtn from './js-pug/ExtendBtn.vue'
</script>
