<template>
  <h3>Only Custom Component and Aliased Imports</h3>

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
  name: 'RSOnlyCustomWithAliasedImports',
  components: {
    CustomComponent
  }
})
</script>
