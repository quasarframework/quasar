<template>
  <h3>With Custom Component with Aliased Imports</h3>

  <div>
    <q-btn label="Click me" />

    <q-icon name="map" />

    <custom-component />
  </div>
</template>

<script>
import { QBtn as Mimi, Notify } from 'quasar'
import { defineComponent } from 'vue'
import CustomComponent from './custom-component.js'

console.log(Mimi)
console.log('Notify', Notify)

export default defineComponent({
  name: 'RSCustomWithAliasedImports',
  components: {
    CustomComponent
  }
})
</script>
