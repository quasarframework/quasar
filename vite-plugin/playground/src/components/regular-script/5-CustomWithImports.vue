<template>
  <h3>With Custom Component and Imports</h3>

  <div>
    <q-btn label="Click me" />

    <q-icon name="map" />

    <custom-component />
  </div>
</template>

<script>
import { QBtn, Notify } from 'quasar'
import { defineComponent } from 'vue'
import CustomComponent from './custom-component.js'

console.log(QBtn)
console.log('Notify', Notify)

export default defineComponent({
  name: 'RSCustomWithImports',
  components: {
    CustomComponent
  }
})
</script>
