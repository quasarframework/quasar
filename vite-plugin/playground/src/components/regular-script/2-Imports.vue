<template>
  <h3>With Imports</h3>

  <div>
    <q-btn label="Click me" />

    <q-icon name="map" />
  </div>
</template>

<script>
import { QBtn, Notify } from 'quasar'
import { defineComponent } from 'vue'

console.log(QBtn)
console.log('Notify', Notify)

export default defineComponent({
  name: 'RSImports'
})
</script>
