<template>
  <h6>With Aliased Imports</h6>

  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
  </div>
</template>

<script lang="ts">
import { QBtn as SomeComponent, Notify } from 'quasar'
import { defineComponent } from 'vue'

console.log(SomeComponent)
console.log('Notify', Notify)

export default defineComponent({
  name: 'RSAliasedImports'
})
</script>
