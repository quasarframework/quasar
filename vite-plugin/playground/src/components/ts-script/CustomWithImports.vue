<template>
  <h6>With Custom Component and Imports</h6>

  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
    <custom-component />
  </div>
</template>

<script lang="ts">
import { QBtn, Notify } from 'quasar'
import { defineComponent } from 'vue'
import CustomComponent from './custom-component.ts'

console.log(QBtn)
console.log('Notify', Notify)

export default defineComponent({
  name: 'RSCustomWithImports',
  components: {
    CustomComponent
  }
})
</script>
