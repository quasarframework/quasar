<template>
  <h3>Only Custom Component and Imports</h3>

  <div>
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
  name: 'RSOnlyCustomWithImports',
  components: {
    CustomComponent
  }
})
</script>
