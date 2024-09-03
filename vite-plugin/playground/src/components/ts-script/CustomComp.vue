<template>
  <h6>With Custom Component</h6>

  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
    <custom-component />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CustomComponent from './custom-component.ts'

export default defineComponent({
  name: 'RSCustom',
  components: {
    CustomComponent
  }
})
</script>
