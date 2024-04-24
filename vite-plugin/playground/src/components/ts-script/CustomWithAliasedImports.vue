<template>
  <h6>With Custom Component with Aliased Imports</h6>

  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
    <custom-component />
  </div>
</template>

<script lang="ts">
import { QBtn as Mimi, Notify } from 'quasar'
import { defineComponent } from 'vue'
import CustomComponent from './custom-component.ts'

console.log(Mimi)
console.log('Notify', Notify)

export default defineComponent({
  name: 'RSCustomWithAliasedImports',
  components: {
    CustomComponent
  }
})
</script>
