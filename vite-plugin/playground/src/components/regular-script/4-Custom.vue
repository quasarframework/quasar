<template>
  <h3>With Custom Component</h3>

  <div>
    <q-btn label="Click me" />

    <q-icon name="map" />

    <custom-component />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CustomComponent from './custom-component.js'

export default defineComponent({
  name: 'RSCustom',
  components: {
    CustomComponent
  }
})
</script>
